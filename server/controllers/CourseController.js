
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import Coaches from "../models/coach.js";

export const getCourses = async (req, res) => {
  try {
    const { profileId, is_coach } = req.user;

    let courses;

    if (is_coach) {
      const coach = await Coaches.findOne({ where: { profileId } });

      courses = await Course.findAll({ where: { coachId: coach.id } });

      return res.json(
        courses.map(c => ({
          ...c.toJSON(),
          coachId: coach.id
        }))
      );
    }

    courses = await Course.findAll({
      include: [
        {
          model: Coaches,
          attributes: ["id"]
        }
      ]
    });

    return res.json(
      courses.map(c => ({
        ...c.toJSON(),
        coachId: c.Coach?.id ?? c.coachId
      }))
    );
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("Get course by ID error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, oldPrice } = req.body;
    const { id, profileId, is_coach } = req.user; // assuming verifyToken adds user to req

    if (!is_coach) {
      return res.status(403).json({ message: "Only coaches can create courses" });
    }

    if (!title || price === undefined) {
      return res.status(400).json({ message: "Title and price are required" });
    }
    
    const coach = await Coaches.findOne({ where: { profileId } });

    const newCourse = await Course.create({
      title,
      description,
      price,
      oldPrice,
      coachId: coach.id,
    });

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { profileId, is_coach } = req.user;
    const { title, description, price, oldPrice } = req.body;

    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (is_coach && course.coachId !== profileId) {
      return res.status(403).json({ message: "You cannot edit this course" });
    }

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ?? course.price;
    course.oldPrice = oldPrice ?? course.oldPrice;

    await course.save();
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { profileId, is_coach } = req.user;

    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (is_coach && course.coachId !== profileId) {
      return res.status(403).json({ message: "You cannot delete this course" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPurchasedCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.findAll({
      where: { userId },
      include: [{
        model: Course,
        include: [{ model: Coaches, attributes: ["id"] }]
      }]
    });

    const courses = purchases.map(p => ({
      ...p.Course.toJSON(),
      coachId: p.Course.Coach?.id ?? p.Course.coachId
    }));

    res.json(courses);
  } catch (err) {
    console.error("Get purchased courses error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const uploadCourseMaterial = async (req, res) => {
  try {
    const courseId = req.params.id;
  
    const user = req.user;

    const course = await Course.findOne({ where: { id: courseId } });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isAdmin = Boolean(user.is_admin);
    const isOwner = user.id === course.coachId || user.id === course.userId; 
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: cannot upload to this course" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }


    const materialUrl = `/uploads/${req.file.filename}`;
    course.materialUrl = materialUrl;
    await course.save();

    return res.status(200).json({
      message: "Material uploaded successfully",
      materialUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server error uploading material" });
  }
};
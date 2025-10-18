// controllers/courseController.js
import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
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

    if (!title || price === undefined) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const newCourse = await Course.create({ title, description, price, oldPrice });
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, oldPrice } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

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
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: err.message });
  }
};

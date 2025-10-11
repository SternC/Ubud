import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// POST /api/purchase → Buy a course
export const createPurchase = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check for duplicates
    const existing = await Purchase.findOne({ where: { userId, courseId } });
    if (existing) {
      return res.status(400).json({ message: "You already own this course" });
    }

    // Get course info
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Create purchase with title and price
    const purchase = await Purchase.create({
      userId,
      courseId,
      title: course.title,
      price: course.price,
    });

    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating purchase" });
  }
};

// GET /api/purchases/:userId → Get all purchased courses
export const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;

    const purchases = await Purchase.findAll({
      where: { userId },
      attributes: ["id", "courseId", "title", "price", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const formatted = purchases.map((p) => ({
      id: p.id,
      courseId: p.courseId,
      title: p.title,
      price: p.price,
      date: new Date(p.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching purchases" });
  }
};

// GET /api/transactions/:userId → Get formatted transactions
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Purchase.findAll({
      where: { userId },
      attributes: ["id", "title", "price", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const formatted = transactions.map((t) => ({
      id: t.id,
      courseTitle: t.title,
      price: t.price,
      date: new Date(t.createdAt).toLocaleString(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

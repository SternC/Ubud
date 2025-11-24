import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();


import User from "./models/User.js";
import Course from "./models/Course.js";
import Purchase from "./models/Purchase.js";
import Subcourse from "./models/Subcourse.js";
import Material from "./models/Material.js";
import Comment from "./models/Comment.js";




Purchase.belongsTo(User, { foreignKey: "userId" });
Purchase.belongsTo(Course, { foreignKey: "courseId", targetKey: "id" });
Course.hasMany(Purchase, { foreignKey: "courseId", sourceKey: "id" });
Purchase.belongsTo(Course, { foreignKey: "courseId", targetKey: "id" });
Subcourse.hasMany(Material, { foreignKey: "subcourseId" });
Material.belongsTo(Subcourse, { foreignKey: "subcourseId" });
Material.hasMany(Comment, { foreignKey: "materialId" });
Comment.belongsTo(Material, { foreignKey: "materialId" });



try {
  await sequelize.authenticate();
  console.log("✅ Database connected");

 await sequelize.sync();

  console.log(" Models synced");
} catch (err) {
  console.error("❌ Database connection error:", err);
}

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
const __dirname = process.cwd();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import subcourseRoutes from "./routes/subcourseRoutes.js";
app.use("/api", subcourseRoutes);






app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", profileRoutes);
app.use("/api", coachRoutes); 



app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();


import User from "./models/User.js";
import Course from "./models/Course.js";
import Purchase from "./models/Purchase.js";

Purchase.belongsTo(User, { foreignKey: "userId" });
Purchase.belongsTo(Course, { foreignKey: "courseId", targetKey: "id" });
Course.hasMany(Purchase, { foreignKey: "courseId", sourceKey: "id" });
Purchase.belongsTo(Course, { foreignKey: "courseId", targetKey: "id" });


try {
  await sequelize.authenticate();
  console.log("✅ Database connected");

  await sequelize.sync({alter: true}); 
  console.log("📦 Models synced");
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


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";

app.use(authRoutes);
app.use(userRoutes);
app.use("/", courseRoutes);
app.use("/", purchaseRoutes);
app.use("/", profileRoutes);
app.use("/", coachRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";


import User from "./models/User.js";
import Course from "./models/Course.js";
import Purchase from "./models/Purchase.js";

Purchase.belongsTo(User, { foreignKey: "userId" });
Purchase.belongsTo(Course, { foreignKey: "courseId" });

try {
  await sequelize.authenticate();
  console.log("✅ Database connected");

  await sequelize.sync(); 
  console.log("📦 Models synced");
} catch (err) {
  console.error("❌ Database connection error:", err);
}

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";

app.use(authRoutes);
app.use(userRoutes);
app.use("/", courseRoutes);
app.use("/", purchaseRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

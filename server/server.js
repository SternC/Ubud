// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// DB init
await sequelize.authenticate();
await sequelize.sync({});
console.log("Database connected");

// Routes
app.use(authRoutes);
app.use(userRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

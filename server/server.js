// server/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import models, { db } from "./models/index.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import coachApplicationRoutes from "./routes/coachApplicationRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import subcourseRoutes from "./routes/subcourseRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();
app.use(express.json());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/coach-applications", coachApplicationRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subcourses", subcourseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/availabilities", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// Sync DB and start
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.authenticate();
    console.log("DB connection OK");
    // For development only: sync; in production use migrations.
    await db.sync({ alter: true });
    console.log("DB synced");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
})();

// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import models from "../models/index.js";

const { User, Profile } = models;

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check cookie fallback
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");

    // Load User
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Load Profile
    const profile = await Profile.findOne({ where: { userId: user.id } });

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin
    };

    req.profile = profile
      ? {
          id: profile.id,
          userId: profile.userId,
          role: profile.role,
          name: profile.name,
          email: profile.email,
        }
      : null;

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

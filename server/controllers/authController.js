// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
dotenv.config();

const salt = 10;

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name: username, email, password: hash });
    await Profile.create({ userId: newUser.id, email, name: username });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ where: { name: username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const profile = await Profile.findOne({ where: { userId: user.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        profileId: profile.id,
        is_coach: profile.is_coach,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

    res.json({
      message: "Login successful",
      name: profile.name,
      email: profile.email,
      is_coach: profile.is_coach,
      is_admin: user.is_admin,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const authentication = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "is_admin"],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

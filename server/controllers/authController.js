
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js";
const { User, Profile } = models;

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";


export const register = async (req, res) => {
  try {
    const { name, email, password, age, interest, skill, city } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing required fields" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed });

    await Profile.create({
      userId: user.id,
      name,
      email,
      age: age || null,
      interest: interest || null,
      skill: skill || null,
      city: city || null,
      role: "student"
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Registered", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const profile = await Profile.findOne({ where: { userId: user.id } });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }, profile });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ error: "Server error" });
  }
};

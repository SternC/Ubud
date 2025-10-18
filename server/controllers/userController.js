import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email","is_admin"] });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {

    await User.destroy({ where: { id } });
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, is_admin } = req.body; 

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.is_admin = is_admin !== undefined ? is_admin : user.is_admin; 
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {
    const { id } = req.user;

    try {
        const profile = await Profile.findOne({where: {userId: id}});
        if (!profile) {
            return res.status(404).json({error: "Profile not found"});
        }

        res.status(200).json(profile);
   } catch (err) {
       console.error("Error fetching user profile:", err);
       res.status(500).json({ error: "Server error" });
   }
}

export const updateUserProfile = async (req, res) => {
    const { id } = req.user;
    const { name, email, age, interest, skill, city } = req.body;

    try {
      const profile = await Profile.findOne({ where: { userId: id } });
      if (!profile) {
          return res.status(404).json({ error: "Profile not found" });
      }

      profile.name = name;
      profile.email = email;
      profile.age = age;
      profile.interest = interest;
      profile.skill = skill;
      profile.city = city;

      await profile.save();
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ error: "Server error" });
    }
}

export const createUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, "your_jwt_secret");
    const admin = await User.findByPk(decoded.id);

    if (!admin.is_admin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { name, email, password, is_admin } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      is_admin: is_admin ? 1 : 0,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_admin: newUser.is_admin,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error creating user" });
  }
};

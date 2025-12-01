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
  const requesterId = req.user.id;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.destroy({ where: { id } });

    if (parseInt(id) === requesterId) {
      res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    }

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
  const { name, email, is_admin, password } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.id != id) {
        return res.status(400).json({ error: "Email already used by another user" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (is_admin !== undefined) user.is_admin = is_admin;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return res.status(200).json({ message: "User updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Server error" });
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

    await Profile.create({ userId: newUser.id, email, name: name });

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
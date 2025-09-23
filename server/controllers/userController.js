import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email"] });
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
  const { name, email } = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
    const { id } = req.user.id;

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
    const { id } = req.user.id;
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

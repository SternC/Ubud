import Profile from "../models/Profile.js";


export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({ order: [["userId", "ASC"]] });
    res.json(profiles);
  } catch (err) {
    console.error("Get profiles error:", err);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.update(req.body);
    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.destroy();
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
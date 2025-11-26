import models from "../models/index.js";
const { Profile } = models;

export const requireRole = (roles) => {

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return async (req, res, next) => {
    try {
      const profile = req.profile;
      if (!profile) {
  
        if (!req.user) return res.status(401).json({ error: "Not authenticated" });
        const p = await Profile.findOne({ where: { user_id: req.user.id } });
        if (!p) return res.status(403).json({ error: "Profile not found" });
        req.profile = p;
      }
      if (!roleArray.includes(req.profile.role)) {
        return res.status(403).json({ error: "Forbidden — insufficient role" });
      }
      next();
    } catch (err) {
      console.error("requireRole error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    return res.status(401).json({ error: "Unauthorized" });
  }
};

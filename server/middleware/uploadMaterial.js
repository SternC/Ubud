
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir + "/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.random().toString(36).slice(2,8) + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

export default upload;
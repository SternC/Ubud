import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const salt = 10;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const sequelize = new Sequelize('ubud_project', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users', // force table name to 'users'
  timestamps: false   // don’t add createdAt/updatedAt columns
});

await sequelize.authenticate();     // check connection
await sequelize.sync();             // creates table if it doesn’t exist
console.log('Database connected and users table ready');

// --- Register route ---
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, salt);
    await User.create({
      name: username,
      email: email,
      password: hash
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const salt = 10;
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
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

// Registration endpoint
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

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ where: { name: username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const name = username;
    const token = jwt.sign({ name }, 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Dashboard endpoint (protected)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    } else {
        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            req.user = decoded;
            next();
        });
    }
}

app.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the dashboard!", name: req.user.name });
});

app.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/edit/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

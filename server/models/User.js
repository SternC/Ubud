import { DataTypes } from "sequelize";
import db from "../config/database.js";
import StudentProgress from "./studentProgress.js";

const User = db.define("User", {
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
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "users",
  timestamps: false
});

StudentProgress.belongsTo(User, { foreignKey: "studentId" });
User.hasMany(StudentProgress, { foreignKey: "studentId" });

export default User;
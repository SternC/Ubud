import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StudentProgress = sequelize.define("StudentProgress", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  courseId: {
    type: DataTypes.STRING,   // UUID for course
    allowNull: false,
  },

  // Only one of these will be filled for each row
  subcourseId: {
    type: DataTypes.INTEGER,  // INT is correct unless you use UUID for subcourse
    allowNull: true,
  },

  assignmentId: {
    type: DataTypes.INTEGER,  // Change to STRING if assignment uses UUID
    allowNull: true,
  },

  isDone: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

}, {
  tableName: "student_progress",
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ["studentId", "courseId", "subcourseId"],
    },
    {
      unique: true,
      fields: ["studentId", "courseId", "assignmentId"],
    },
  ],
});

export default StudentProgress;

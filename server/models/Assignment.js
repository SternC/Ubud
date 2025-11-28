import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Course from "./Course.js"; 
import { v4 as uuidv4 } from "uuid";

const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    pdfUrl: {
      type: DataTypes.STRING,
    },
    studentAnswerUrl: {
      type: DataTypes.STRING,
    },
    coachReviewUrl: {
      type: DataTypes.STRING,
    },

    // MUST MATCH Course.id EXACTLY
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "courses", // MUST match tableName, not model name
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "assignments",
    timestamps: true,
  }
);

Assignment.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Assignment, { foreignKey: "courseId" });

export default Assignment;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Coaches from "./coach.js";
import { v4 as uuidv4 } from "uuid";
import StudentProgress from "./studentProgress.js";

const Course = sequelize.define(
  "Course",
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
    price: DataTypes.FLOAT,
    oldPrice: DataTypes.FLOAT,
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "coaches",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    materialUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

Course.belongsTo(Coaches, { foreignKey: "coachId" });
Coaches.hasMany(Course, { foreignKey: "coachId" });

Course.hasMany(StudentProgress, { foreignKey: "courseId" });
StudentProgress.belongsTo(Course, { foreignKey: "courseId" });


export default Course;

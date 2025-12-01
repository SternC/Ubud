// server/models/Subcourse.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import StudentProgress from "./studentProgress.js";

const Subcourse = sequelize.define("Subcourse", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  courseId: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "subcourses",
  timestamps: true
});

Subcourse.hasMany(StudentProgress, { foreignKey: "subcourseId" });
StudentProgress.belongsTo(Subcourse, { foreignKey: "subcourseId" });


export default Subcourse;
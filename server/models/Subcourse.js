import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Subcourse = db.define(
  "Subcourse",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "courses", key: "id" }
    },
    title: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "subcourses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Subcourse;

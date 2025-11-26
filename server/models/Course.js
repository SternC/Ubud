import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Course = db.define(
  "Course",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coach_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coaches", key: "id" }
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    old_price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    material_url: { type: DataTypes.STRING(1024), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "courses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Course;

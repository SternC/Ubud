import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Material = db.define(
  "Material",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subcourse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "subcourses", key: "id" }
    },
    type: { type: DataTypes.ENUM("file", "youtube"), allowNull: false },
    file_url: { type: DataTypes.STRING(1024), allowNull: true },
    youtube_url: { type: DataTypes.STRING(1024), allowNull: true },
    original_name: { type: DataTypes.STRING(1024), allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "materials",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Material;

// server/models/Material.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Material = sequelize.define("Material", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subcourseId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'file' | 'youtube'
  fileUrl: { type: DataTypes.STRING, allowNull: true },
  youtubeUrl: { type: DataTypes.STRING, allowNull: true },
  originalName: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true }, // 'notes','video','assignment', etc
  position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // ordering
}, {
  tableName: "materials",
  timestamps: true
});

export default Material;
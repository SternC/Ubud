import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  
  materialId: { type: DataTypes.INTEGER, allowNull: true }, // matches Material.id
  assignmentId: { type: DataTypes.STRING, allowNull: true }, // matches Assignment.id (UUID)
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "comments",
  timestamps: true,
});

export default Comment;

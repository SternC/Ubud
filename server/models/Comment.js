// server/models/Comment.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  materialId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "comments",
  timestamps: true
});

export default Comment;

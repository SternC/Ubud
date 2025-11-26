import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Purchase = db.define(
  "Purchase",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
    course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "courses", key: "id" } },
    title: { type: DataTypes.STRING(255), allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "purchases",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Purchase;

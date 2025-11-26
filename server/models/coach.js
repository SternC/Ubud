import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Coach = db.define(
  "Coach",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "profiles", key: "id" }
    },
    teaching_field: { type: DataTypes.STRING(255), allowNull: true },
    drive_link: { type: DataTypes.STRING(1024), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "coaches",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Coach;

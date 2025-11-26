import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Availability = db.define(
  "Availability",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coach_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "coaches", key: "id" } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    is_available: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    max_students: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "availabilities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Availability;

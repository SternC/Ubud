import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Appointment = db.define(
  "Appointment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
    coach_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "coaches", key: "id" } },
    availability_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "availabilities", key: "id" } },
    course_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: "courses", key: "id" } },
    appointment_datetime: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"), allowNull: false, defaultValue: "pending" },
    meeting_link: { type: DataTypes.STRING(1024), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Appointment;

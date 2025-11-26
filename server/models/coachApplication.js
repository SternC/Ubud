import { DataTypes } from "sequelize";
import db from "../config/database.js";

const CoachApplication = db.define(
  "CoachApplication",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "profiles", key: "id" }
    },
    submitted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending"
    },
    application_data: { type: DataTypes.JSON, allowNull: true },
    admin_notes: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    tableName: "coach_applications",
    timestamps: false
  }
);

export default CoachApplication;

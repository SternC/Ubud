import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Coaches from "./coach.js";
import Availability from "./availability.js";
import Profile from "./Profile.js";

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Coaches,
      key: "id",
    },
  },
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Availability,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
    defaultValue: "confirmed", // Asumsi langsung confirm saat booking
  },
});

export default Appointment;
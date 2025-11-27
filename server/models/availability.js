import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Sesuaikan path config database kamu
import Coaches from "./coach.js";

const Availability = sequelize.define("Availability", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Coaches,
      key: "id",
    },
  },
  date: {
    type: DataTypes.DATEONLY, // Format YYYY-MM-DD
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME, // Format HH:MM:SS
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("available", "booked"),
    defaultValue: "available",
  },
});

// Relasi akan kita set di index.js atau server.js, tapi definisikan di sini juga baik
Availability.belongsTo(Coaches, { foreignKey: "coachId" });

export default Availability;
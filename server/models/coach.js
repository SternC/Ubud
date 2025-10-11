import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Coaches = db.define("Coaches", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driveLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachingField: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

export default Coach;
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Assessment = db.define("Assessment", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "assessments",
  timestamps: true
});

export default Assessment;

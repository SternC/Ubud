import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  oldPrice: DataTypes.FLOAT,
});

export default Course;
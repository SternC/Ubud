import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const Purchase = sequelize.define("Purchase", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {              
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {               
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Purchase.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Purchase, { foreignKey: "userId" });

Purchase.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Purchase, { foreignKey: "courseId" });

export default Purchase;
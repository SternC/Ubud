import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Profile from "./Profile.js";
import { v4 as uuidv4 } from "uuid";

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(), // fixed
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    oldPrice: DataTypes.FLOAT,
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profiles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

Course.belongsTo(Profile, { foreignKey: "coachId" });
Profile.hasMany(Course, { foreignKey: "coachId" });

export default Course;

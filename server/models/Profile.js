import { DataTypes } from 'sequelize';
import db from "../config/database.js";

const Profile = db.define('Profile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.STRING,
  },
  interest: {
    type: DataTypes.STRING,
  },
  skill: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  }
}, {
    tableName: 'profiles',
    timestamps: false
});

export default Profile;

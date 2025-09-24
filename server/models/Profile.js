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
    defaultValue: 'John Smith'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.STRING,
    defaultValue: '21'
  },
  interest: {
    type: DataTypes.STRING,
    defaultValue: 'Coding, Design'
  },
  skill: {
    type: DataTypes.STRING,
    defaultValue: 'React, Tailwind'
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'Jakarta'
  }
}, {
    tableName: 'profiles',
    timestamps: false
});

export default Profile;

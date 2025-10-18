import { DataTypes } from 'sequelize';
import db from "../config/database.js";

const Profile = db.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  age: DataTypes.STRING,
  interest: DataTypes.STRING,
  skill: DataTypes.STRING,
  city: DataTypes.STRING
}, {
  tableName: 'profiles',
  timestamps: false
});

export default Profile;

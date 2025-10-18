import { DataTypes } from 'sequelize';
import db from "../config/database.js";
import User from './User.js';

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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: DataTypes.STRING,
  interest: DataTypes.STRING,
  skill: DataTypes.STRING,
  city: DataTypes.STRING,
  is_coach: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'profiles',
  timestamps: false
});

Profile.belongsTo(User, { foreignKey: "userId" });

export default Profile;

import { DataTypes } from 'sequelize';
import db from '../config/database.js'; // ← GANTI IMPORT

const Profile = db.define('Profile', {
  id: {
    type: DataTypes.INTEGER, // ← UBAH KE INTEGER (match dengan database)
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Profile;
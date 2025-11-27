import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Profile from "./Profile.js";

const Coach = db.define("Coaches", {
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profiles', 
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  driveLink: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teachingField: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending"
  },
}, {
  tableName: 'coaches',
  timestamps: false
});

// Associations
Profile.hasOne(Coach, { foreignKey: 'profileId', onDelete: 'CASCADE', hooks: true });
Coach.belongsTo(Profile, { foreignKey: 'profileId' });

export default Coach;
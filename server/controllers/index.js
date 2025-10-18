import User from './User.js';
import Profile from './Profile.js';
import Course from './Course.js';
import Purchase from './Purchase.js'; 

// Relationships

User.hasOne(Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});
Profile.belongsTo(User, {
  foreignKey: 'userId'
});

import User from './User.js';
import Profile from './Profile.js';

// Relationships

User.hasOne(Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true
});
Profile.belongsTo(User, {
  foreignKey: 'userId'
});

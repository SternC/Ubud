import User from './User.js';
import Profile from './Profile.js';

// Relationships

User.hasOne(Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Profile.belongsTo(User, {
  foreignKey: 'userId'
});

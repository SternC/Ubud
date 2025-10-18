import User from './User.js';
import Profile from './Profile.js';
import Course from './Course.js';
import Purchase from './Purchase.js';
import Coach from './coach.js';

// User ↔ Profile
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Profile ↔ Coach
Profile.hasOne(Coach, { foreignKey: 'profileId', onDelete: 'CASCADE', hooks: true });
Coach.belongsTo(Profile, { foreignKey: 'profileId' });

export { User, Profile, Course, Purchase, Coach };

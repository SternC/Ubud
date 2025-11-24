import db from '../config/database.js';

// Import models dengan path yang benar
import User from './User.js';
import Course from './Course.js';
import Profile from './Profile.js';
import Purchase from './Purchase.js';
import Coach from './Coach.js';
import Availability from './availability.js';
import Appointment from './appointment.js';

const models = {
  User,
  Course,
  Profile,
  Purchase,
  Coach,
  Availability,
  Appointment
};
const setupAssociations = () => {
  try {
    console.log('Setting up associations...');
    
    User.hasOne(Profile, { foreignKey: 'userId' });
    User.hasMany(Course, { foreignKey: 'coachId' });
    User.hasMany(Purchase, { foreignKey: 'studentId' });
    User.hasMany(Availability, { as: 'Availabilities', foreignKey: 'coachId' });
    User.hasMany(Appointment, { as: 'StudentAppointments', foreignKey: 'studentId' });
    User.hasMany(Appointment, { as: 'CoachAppointments', foreignKey: 'coachId' });

    Profile.belongsTo(User, { foreignKey: 'userId' });

    Course.belongsTo(Profile, { foreignKey: 'coachId' });
    Course.hasMany(Purchase, { foreignKey: 'courseId' });
    Course.hasMany(Appointment, { foreignKey: 'courseId' });

    Purchase.belongsTo(User, { foreignKey: 'userId' });
    Purchase.belongsTo(Course, { foreignKey: 'courseId' });

    Coach.belongsTo(Profile, { foreignKey: 'profileId' });

    Availability.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' });
    Availability.hasMany(Appointment, { foreignKey: 'availabilityId' });

    Appointment.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });
    Appointment.belongsTo(User, { as: 'Coach', foreignKey: 'coachId' });
    Appointment.belongsTo(Availability, { foreignKey: 'availabilityId' });
    Appointment.belongsTo(Course, { foreignKey: 'courseId' });

    console.log('Associations setup completed!');
  } catch (error) {
    console.error('Error setting up associations:', error);
  }
};

setupAssociations();

export {
  db as sequelize,
  User,
  Course,
  Profile,
  Purchase,
  Coach,
  Availability,
  Appointment
};

export default db;
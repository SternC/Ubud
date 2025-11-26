import db from "../config/database.js";
import User from "./User.js";
import Profile from "./Profile.js";
import CoachApplication from "./coachApplication.js";
import Coach from "./coach.js";
import Course from "./Course.js";
import Subcourse from "./Subcourse.js";
import Material from "./Material.js";
import Comment from "./Comment.js";
import Purchase from "./Purchase.js";
import Availability from "./Availability.js";
import Appointment from "./Appointment.js";

/* Associations */

User.hasOne(Profile, { foreignKey: "user_id", as: "profile", onDelete: "CASCADE", onUpdate: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "user_id", as: "user" });

Profile.hasMany(CoachApplication, { foreignKey: "profile_id", as: "applications" });
CoachApplication.belongsTo(Profile, { foreignKey: "profile_id", as: "profile" });

Profile.hasOne(Coach, { foreignKey: "profile_id", as: "coach" });
Coach.belongsTo(Profile, { foreignKey: "profile_id", as: "profile" });

Coach.hasMany(Course, { foreignKey: "coach_id", as: "courses" });
Course.belongsTo(Coach, { foreignKey: "coach_id", as: "coach" });

Course.hasMany(Subcourse, { foreignKey: "course_id", as: "subcourses" });
Subcourse.belongsTo(Course, { foreignKey: "course_id", as: "course" });

Subcourse.hasMany(Material, { foreignKey: "subcourse_id", as: "materials" });
Material.belongsTo(Subcourse, { foreignKey: "subcourse_id", as: "subcourse" });

Material.hasMany(Comment, { foreignKey: "material_id", as: "comments" });
Comment.belongsTo(Material, { foreignKey: "material_id", as: "material" });

User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(Purchase, { foreignKey: "user_id", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "user_id", as: "user" });

Course.hasMany(Purchase, { foreignKey: "course_id", as: "purchases" });
Purchase.belongsTo(Course, { foreignKey: "course_id", as: "course" });

Coach.hasMany(Availability, { foreignKey: "coach_id", as: "availabilities" });
Availability.belongsTo(Coach, { foreignKey: "coach_id", as: "coach" });

User.hasMany(Appointment, { foreignKey: "student_id", as: "student_appointments" });
Appointment.belongsTo(User, { foreignKey: "student_id", as: "student" });

Coach.hasMany(Appointment, { foreignKey: "coach_id", as: "appointments" });
Appointment.belongsTo(Coach, { foreignKey: "coach_id", as: "coach" });

Availability.hasMany(Appointment, { foreignKey: "availability_id", as: "appointments" });
Appointment.belongsTo(Availability, { foreignKey: "availability_id", as: "availability" });

Course.hasMany(Appointment, { foreignKey: "course_id", as: "appointments" });
Appointment.belongsTo(Course, { foreignKey: "course_id", as: "course" });

const models = {
  db,
  User,
  Profile,
  CoachApplication,
  Coach,
  Course,
  Subcourse,
  Material,
  Comment,
  Purchase,
  Availability,
  Appointment
};

export default models;
export {
  db,
  User,
  Profile,
  CoachApplication,
  Coach,
  Course,
  Subcourse,
  Material,
  Comment,
  Purchase,
  Availability,
  Appointment
};

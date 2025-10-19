import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import Assessment from "./Assessment.js";

const Submission = sequelize.define("Submission", {
  assessmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Assessments", key: "id" },
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Assessment.hasMany(Submission, { foreignKey: "assessmentId" });
Submission.belongsTo(Assessment, { foreignKey: "assessmentId" });

export default Submission;

import { Sequelize } from "sequelize";

const db = new Sequelize("ubud_project", "root", "", {
  host: "localhost",
  dialect: "mysql"
});

export default db;

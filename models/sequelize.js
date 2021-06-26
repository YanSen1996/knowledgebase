import Sequelize from "sequelize";

import { modelDebugger } from "../logger";

const sequelize = new Sequelize("knowledgebase", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  logging: process.env.SEQUELIZE_LOG === "true",
});

sequelize
  .authenticate()
  .then(() => {
    modelDebugger("Connection has been established successfully.");
  })
  .catch((error) => {
    modelDebugger("Unable to connect to the database:", error);
  });

export default sequelize;

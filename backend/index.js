import express from "express";
import knex from "./knex/knex.js";

const PORT = process.env.PORT || 3001;
const app = express();

async function assertDatabaseConnection() {
  return knex
    .raw("select 1+1 as result")
    .then((queryResult) => console.log(queryResult.rows))
    .catch((err) => {
      console.log(
        "[Fatal] Failed to establish connection to database! Exiting..."
      );
      console.log(err);
      process.exit(1);
    });
}

await assertDatabaseConnection();
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

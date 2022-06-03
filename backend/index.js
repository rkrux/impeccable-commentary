import express from "express";
import knex from "./knex/knex.js";
import "dotenv/config";

const PORT = process.env.PORT || 3001;
const app = express();

(async function assertDbConnection() {
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
})();

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

/**
 * TODOs
 * - Migrate and seed comments, commentUpvotes
 * - listUsers API
 * - submitComment API
 * - upvoteComment API
 * - listComments API
 */

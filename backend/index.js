import express from "express";
import knex from "./knex/knex.js";
import "dotenv/config";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

(async function assertDBConnection() {
  return knex
    .raw("select 1+1 as result")
    .then(() => console.log("Connected to database"))
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

app.get("/users", (_, res) => {
  knex("userss")
    .select("userId", "userName")
    .then((users) => res.json({ users }))
    .catch((error) => {
      res.status(500);
      res.json({ error });
    });
});

/**
 * TODOs
 * - submitComment API
 * - upvoteComment API
 * - listComments API
 */

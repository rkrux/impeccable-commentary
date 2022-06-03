import knex from "./knex/knex.js";

async function testDBConnection() {
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
}

async function getUsers() {
  return await knex("users").select("userId", "userName");
}

async function getComments() {
  return await knex("comments")
    .join("users", "comments.userId", "=", "users.userId")
    .select(
      "comments.commentId",
      "comments.commentText",
      "comments.userId",
      "users.userName"
    );
}

async function getUpvotesByComment() {
  return await knex.raw(
    'select "commentId", count("userId") from "commentUpvotes" group by "commentId"'
  );
}

export { testDBConnection, getUsers, getComments, getUpvotesByComment };

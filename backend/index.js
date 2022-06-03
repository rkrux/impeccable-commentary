import express from "express";
import "dotenv/config";
import {
  testDBConnection,
  getUsers,
  getComments,
  getUpvotesByComment,
} from "./queries.js";

testDBConnection();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

const buildError = (res, error) => {
  res.status(500);
  res.json({ error });
};

app.get("/users", (_, res) => {
  getUsers()
    .then((users) => res.json({ users }))
    .catch((error) => {
      buildError(res, error);
    });
});

app.get("/comments", (_, res) => {
  getComments()
    .then((comments) => {
      getUpvotesByComment()
        .then((upvotesByCommentArray) => {
          const upvotesByComment = upvotesByCommentArray.rows.reduce(
            (acc, val) => ({ ...acc, [val.commentId]: val.count }),
            {}
          );
          const commentsWithUpvotes = comments.map((comment) => {
            return {
              ...comment,
              upvotes: upvotesByComment[comment.commentId],
            };
          });
          res.json({ comments: commentsWithUpvotes });
        })
        .catch((error) => {
          buildError(res, error);
        });
    })
    .catch((error) => {
      buildError(res, error);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

/**
 * TODOs
 * - Proper Error handling
 * - submitComment API
 * - upvoteComment API
 */

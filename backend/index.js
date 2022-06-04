import express from 'express';
import 'dotenv/config';
import {
  testDBConnection,
  getUsers,
  getComments,
  getUpvotesByComment,
  addComment,
} from './queries.js';

testDBConnection();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

const buildError = (api, res, error) => {
  console.log(`Error in ${api}: ${error}`);
  res.status(500);
  res.json({ error });
};

app.get('/users', async (_, res) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (error) {
    buildError('/users', res, error);
  }
});

app.get('/comments', async (_, res) => {
  try {
    const comments = await getComments();
    const upvotesByCommentArray = await getUpvotesByComment();
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
  } catch (error) {
    buildError('/comments', res, error);
  }
});

app.post('/comment', async (req, res) => {
  try {
    await addComment(req.body);
    return res.json({});
  } catch (error) {
    buildError('/comment', res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

/**
 * TODOs
 * - Proper Error handling
 * - upvoteComment API
 */

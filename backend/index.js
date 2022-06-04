import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  testDBConnection,
  getUsers,
  getComments,
  getUpvotesByComment,
  addComment,
  addUpvote,
} from './queries.js';

testDBConnection();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());

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
    buildError('get/users', res, error);
  }
});

app.get('/comments', async (_, res) => {
  try {
    const comments = await getComments();
    const upvotesByCommentArray = await getUpvotesByComment();
    const upvotesByComment = upvotesByCommentArray.rows.reduce(
      //BigInt type is returned as string in query results: https://github.com/knex/knex/issues/387
      (acc, val) => ({ ...acc, [val.commentId]: Number(val.count) }),
      {}
    );
    const commentsWithUpvotes = comments.map((comment) => {
      return {
        ...comment,
        upvotes: upvotesByComment[comment.commentId] ?? 0,
      };
    });
    res.json({ comments: commentsWithUpvotes });
  } catch (error) {
    buildError('get/comments', res, error);
  }
});

app.post('/comment', async (req, res) => {
  try {
    await addComment(req.body);
    return res.json({});
  } catch (error) {
    buildError('post/comment', res, error);
  }
});

app.post('/upvote', async (req, res) => {
  try {
    await addUpvote(req.body);
    return res.json({});
  } catch (error) {
    buildError('post/upvote', res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';
import {
  testDBConnection,
  getUsers,
  getComments,
  getUpvotesGroupedByCommentId,
  getUpvotesByCommentId,
  addComment,
  addUpvote,
} from './queries.js';

testDBConnection();

// Express Configurations
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());

// Web Sockets Configurations
const httpServer = createServer(app);
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`A user is connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

const buildErrorResponse = (api, res, error, errorCode = 500) => {
  console.log(`Error in ${api}: ${error}`);
  res.status(errorCode);
  res.json({ error });
};

// Endpoints
app.get('/getUsers', async (_, res) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (error) {
    buildErrorResponse('get/users', res, error);
  }
});

app.get('/getComments', async (_, res) => {
  try {
    const comments = await getComments();
    const upvotesByCommentArray = await getUpvotesGroupedByCommentId();
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
    buildErrorResponse('get/comments', res, error);
  }
});

app.post('/addComment', async (req, res) => {
  const { commentText, userId } = req.body;

  // Req Param Validation
  if (!commentText || !userId) {
    buildErrorResponse(
      'post/comment',
      res,
      'One or more request params missing: commentText | userId',
      400
    );
    return;
  }

  try {
    await addComment(req.body);
    return res.json({});
  } catch (error) {
    buildErrorResponse('post/comment', res, error);
  }
});

app.post('/upvoteComment', async (req, res) => {
  const { commentId, userId } = req.body;

  // Req Param Validation
  if (!commentId || !userId) {
    buildErrorResponse(
      'post/upvote',
      res,
      'One or more request params missing: commentId | userId',
      400
    );
    return;
  }

  try {
    await addUpvote(req.body);
    const result = await getUpvotesByCommentId(commentId);
    const upvotes = Number(result.rows[0].count);
    io.emit('upvote-comment', {
      commentId,
      upvotes,
    });
    return res.json({ upvotes });
  } catch (error) {
    buildErrorResponse('post/upvote', res, error);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

import knex from './knex/knex.js';

async function testDBConnection() {
  return knex
    .raw('select 1+1 as result')
    .then(() => console.log('Connected to database'))
    .catch((err) => {
      console.log(
        '[Fatal] Failed to establish connection to database! Exiting...'
      );
      console.log(err);
      process.exit(1);
    });
}

async function getUsers() {
  return await knex('users').select('userId', 'userName');
}

async function getComments() {
  return await knex('comments')
    .join('users', 'comments.userId', '=', 'users.userId')
    .select(
      'comments.commentId',
      'comments.commentText',
      'comments.userId',
      'comments.createdAt',
      'users.userName'
    );
}

async function getUpvotesGroupedByCommentId() {
  return await knex.raw(
    'select "commentId", count("userId") from "commentUpvotes" group by "commentId"'
  );
}

async function getUpvotesByCommentId(commentId) {
  return await knex.raw(
    'select count("userId") from "commentUpvotes" where "commentId" = ?',
    [commentId]
  );
}

async function addComment({ commentText, userId, createdAt }) {
  await knex('comments').insert({
    commentText,
    userId,
    createdAt: createdAt ?? new Date(Date.now()).toISOString(),
  });
}

async function addUpvote({ commentId, userId, createdAt }) {
  await knex('commentUpvotes').insert({
    commentId,
    userId,
    createdAt: createdAt ?? new Date(Date.now()).toISOString(),
  });
}

export {
  testDBConnection,
  getUsers,
  getComments,
  getUpvotesGroupedByCommentId,
  getUpvotesByCommentId,
  addComment,
  addUpvote,
};

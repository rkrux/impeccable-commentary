import {
  mockPostCommentToAPI,
  mockGetCommentsFromAPI,
  mockUpvoteCommentToAPI,
} from './mocks';

const requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const BASE_URL = 'http://localhost:3001';

const apiConfig = {
  getUsers: {
    path: '/users',
    method: 'GET',
  },
  getComments: {
    path: '/comments',
    method: 'GET',
  },
  addComment: {
    path: '/comment',
    method: 'POST',
  },
  addUpvote: {
    path: '/upvote',
    method: 'POST',
  },
};

const api =
  ({ path, method, reqBody }) =>
  async () => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: JSON.stringify(reqBody),
    });
    return response.json();
  };

const getUsersFromAPI = api(apiConfig.getUsers);
const getCommentsFromAPI = api(apiConfig.getComments);
const postCommentToAPI = (reqBody) =>
  api({ ...apiConfig.addComment, reqBody })();
const upvoteCommentToAPI = (reqBody) =>
  api({ ...apiConfig.addUpvote, reqBody })();

export {
  getUsersFromAPI,
  getCommentsFromAPI,
  postCommentToAPI,
  upvoteCommentToAPI,
};

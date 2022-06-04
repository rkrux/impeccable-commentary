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
  ({ path, method }) =>
  async () => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
    });
    return response.json();
  };

const getUsersFromAPI = api(apiConfig.getUsers);
const getCommentsFromAPI = api(apiConfig.getComments);
const postCommentToAPI = mockPostCommentToAPI;
const upvoteCommentToAPI = mockUpvoteCommentToAPI;

export {
  getUsersFromAPI,
  getCommentsFromAPI,
  postCommentToAPI,
  upvoteCommentToAPI,
};

import envConfig from '../../env.config';

const requestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const BASE_API_URL = envConfig.env.BASE_API_URL;

const apiConfig = {
  getUsers: {
    path: '/getUsers',
    method: 'GET',
  },
  getComments: {
    path: '/getComments',
    method: 'GET',
  },
  addComment: {
    path: '/addComment',
    method: 'POST',
  },
  upvoteComment: {
    path: '/upvoteComment',
    method: 'POST',
  },
};

const api =
  ({ path, method, reqBody }) =>
  async () => {
    const response = await fetch(`${BASE_API_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: method === 'POST' && reqBody ? JSON.stringify(reqBody) : undefined,
    });
    return response.json();
  };

const getUsersFromAPI = api(apiConfig.getUsers);
const getCommentsFromAPI = api(apiConfig.getComments);
const addCommentToAPI = (reqBody) =>
  api({ ...apiConfig.addComment, reqBody })();
const upvoteCommentToAPI = (reqBody) =>
  api({ ...apiConfig.upvoteComment, reqBody })();

export {
  getUsersFromAPI,
  getCommentsFromAPI,
  addCommentToAPI,
  upvoteCommentToAPI,
};

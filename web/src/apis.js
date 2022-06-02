import {
  mockGetUsersFromAPI,
  mockPostCommentToAPI,
  mockGetCommentsFromAPI,
  mockUpvoteCommentToAPI,
} from "./mocks";

const getUsersFromAPI = mockGetUsersFromAPI;
const getCommentsFromAPI = mockGetCommentsFromAPI;
const postCommentToAPI = mockPostCommentToAPI;
const upvoteCommentToAPI = mockUpvoteCommentToAPI;

export {
  getUsersFromAPI,
  getCommentsFromAPI,
  postCommentToAPI,
  upvoteCommentToAPI,
};

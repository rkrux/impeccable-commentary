import { getRandomNumber } from '../utils';

const API_TIMEOUT_MS = 990,
  API_MAX_THRESHOLD_MS = 1000;

let mockStoredUser = [
  { userId: 1, userName: 'Martin Balsam' },
  { userId: 2, userName: 'John Fiedler' },
  { userId: 3, userName: 'Lee J Cobb' },
  { userId: 4, userName: 'E G Marshall' },
  { userId: 5, userName: 'Jack Klugman' },
  { userId: 6, userName: 'Edward Bins' },
  { userId: 7, userName: 'Bridget Stacey' },
  { userId: 8, userName: 'Henry Fonda' },
  { userId: 9, userName: 'Joseph Sweeney' },
  { userId: 10, userName: 'Ed Begley' },
  { userId: 11, userName: 'George Voskovec' },
  { userId: 12, userName: 'Robert Webber' },
];
let mockStoredComments = [
  {
    commentId: 2,
    userId: mockStoredUser[8].userId,
    userName: mockStoredUser[8].userName,
    createdAt: Date.now() - 1200000,
    commentText:
      'It takes a great deal of courage to stand alone even if you believe in something very strongly.',
    upvotes: 10,
  },
  {
    commentId: 1,
    userId: mockStoredUser[7].userId,
    userName: mockStoredUser[7].userName,
    createdAt: Date.now() - 14400000,
    commentText:
      "Nine of us now seem to feel that the defendant is innocent, but we're just gambling on probabilities.\
        We may be wrong. We may be trying to return a guilty man to the community. No one can really know.\
        But we have a reasonable doubt, and this is a safeguard that has enormous value in our system.\
        No jury can declare a man guilty unless it's sure. We nine can't understand how you three are still so sure.\
        Maybe you can tell us.",
    upvotes: 8,
  },
];

// Mock BE APIs to be used until BE integration is complete
const mockGetUsersFromAPI = async () => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        resolve(mockStoredUser);
      } else {
        reject(`Unable to fetch users, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const mockGetCommentsFromAPI = async () => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        resolve(mockStoredComments);
      } else {
        reject(`Unable to fetch comments, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const mockPostCommentToAPI = async (commentData) => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(API_MAX_THRESHOLD_MS);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        mockStoredComments = [
          {
            ...commentData,
            commentId: mockStoredComments.length + 1,
            upvotes: 0,
            createdAt: Date.now(),
          },
          ...mockStoredComments,
        ];
        resolve('Submitted');
      } else {
        reject(`Unable to submit comment, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const mockUpvoteCommentToAPI = async ({ commentId, userId }) => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(API_MAX_THRESHOLD_MS);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        let updatedUpvotes = 0;
        mockStoredComments
          .filter((comment) => comment.commentId === commentId)
          .forEach((commentToUpvote) => {
            commentToUpvote.upvotes++;
            updatedUpvotes = commentToUpvote.upvotes;
          });
        resolve({ updatedUpvotes });
      } else {
        reject(`Unable to upvote comment, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};

export const D = document;
export const $appInitialization = D.querySelector('#appInitialization');
export const $commentary = D.querySelector('#commentary');
export const $userDisplayPic = D.querySelector('#displayPic');
export const $commentInput = D.querySelector('#commentInput');
export const $commentSubmit = D.querySelector('#commentSubmit');
export const $commentList = D.querySelector('#commentList');
export const $commentLoader = D.querySelector('#commentLoader');
export const $commentListError = D.querySelector('#commentListError');
export const $notification = D.querySelector('#notification');
export const getCommentReplyContainerByCommentId = (commentId) =>
  D.querySelector(`#comment-${commentId}-reply-container`);
export const getCommentReplyInputByCommentId = (commentId) =>
  D.querySelector(`#comment-${commentId}-reply-input`);
export const getCommentReplySubmitByCommentId = (commentId) =>
  D.querySelector(`#comment-${commentId}-reply-submit`);

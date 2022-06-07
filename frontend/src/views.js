import { ASYNC_STATES } from './states';
import {
  D,
  $appInitialization,
  $commentary,
  $commentSubmit,
  $commentList,
  $commentLoader,
  $commentListError,
  $notification,
  getCommentReplyContainerByCommentId,
} from './domSelectors';
import { globalState, getStateUpdaterByStateType } from './states';
import {
  getFormattedDuration,
  handleCommentInputValidity,
  handleCommentInputError,
} from './utils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Upvote from './components/Upvote.jsx';
import { addCommentToAPI, getCommentsFromAPI } from './apis';

const MESSAGE_TIMEOUT_MS = 4000;

let previousNotificationTimeoutId = 0;
const displayNotification = (message, className) => {
  $notification.innerHTML = '';
  $notification.appendChild(D.createTextNode(message));
  $notification.classList.add(className);
  $notification.classList.remove('hidden');

  // Clear the previous timeout and set a new one so that the latest message
  // is shown for an appropriate amount of time
  clearTimeout(previousNotificationTimeoutId);
  previousNotificationTimeoutId = setTimeout(() => {
    $notification.classList.add('hidden');
    $notification.classList.remove(className);
  }, MESSAGE_TIMEOUT_MS);
};

const buildDisplayPicElement = (userName) => {
  const $element = D.createElement('div');
  $element.className = 'displayPic';
  $element.textContent = userName.charAt(0);
  $element.title = userName;
  return $element;
};

const buildDisplayPicContainer = (userName, children = []) => {
  const $element = D.createElement('div');
  $element.className = 'displayPicContainer';

  $element.appendChild(buildDisplayPicElement(userName));

  if (children.length > 0) {
    $element.appendChild(
      (function () {
        const $element = D.createElement('div');
        $element.className = 'commentChildrenIndicator';
        $element.appendChild(D.createElement('div'));
        return $element;
      })()
    );
  }

  return $element;
};

const buildCommentHeading = (userName, createdAt) => {
  const $element = D.createElement('div');
  $element.className = 'commentHeading';
  $element.innerHTML = `<span class="commentUser">${userName}</span><span>&nbsp;&#183;&nbsp;</span><span class="commentCreatedAt">${getFormattedDuration(
    new Date(createdAt).getTime()
  )}</span>`;
  return $element;
};

const buildCommentText = (commentText) => {
  const $element = D.createElement('p');
  $element.className = 'commentText';
  $element.textContent = commentText;
  return $element;
};

const buildUpvoteButton = (commentId, upvotes) => {
  const $element = D.createElement('span');
  const reactElement = ReactDOM.createRoot($element);
  reactElement.render(<Upvote commentId={commentId} upvotes={upvotes} />);
  return $element;
};

const buildReplyButton = (commentId, children) => {
  const $element = D.createElement('button');
  $element.id = `comment-${commentId}-reply`;
  $element.className = 'commentAction';
  $element.textContent = `${children.length} Reply`;
  $element.addEventListener('click', () => {
    const $commentReplyContainer =
      getCommentReplyContainerByCommentId(commentId);
    $commentReplyContainer.classList.toggle('hidden');
  });
  return $element;
};

const buildCommentReplyContainer = (commentId, userName) => {
  const $replyInput = D.createElement('input');
  $replyInput.id = `comment-${commentId}-reply-input`;
  $replyInput.classList.add('emptyOrValidInput', 'commentInput');
  $replyInput.placeholder = `Reply to ${userName}`;
  $replyInput.addEventListener('change', () =>
    handleCommentInputValidity($replyInput)
  );

  const $replySubmit = D.createElement('button');
  $replySubmit.id = `comment-${commentId}-reply-submit`;
  $replySubmit.className = 'commentSubmit';
  $replySubmit.textContent = 'Comment';
  $replySubmit.addEventListener('click', async () => {
    const $commentInput = D.querySelector(`#comment-${commentId}-reply-input`);
    const isErroneous = handleCommentInputError($commentInput);
    if (isErroneous) {
      return;
    }
    await submitCommentReply(commentId, $commentInput);
  });

  const $commentInputActionContainer = D.createElement('div');
  $commentInputActionContainer.className = 'commentInputActionContainer';
  $commentInputActionContainer.appendChild($replyInput);
  $commentInputActionContainer.appendChild($replySubmit);

  const $commentReplyInputContainer = D.createElement('div');
  $commentReplyInputContainer.id = `comment-${commentId}-reply-input-container`;
  $commentReplyInputContainer.className = 'commentInputContainer';
  $commentReplyInputContainer.appendChild(
    buildDisplayPicElement(globalState.selectedUser.userName)
  );
  $commentReplyInputContainer.appendChild($commentInputActionContainer);

  const $commentReplyContainer = D.createElement('div');
  $commentReplyContainer.id = `comment-${commentId}-reply-container`;
  $commentReplyContainer.className = 'hidden';
  $commentReplyContainer.appendChild($commentReplyInputContainer);

  return $commentReplyContainer;
};

const buildCommentDetails = (comment) => {
  const {
    commentId,
    commentText,
    userName,
    createdAt,
    upvotes,
    children = [],
    parentCommentId = null,
  } = comment;
  const $element = D.createElement('div');
  $element.className = 'commentDetails';

  $element.appendChild(buildCommentHeading(userName, createdAt));
  $element.appendChild(buildCommentText(commentText));
  $element.appendChild(buildUpvoteButton(commentId, upvotes));
  if (parentCommentId === null) {
    $element.appendChild(buildReplyButton(commentId, children));
  }
  $element.appendChild(buildCommentReplyContainer(commentId, userName));

  // Nested Comments
  if (children.length > 0) {
    $element.appendChild(
      (function () {
        const $nestedCommentList = D.createElement('div');
        children.forEach((childComment) => {
          $nestedCommentList.appendChild(buildComment(childComment));
        });
        return $nestedCommentList;
      })()
    );
  }

  return $element;
};

const buildComment = (comment) => {
  const $element = D.createElement('div');
  $element.id = `comment-${comment.commentId}`;
  $element.className = 'commentContainer';

  $element.appendChild(
    buildDisplayPicContainer(comment.userName, comment.children)
  );
  $element.appendChild(buildCommentDetails(comment));

  return $element;
};

// List User Views
const userListLoadingView = () => {
  $appInitialization.textContent = 'Initializing Impeccable Commentary...';
};
const userListSuccessView = () => {
  $appInitialization.className = 'hidden';
  $commentary.classList.remove('hidden');
};
const userListErrorView = () => {
  $appInitialization.textContent = globalState.userList.error;
};

// List Comment Views
const commentListLoadingView = () => {
  $commentLoader.textContent = 'Loading comments...';
  /*
    By not hiding the existing list, user gets the chance to view the existing comments
    instead of seeing only the loader - leads to better UX.
    // $commentList.classList.add("hidden");
    */
  $commentListError.classList.add('hidden');
  $commentLoader.classList.remove('hidden');
};
const commentListSuccessView = () => {
  const comments = globalState.commentList.data;
  $commentList.innerHTML = '';
  comments.forEach((comment) => {
    $commentList.appendChild(buildComment(comment));
  });
  $commentLoader.classList.add('hidden');
  $commentList.classList.remove('hidden');
};
const commentListErrorView = () => {
  const error = globalState.commentList.error;
  $commentListError.innerHTML = '';
  $commentListError.appendChild(D.createTextNode(error));

  $commentLoader.classList.add('hidden');
  $commentList.classList.add('hidden');
  $commentListError.classList.remove('hidden');
};

// Submit Comment Views
const commentSubmitLoadingView = () => {
  $commentSubmit.textContent = 'Submitting...';
};
const commentSubmitSuccessView = () => {
  $commentSubmit.textContent = 'Comment';
  // Consider removing this to reduce UX interactions
  displayNotification(globalState.commentSubmit.data, 'success');
};
const commentSubmitErrorView = () => {
  $commentSubmit.textContent = 'Comment';
  displayNotification(globalState.commentSubmit.error, 'error');
};

const viewBuilders = {
  userList: {
    loading: userListLoadingView,
    data: userListSuccessView,
    error: userListErrorView,
  },
  commentList: {
    loading: commentListLoadingView,
    data: commentListSuccessView,
    error: commentListErrorView,
  },
  commentSubmit: {
    loading: commentSubmitLoadingView,
    data: commentSubmitSuccessView,
    error: commentSubmitErrorView,
  },
};
const getViewBuilderByStateType = (stateType) => (action) => {
  const { type } = action;
  switch (type) {
    case ASYNC_STATES.LOADING:
      viewBuilders[stateType].loading();
      break;
    case ASYNC_STATES.DATA:
      viewBuilders[stateType].data();
      break;
    case ASYNC_STATES.ERROR:
      viewBuilders[stateType].error();
      break;
  }
};

const loadCommentList = async () => {
  const update = (action) => {
    getStateUpdaterByStateType('commentList')(action);
    getViewBuilderByStateType('commentList')(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    const result = await getCommentsFromAPI();
    update({ type: ASYNC_STATES.DATA, payload: result.comments });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};

const submitCommentReply = async (commentId, $commentInput) => {
  const $commentReplyButton = D.querySelector(
    `#comment-${commentId}-reply-submit`
  );
  $commentReplyButton.textContent = 'Submitting...';
  try {
    await addCommentToAPI({
      userId: globalState.selectedUser.userId,
      commentText: $commentInput.value.trim(),
      parentCommentId: commentId,
    });
    displayNotification('Submitted comment!', 'success');
    loadCommentList();
  } catch (error) {
    $commentReplyButton.textContent = 'Comment';
    displayNotification(error, 'error');
  }
};

export { getViewBuilderByStateType, displayNotification, loadCommentList };

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
} from './domSelectors';
import { globalState } from './states';
import { getFormattedDuration } from './utils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Upvote from './components/Upvote.jsx';

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

const buildComment = (comment) => {
  const {
    commentId,
    commentText,
    userName,
    createdAt,
    upvotes,
    children = [],
    parentCommentId = null,
  } = comment;

  const $displayPicContainer = (function () {
    const $element = D.createElement('div');
    $element.className = 'displayPicContainer';

    $element.appendChild(
      (function () {
        const $element = D.createElement('div');
        $element.className = 'displayPic';
        $element.textContent = userName.charAt(0);
        return $element;
      })()
    );

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
  })();

  const $commentDetails = (function () {
    const $element = D.createElement('div');
    $element.className = 'commentDetails';

    $element.appendChild(
      (function () {
        const $element = D.createElement('div');
        $element.className = 'commentHeading';
        $element.innerHTML = `<span class="commentUser">${userName}</span><span>&nbsp;&#183;&nbsp;</span><span class="commentCreatedAt">${getFormattedDuration(
          new Date(createdAt).getTime()
        )}</span>`;
        return $element;
      })()
    );
    $element.appendChild(
      (function () {
        const $element = D.createElement('p');
        $element.className = 'commentText';
        $element.textContent = commentText;
        return $element;
      })()
    );
    $element.appendChild(
      (function () {
        const $element = D.createElement('span');
        const reactElement = ReactDOM.createRoot($element);
        reactElement.render(<Upvote commentId={commentId} upvotes={upvotes} />);
        return $element;
      })()
    );
    if (parentCommentId === null) {
      $element.appendChild(
        (function () {
          const $element = D.createElement('button');
          $element.id = `comment-${commentId}-reply`;
          $element.className = 'commentAction';
          $element.textContent = `${children.length} Reply`; // TODO: Add handling for Reply click
          return $element;
        })()
      );
    }

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
  })();

  return (function () {
    const $element = D.createElement('div');
    $element.setAttribute('id', `comment-${commentId}`); // TODO: Use id directly
    $element.className = 'commentContainer';
    $element.appendChild($displayPicContainer);
    $element.appendChild($commentDetails);

    return $element;
  })();
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

export { getViewBuilderByStateType, displayNotification };

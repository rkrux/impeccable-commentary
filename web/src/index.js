/*
  TODOs:
    Try Again button for API failures?
*/

import { getUsersFromAPI, getCommentsFromAPI, postCommentToAPI } from './apis';
import { $commentSubmit, $commentInput, $userDisplayPic } from './domSelectors';
import { getRandomNumber } from './utils';
import {
  ASYNC_STATES,
  globalState,
  getStateUpdaterByStateType,
} from './states';
import { getViewBuilderByStateType } from './views';
import './style.css';

const DEFAULT_USER = { userId: 101, userName: 'John Doe' };
const selectNewUser = () => {
  if (globalState.userList.data !== null) {
    globalState.selectedUser =
      globalState.userList.data[
        getRandomNumber(globalState.userList.data.length - 1)
      ];
  } else {
    // Not stopping the app in case loading users fails,
    // continuing with default user instead
    globalState.selectedUser = DEFAULT_USER;
  }
  $userDisplayPic.textContent = globalState.selectedUser.userName.charAt(0);
};

// Event Handlers
const handleCommentInput = () => {
  const commentText = $commentInput.value;
  if (commentText.trim().length > 0) {
    $commentInput.className = 'emptyOrValidInput';
  }
};
const handleCommentSubmit = async () => {
  const commentText = $commentInput.value.trim(); // TODO: Santize input
  if (commentText.length === 0) {
    $commentInput.className = 'erroneousInput';
    return;
  }

  await submitComment(commentText);
  if (globalState.commentSubmit.error === null) {
    $commentInput.value = '';
    // Select a new user randomly after every successful comment submission
    // to boost interactivity.
    selectNewUser();
  }
};

// Asynchronous Flow
const loadUsers = async () => {
  const update = (action) => {
    getStateUpdaterByStateType('userList')(action);
    getViewBuilderByStateType('userList')(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    const result = await getUsersFromAPI();
    update({ type: ASYNC_STATES.DATA, payload: result.users });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
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
const submitComment = async (commentText) => {
  const update = (action) => {
    getStateUpdaterByStateType('commentSubmit')(action);
    getViewBuilderByStateType('commentSubmit')(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    await postCommentToAPI({
      userId: globalState.selectedUser.userId,
      commentText,
    });
    update({ type: ASYNC_STATES.DATA, payload: 'Submitted comment!' });
    loadCommentList();
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};

// App initialization
(async function initApp() {
  $commentInput.addEventListener('change', handleCommentInput);
  $commentSubmit.addEventListener('click', handleCommentSubmit);

  await loadUsers();
  selectNewUser();
  loadCommentList();
})();

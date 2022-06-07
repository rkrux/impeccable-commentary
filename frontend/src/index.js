// TODO: Try Again button for API failures?

import { getUsersFromAPI, addCommentToAPI } from './apis';
import { $commentSubmit, $commentInput, $userDisplayPic } from './domSelectors';
import {
  ASYNC_STATES,
  globalState,
  getStateUpdaterByStateType,
} from './states';
import { getViewBuilderByStateType, loadCommentList } from './views';
import { selectNewUser, handleCommentInputValidity } from './utils';
import './styles/style.css';

// TODO: Make this reusable with comment replies too
const handleCommentSubmit = async ($commentInput) => {
  const isErroneous = handleCommentInputError($commentInput);
  if (isErroneous) {
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
const submitComment = async (commentText) => {
  const update = (action) => {
    getStateUpdaterByStateType('commentSubmit')(action);
    getViewBuilderByStateType('commentSubmit')(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    await addCommentToAPI({
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
  await loadUsers();
  selectNewUser();
  $userDisplayPic.textContent = globalState.selectedUser.userName.charAt(0);

  $commentInput.addEventListener('change', () =>
    handleCommentInputValidity($commentInput)
  );
  $commentSubmit.addEventListener('click', () =>
    handleCommentSubmit($commentInput)
  );

  loadCommentList();
})();

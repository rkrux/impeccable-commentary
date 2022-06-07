// TODO: Try Again button for API failures?

import { getUsersFromAPI } from './apis';
import { $commentSubmit, $commentInput, $userDisplayPic } from './domSelectors';
import {
  ASYNC_STATES,
  globalState,
  getStateUpdaterByStateType,
} from './states';
import {
  getViewBuilderByStateType,
  loadCommentList,
  submitComment,
  enrichUserDisplayPic,
} from './views';
import {
  selectNewUser,
  handleCommentInputValidity,
  handleCommentInputError,
} from './utils';
import './styles/style.css';

const handleCommentSubmit = async ($commentInput) => {
  const isErroneous = handleCommentInputError($commentInput);
  if (isErroneous) {
    return;
  }
  await submitComment(null, $commentInput, $commentSubmit);
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

// App initialization
(async function initApp() {
  await loadUsers();
  selectNewUser();
  enrichUserDisplayPic($userDisplayPic, globalState.selectedUser.userName);

  $commentInput.addEventListener('change', () =>
    handleCommentInputValidity($commentInput)
  );
  $commentSubmit.addEventListener('click', () =>
    handleCommentSubmit($commentInput)
  );

  loadCommentList();
})();

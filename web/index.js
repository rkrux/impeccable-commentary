// TODOs:
// CommentUpvote each to have individual state, instead of one global state for all comment upvotes
// Try Again button for API failures?
// Remove Mock APIs
// Split script into multiple files and modules?

// Constants and Helpers
const API_TIMEOUT_MS = 2990,
  API_MAX_THRESHOLD_MS = 1000,
  MESSAGE_TIMEOUT_MS = 4000,
  ASYNC_STATES = {
    LOADING: 0,
    DATA: 1,
    ERROR: 2,
  };
let storedUsers = [
  { userId: 1, userName: "Rob Hope" },
  { userId: 2, userName: "Cameron Lawrence" },
  { userId: 3, userName: "Shawn Williams" },
  { userId: 4, userName: "Michael Adams" },
  { userId: 5, userName: "Jane Austin" },
  { userId: 6, userName: "Alicia Schumacher" },
  { userId: 7, userName: "Bridget Stacey" },
];
let storedComments = [
  {
    commentId: 2,
    userId: storedUsers[1].userId,
    userName: storedUsers[1].userName,
    createdAt: Date.now() - 1200000,
    commentText:
      "Integer eget nulla sodales, mattis ante mattis, ullamcorper velit. Praesent vitae neque tristique,\
      accumsan arcu sit amet, ullamcorper risus. Donec facilisis nulla ipsum, vitae vehicula nisi sollicitudin vitae. ",
    upvotes: 10,
  },
  {
    commentId: 1,
    userId: storedUsers[0].userId,
    userName: storedUsers[0].userName,
    createdAt: Date.now() - 14400000,
    commentText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ullamcorper turpis nisl, vitae\
      pretium quam lacinia vitae. Pellentesque posuere at tellus nec euismod.",
    upvotes: 5,
  },
];
const getRandomNumber = (maxValue) => {
  return Math.floor(Math.random() * maxValue);
};
const getUsersFromAPI = async () => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        resolve(storedUsers);
      } else {
        reject(`Unable to fetch users, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const getCommentsFromAPI = async () => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        resolve(storedComments);
      } else {
        reject(`Unable to fetch comments, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const postCommentToAPI = async (commentData) => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(API_MAX_THRESHOLD_MS);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        storedComments = [
          {
            ...commentData,
            commentId: storedComments.length + 1,
            upvotes: 0,
            createdAt: Date.now(),
          },
          ...storedComments,
        ];
        resolve("Submitted");
      } else {
        reject(`Unable to submit comment, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const upvoteCommentToAPI = async ({ commentId, userId }) => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(API_MAX_THRESHOLD_MS);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        let updatedUpvotes = 0;
        storedComments
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
const getFormattedDuration = (dateTimeInMs) => {
  const durationInSec = (Date.now() - dateTimeInMs) / 1000;
  if (durationInSec < 1) {
    return `now`;
  }
  if (durationInSec < 60) {
    return `${Math.floor(durationInSec)} secs ago`;
  }
  if (durationInSec < 3600) {
    return `${Math.floor(durationInSec / 60)} mins ago`;
  }
  if (durationInSec < 86400) {
    return `${Math.floor(durationInSec / 3600)} hrs ago`;
  }
  if (durationInSec < 604800) {
    return `${Math.floor(durationInSec / 86400)} days ago`;
  }
  if (durationInSec < 2628000) {
    return `${Math.floor(durationInSec / 604800)} weeks ago`;
  }
  if (durationInSec < 31540000) {
    return `${Math.floor(durationInSec / 2628000)} months ago`;
  }
  return `${Math.floor(durationInSec / 31540000)} years ago`;
};

// Application Data
const globalState = {
  userList: {
    loading: false,
    data: null,
    error: null,
  },
  selectedUser: null,
  commentList: {
    loading: false,
    data: null,
    error: null,
  },
  commentSubmit: {
    loading: false,
    data: null,
    error: null,
  },
};
const getStateUpdaterByStateType = (stateType) => (action) => {
  const { type, payload } = action;
  switch (type) {
    // Consider removing the Loading state, it's not used after all.
    case ASYNC_STATES.LOADING:
      globalState[stateType].loading = true;
      break;
    case ASYNC_STATES.DATA:
      globalState[stateType].data = payload;
      globalState[stateType].error = null;
      break;
    case ASYNC_STATES.ERROR:
      globalState[stateType].data = null;
      globalState[stateType].error = payload;
  }
};

// DOM Manipulation
const D = document;
const $appInitialization = D.querySelector("#appInitialization");
const $commentary = D.querySelector("#commentary");
const $userDisplayPic = D.querySelector("#displayPic");
const $commentInput = D.querySelector("#commentInput");
const $commentSubmit = D.querySelector("#commentSubmit");
const $commentList = D.querySelector("#commentList");
const $commentLoader = D.querySelector("#commentLoader");
const $commentListError = D.querySelector("#commentListError");
const $notification = D.querySelector("#notification");

const selectNewUser = () => {
  if (globalState.userList.data !== null) {
    globalState.selectedUser =
      globalState.userList.data[
        getRandomNumber(globalState.userList.data.length - 1)
      ];
  } else {
    globalState.selectedUser = { userId: 101, userName: "John Doe" }; // Default User
  }

  $userDisplayPic.textContent = globalState.selectedUser.userName.charAt(0);
};

// Event Handlers
const handleCommentInput = () => {
  const commentText = $commentInput.value;
  if (commentText.trim().length > 0) {
    $commentInput.className = "emptyOrValidInput";
  }
};
const handleCommentSubmit = async () => {
  const commentText = $commentInput.value.trim(); // TODO: Santize input
  if (commentText.length === 0) {
    $commentInput.className = "erroneousInput";
    return;
  }

  await submitComment(commentText);
  if (globalState.commentSubmit.error === null) {
    $commentInput.value = "";
    selectNewUser();
  }
};
const _displayNotification = (message, className) => {
  $notification.innerHTML = "";
  $notification.appendChild(D.createTextNode(message));
  $notification.classList.add(className);
  $notification.classList.remove("hidden");

  setTimeout(() => {
    $notification.classList.add("hidden");
    $notification.classList.remove(className);
  }, MESSAGE_TIMEOUT_MS);
};
const _buildNotification = (stateType, asyncStateType, className) => () => {
  // This function needs to be a closure since the state values need to be
  // picked up during run-time. Only state independent data is taken as input.
  _displayNotification(globalState[stateType][asyncStateType], className);
};
const _buildComment = (comment) => {
  const { commentId, commentText, userName, createdAt, upvotes } = comment;

  const $displayPicContainer = (function () {
    const $element = D.createElement("div");
    $element.className = "displayPicContainer";

    $element.appendChild(
      (function () {
        const $element = D.createElement("div");
        $element.className = "displayPic";
        $element.textContent = userName.charAt(0);
        return $element;
      })()
    );
    return $element;
  })();

  const $commentDetails = (function () {
    const $element = D.createElement("div");
    $element.className = "commentDetails";

    $element.appendChild(
      (function () {
        const $element = D.createElement("div");
        $element.className = "commentHeading";
        $element.innerHTML = `<span class="commentUser">${userName}</span><span>&nbsp;&#183;&nbsp;</span><span class="commentCreatedAt">${getFormattedDuration(
          createdAt
        )}</span>`;
        return $element;
      })()
    );
    $element.appendChild(
      (function () {
        const $element = D.createElement("p");
        $element.className = "commentText";
        $element.textContent = commentText;
        return $element;
      })()
    );
    $element.appendChild(
      (function () {
        const $element = D.createElement("button");
        $element.id = `comment-${commentId}-upvote`;
        $element.className = "commentAction";
        $element.setAttribute("upvotes", `${upvotes}`);
        $element.addEventListener("click", (event) =>
          upvoteComment(event, commentId)
        );
        $element.innerHTML = `${upvotes} &#9650; Upvote`;
        return $element;
      })()
    );
    $element.appendChild(
      (function () {
        const $element = D.createElement("button");
        $element.id = `comment-${commentId}-reply`;
        $element.className = "commentAction";
        $element.textContent = `Reply`;
        return $element;
      })()
    );
    return $element;
  })();

  return (function () {
    const $element = D.createElement("div");
    $element.setAttribute("id", `comment-${commentId}`); // TODO: Use id directly
    $element.className = "commentContainer";
    $element.appendChild($displayPicContainer);
    $element.appendChild($commentDetails);

    return $element;
  })();
};

// List User Views
const stateUserListLoadingView = () => {
  $appInitialization.textContent = "Initializing App...";
};
const stateUserListSuccessView = () => {
  $appInitialization.className = "hidden";
  $commentary.classList.remove("hidden");
};
const stateUserListErrorView = () => {
  $appInitialization.textContent = globalState.userList.error;
};

// List Comment Views
const stateCommentListLoadingView = () => {
  $commentLoader.textContent = "Loading comments...";
  /*
  By not hiding the existing list, user gets the chance to view the existing comments
  instead of seeing only the loader - leads to better UX.
  // $commentList.classList.add("hidden");
  */
  $commentListError.classList.add("hidden");
  $commentLoader.classList.remove("hidden");
};
const stateCommentListSuccessView = () => {
  const comments = globalState.commentList.data;
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(_buildComment(comment));
  });
  $commentLoader.classList.add("hidden");
  $commentList.classList.remove("hidden");
};
const stateCommentListErrorView = () => {
  const error = globalState.commentList.error;
  $commentListError.innerHTML = "";
  $commentListError.appendChild(D.createTextNode(error));

  $commentLoader.classList.add("hidden");
  $commentList.classList.add("hidden");
  $commentListError.classList.remove("hidden");
};

// Submit Comment Views
const stateCommentSubmitLoadingView = () => {
  $commentSubmit.textContent = "Submitting...";
};
const stateCommentSubmitSuccessView = () => {
  $commentSubmit.textContent = "Comment";
  loadCommentList();
  _buildNotification("commentSubmit", "data", "success")(); // Consider removing this to reduce UX interactions
};
const stateCommentSubmitErrorView = () => {
  $commentSubmit.textContent = "Comment";
  _buildNotification("commentSubmit", "error", "error")();
};

const viewBuilders = {
  userList: {
    loading: stateUserListLoadingView,
    data: stateUserListSuccessView,
    error: stateUserListErrorView,
  },
  commentList: {
    loading: stateCommentListLoadingView,
    data: stateCommentListSuccessView,
    error: stateCommentListErrorView,
  },
  commentSubmit: {
    loading: stateCommentSubmitLoadingView,
    data: stateCommentSubmitSuccessView,
    error: stateCommentSubmitErrorView,
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

// Asynchronous Flow
const loadUsers = async () => {
  const update = (action) => {
    getStateUpdaterByStateType("userList")(action);
    getViewBuilderByStateType("userList")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    const users = await getUsersFromAPI();
    update({ type: ASYNC_STATES.DATA, payload: users });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};
const loadCommentList = async () => {
  const update = (action) => {
    getStateUpdaterByStateType("commentList")(action);
    getViewBuilderByStateType("commentList")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    const comments = await getCommentsFromAPI();
    update({ type: ASYNC_STATES.DATA, payload: comments });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};
const submitComment = async (commentText) => {
  const update = (action) => {
    getStateUpdaterByStateType("commentSubmit")(action);
    getViewBuilderByStateType("commentSubmit")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    await postCommentToAPI({
      userId: globalState.selectedUser.userId,
      userName: globalState.selectedUser.userName,
      commentText,
    });
    update({ type: ASYNC_STATES.DATA, payload: "Submitted comment!" });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};
const upvoteComment = async (event, commentId) => {
  const $element = D.querySelector(`#${event.target.id}`);
  const upvotes = $element.getAttribute("upvotes");

  $element.innerHTML = `${upvotes} &#9650; Upvoting...`;
  try {
    const result = await upvoteCommentToAPI({
      commentId,
      userId: globalState.selectedUser.userId,
    });
    $element.setAttribute("upvotes", `${result.updatedUpvotes}`);
    $element.innerHTML = `${result.updatedUpvotes} &#9650; Upvote`;
  } catch (error) {
    $element.innerHTML = `${upvotes} &#9650; Upvote`;
    _displayNotification(error, "error");
  }
};

// App initialization
(async function initApp() {
  $commentInput.addEventListener("change", handleCommentInput);
  $commentSubmit.addEventListener("click", handleCommentSubmit);

  await loadUsers();
  selectNewUser();
  loadCommentList();
})();

// TODOs:
// Comment input validation along with error styling
// Input val will include data sanitization?
// Slight error handler for upvote failure or "fire and forget?"
// Handle upvoting with mock api
// Comment time formatter
// User Randomizer
// Remove Mock APIs
// Split script into multiple files and modules?
// Instead of clearing older comments while fetching again, keep them and add new ones later using Diffing.

// Constants and Helpers
const API_TIMEOUT_MS = 980,
  MESSAGE_TIMEOUT_MS = 5000,
  ASYNC_STATES = {
    LOADING: 0,
    DATA: 1,
    ERROR: 2,
  };
let storedComments = [
  {
    commentId: 1,
    userName: "Rob Hope",
    createdAt: Date.now(),
    commentText:
      "Now that's a huge release with some big community earnings back to it - it must be so\
     rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
    upvotes: 5,
  },
  {
    commentId: 2,
    userName: "Cameron Lawrence",
    createdAt: Date.now(),
    commentText:
      "Love the native memberships and the zipless themes, I was just asked by a friend about options\
        for a new site, and I think I know what I will be recommending then...",
    upvotes: 10,
  },
];
const getRandomNumber = (maxValue) => {
  return Math.floor(Math.random() * maxValue);
};
const fetchCommentsFromAPI = async () => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        resolve(storedComments);
      } else {
        reject(`Unable to fetch comments from API, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const submitCommentToAPI = async (commentData) => {
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < API_TIMEOUT_MS) {
        storedComments = [
          { ...commentData, commentId: 3, upvotes: 0 },
          ...storedComments,
        ];
        resolve("Submitted");
      } else {
        reject(`Unable to submit comment to API, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};

// Application Data
const state = {
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
    case ASYNC_STATES.LOADING:
      state[stateType].loading = true;
      break;
    case ASYNC_STATES.DATA:
      state[stateType].data = payload;
      state[stateType].error = null;
      break;
    case ASYNC_STATES.ERROR:
      state[stateType].data = null;
      state[stateType].error = payload;
  }
};

// DOM Nodes
const D = document;
const $commentInput = D.querySelector("#commentInput");
const $commentSubmit = D.querySelector("#commentSubmit");
const $commentList = D.querySelector("#commentList");
const $commentLoader = D.querySelector("#commentLoader");
const $commentListError = D.querySelector("#commentListError");
const $commentSubmitMessage = D.querySelector("#commentSubmitMessage");

// DOM Manipulation
const commentListLoadingView = () => {
  $commentLoader.textContent = "Loading comments...";
  /*
  By not hiding the exisitng list, user gets the chance to view the exisiting comments
  instead of seeing only the loader - leads to better UX.
  // $commentList.classList.add("hidden");
  */
  $commentListError.classList.add("hidden");
  $commentLoader.classList.remove("hidden");
};
const buildComment = (comment) => {
  const { commentId, commentText, userName, createdAt, upvotes } = comment;
  const $comment = D.createElement("div");
  $comment.innerHTML = `
    <div id="comment-${commentId}" class="commentContainer">
          <div class="displayPictureContainer">
            <div class="displayPicture">${userName.charAt(0) ?? ""}</div>
          </div>
          <div class="commentDetails">
            <div class="commentHeading">
              <span class="commentUser">${userName}</span>
              <span>&#183;</span>
              <span class="commentCreatedAt">${createdAt}</span>
            </div>
            <p class="commentText">${commentText}</p>
            <button class="commentAction">${upvotes} &#9650; Upvote</button>
            <button class="commentAction">Reply</button>
        </div>
    </div>
  `;

  return $comment;
};
const commentListDataView = () => {
  const comments = state.commentList.data;
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(buildComment(comment));
  });
  $commentLoader.classList.add("hidden");
  $commentList.classList.remove("hidden");
};
const commentListErrorView = () => {
  const error = state.commentList.error;
  $commentListError.appendChild(D.createTextNode(error));
  $commentLoader.classList.add("hidden");
  $commentListError.classList.remove("hidden");
};
const commentSubmitLoadingView = () => {
  $commentSubmit.textContent = "Submitting...";
};
const buildCommentSubmitMessage = (asyncStateType, className) => () => {
  const message = state.commentSubmit[asyncStateType];
  $commentSubmit.textContent = "Comment";
  $commentSubmitMessage.innerHTML = "";
  $commentSubmitMessage.classList.add(className);
  $commentSubmitMessage.appendChild(D.createTextNode(message));
  $commentSubmitMessage.classList.remove("hidden");

  setTimeout(() => {
    $commentSubmitMessage.classList.add("hidden");
  }, MESSAGE_TIMEOUT_MS);
};
const commentSubmitDataView = function () {
  buildCommentSubmitMessage("data", "success")();
  loadCommentList();
};
const commentSubmitErrorView = buildCommentSubmitMessage("error", "error");

const viewBuilders = {
  commentList: {
    loading: commentListLoadingView,
    data: commentListDataView,
    error: commentListErrorView,
  },
  commentSubmit: {
    loading: commentSubmitLoadingView,
    data: commentSubmitDataView,
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

// Dynamic Flow
const loadCommentList = async () => {
  const update = (action) => {
    getStateUpdaterByStateType("commentList")(action);
    getViewBuilderByStateType("commentList")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    const comments = await fetchCommentsFromAPI();
    update({ type: ASYNC_STATES.DATA, payload: comments });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};
const submitComment = async () => {
  const update = (action) => {
    getStateUpdaterByStateType("commentSubmit")(action);
    getViewBuilderByStateType("commentSubmit")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    await submitCommentToAPI({
      userName: "Lashawn Williams",
      createdAt: Date.now(),
      commentText: $commentInput.value,
    });
    update({ type: ASYNC_STATES.DATA, payload: "Submitted comment" });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};

// App initialization
$commentSubmit.onclick = submitComment;
loadCommentList();

// TODOs:
// Comment input validation along with error styling
// Input val will include data sanitization?
// Slight error handler for upvote failure or "fire and forget?"
// Comment time formatter
// User Randomizer
// Remove Mock APIs
// Split script into multiple files and modules?
// Instead of clearing older comments while fetching again, keep them and add new ones later using Diffing.

// Constants and Helpers
const API_TIMEOUT_MS = 980,
  API_MAX_THRESHOLD_MS = 1000,
  MESSAGE_TIMEOUT_MS = 5000,
  ASYNC_STATES = {
    LOADING: 0,
    DATA: 1,
    ERROR: 2,
  };
let storedComments = [
  {
    commentId: 2,
    userId: 2,
    userName: "Cameron Lawrence",
    createdAt: Date.now(),
    commentText:
      "Love the native memberships and the zipless themes, I was just asked by a friend about options\
        for a new site, and I think I know what I will be recommending then...",
    upvotes: 10,
  },
  {
    commentId: 1,
    userId: 1,
    userName: "Rob Hope",
    createdAt: Date.now(),
    commentText:
      "Now that's a huge release with some big community earnings back to it - it must be so\
     rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
    upvotes: 5,
  },
];
const getRandomNumber = (maxValue) => {
  return Math.floor(Math.random() * maxValue);
};
const getCommentsFromAPI = async () => {
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
        reject(`Unable to submit comment to API, time: ${randomMs}ms`);
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
const $notification = D.querySelector("#notification");

// DOM Manipulation
const upvoteHandler = async (event, commentId) => {
  try {
    const result = await upvoteCommentToAPI({
      commentId,
      userId: 12, // TODO: Randomize
    });
    const $comment = document.querySelector(`#${event.target.id}`);
    $comment.innerHTML = `${result.updatedUpvotes} &#9650; Upvote`;
  } catch (error) {
    console.log("Error in upvoting:", error);
  }
};

const _buildComment = (comment) => {
  const { commentId, commentText, userName, createdAt, upvotes } = comment;

  const $displayPictureContainer = (function () {
    const $element = D.createElement("div");
    $element.className = "displayPictureContainer";

    $element.appendChild(
      (function () {
        const $element = D.createElement("div");
        $element.className = "displayPicture";
        $element.textContent = userName.charAt(0) ?? "";
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
        $element.innerHTML = `<span class="commentUser">${userName}</span><span>&#183;</span><span class="commentCreatedAt">${createdAt}</span>`;
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
        $element.addEventListener("click", (event) => {
          upvoteHandler(event, commentId);
        });
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
    $element.setAttribute("id", `comment-${commentId}`);
    $element.className = "commentContainer";
    $element.appendChild($displayPictureContainer);
    $element.appendChild($commentDetails);

    return $element;
  })();
};
const stateCommentListLoadingView = () => {
  $commentLoader.textContent = "Loading comments...";
  /*
  By not hiding the exisitng list, user gets the chance to view the exisiting comments
  instead of seeing only the loader - leads to better UX.
  // $commentList.classList.add("hidden");
  */
  $commentListError.classList.add("hidden");
  $commentLoader.classList.remove("hidden");
};
const stateCommentListSuccessView = () => {
  const comments = state.commentList.data;
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(_buildComment(comment));
  });
  $commentLoader.classList.add("hidden");
  $commentList.classList.remove("hidden");
};
const stateCommentListErrorView = () => {
  const error = state.commentList.error;
  $commentListError.appendChild(D.createTextNode(error));
  $commentLoader.classList.add("hidden");
  $commentListError.classList.remove("hidden");
};

const _buildCommentSubmitMessage = (asyncStateType, className) => () => {
  const message = state.commentSubmit[asyncStateType];
  $commentSubmit.textContent = "Comment";
  $notification.innerHTML = "";
  $notification.classList.add(className);
  $notification.appendChild(D.createTextNode(message));
  $notification.classList.remove("hidden");

  setTimeout(() => {
    $notification.classList.add("hidden");
  }, MESSAGE_TIMEOUT_MS);
};
const stateCommentSubmitLoadingView = () => {
  $commentSubmit.textContent = "Submitting...";
};
const stateCommentSubmitSuccessView = function () {
  _buildCommentSubmitMessage("data", "success")();
  loadCommentList();
};
const stateCommentSubmitErrorView = _buildCommentSubmitMessage(
  "error",
  "error"
);

const viewBuilders = {
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

// Dynamic Flow
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
const submitComment = async () => {
  const update = (action) => {
    getStateUpdaterByStateType("commentSubmit")(action);
    getViewBuilderByStateType("commentSubmit")(action);
  };

  update({ type: ASYNC_STATES.LOADING });
  try {
    await postCommentToAPI({
      userId: 3, // TODO: Randomize
      userName: "Lashawn Williams", // TODO: Randomize
      commentText: $commentInput.value,
    });
    update({ type: ASYNC_STATES.DATA, payload: "Submitted comment!" });
  } catch (error) {
    update({ type: ASYNC_STATES.ERROR, payload: error });
  }
};

// App initialization
$commentSubmit.onclick = submitComment;
loadCommentList();

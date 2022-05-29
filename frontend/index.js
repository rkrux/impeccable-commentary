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
  MESSAGE_TIMEOUT_MS = 5000;
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
let commentListState = {
  loading: false,
  data: null,
  error: null,
};
const COMMENT_LIST_VIEW = {
  LOADING: 0,
  DATA: 1,
  ERROR: 2,
};
const updateCommentListState = (action) => {
  const { type, payload } = action;
  switch (type) {
    case COMMENT_LIST_VIEW.LOADING:
      commentListState.loading = true;
      break;
    case COMMENT_LIST_VIEW.DATA:
      commentListState.data = payload;
      commentListState.error = null;
      break;
    case COMMENT_LIST_VIEW.ERROR:
      commentListState.data = null;
      commentListState.error = payload;
  }
};
let commentSubmitState = {
  loading: false,
  data: null,
  error: null,
};
const COMMENT_SUBMIT_VIEW = {
  LOADING: 0,
  DATA: 1,
  ERROR: 2,
};
const updateCommentSubmitState = (action) => {
  const { type, payload } = action;
  switch (type) {
    case COMMENT_SUBMIT_VIEW.LOADING:
      commentSubmitState.loading = true;
      break;
    case COMMENT_SUBMIT_VIEW.DATA:
      commentSubmitState.data = "Submitted comment";
      commentSubmitState.error = null;
      break;
    case COMMENT_SUBMIT_VIEW.ERROR:
      commentSubmitState.data = null;
      commentSubmitState.error = payload;
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
const buildCommentList = (comments) => {
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(buildComment(comment));
  });
};
const buildCommentListError = () => {
  $commentListError.appendChild(D.createTextNode(commentListState.error));
};
const updateCommentListView = (action) => {
  const { type } = action;
  switch (type) {
    case COMMENT_LIST_VIEW.LOADING:
      // $commentList.classList.add("hidden");
      $commentListError.classList.add("hidden");
      $commentLoader.classList.remove("hidden");
      break;
    case COMMENT_LIST_VIEW.DATA:
      buildCommentList(commentListState.data);
      $commentLoader.classList.add("hidden");
      $commentList.classList.remove("hidden");
      break;
    case COMMENT_LIST_VIEW.ERROR:
      buildCommentListError();
      $commentLoader.classList.add("hidden");
      $commentListError.classList.remove("hidden");
  }
};
const buildCommentSubmitMessage = (message, className) => {
  $commentSubmit.textContent = "Comment";
  $commentSubmitMessage.innerHTML = "";
  $commentSubmitMessage.classList.add(className);
  $commentSubmitMessage.appendChild(D.createTextNode(message));
  $commentSubmitMessage.classList.remove("hidden");
  setTimeout(() => {
    $commentSubmitMessage.classList.add("hidden");
  }, MESSAGE_TIMEOUT_MS);
};
const updateCommentSubmitView = (action) => {
  const { type } = action;
  switch (type) {
    case COMMENT_SUBMIT_VIEW.LOADING:
      $commentSubmit.textContent = "Submitting...";
      break;
    case COMMENT_SUBMIT_VIEW.DATA:
      buildCommentSubmitMessage(commentSubmitState.data, "success");
      loadCommentList();
      break;
    case COMMENT_SUBMIT_VIEW.ERROR:
      buildCommentSubmitMessage(commentSubmitState.error, "error");
      $commentLoader.classList.add("hidden");
  }
};

// Dynamic Flow
const loadCommentList = async () => {
  const update = (action) => {
    updateCommentListState(action);
    updateCommentListView(action);
  };

  update({ type: COMMENT_LIST_VIEW.LOADING });
  try {
    const comments = await fetchCommentsFromAPI();
    update({ type: COMMENT_LIST_VIEW.DATA, payload: comments });
  } catch (error) {
    update({ type: COMMENT_LIST_VIEW.ERROR, payload: error });
  }
};
const submitComment = async () => {
  const update = (action) => {
    updateCommentSubmitState(action);
    updateCommentSubmitView(action);
  };

  update({ type: COMMENT_SUBMIT_VIEW.LOADING });
  try {
    await submitCommentToAPI({
      userName: "Lashawn Williams",
      createdAt: Date.now(),
      commentText: $commentInput.value,
    });
    update({ type: COMMENT_SUBMIT_VIEW.DATA });
  } catch (error) {
    update({ type: COMMENT_SUBMIT_VIEW.ERROR, payload: error });
  }
};

// App initialization
$commentSubmit.onclick = submitComment;
loadCommentList();

// TODOs:
// Improve commentary alignment
// Comment submit loader
// Comment input validation along with error styling
// Input val will include data sanitization?
// Build an error screen for comment submit
// Slight error handler for upvote failure or "fire and forget?"
// Handle upvoting with mock api
// Comment time formatter
// User Randomizer
// Remove Mock APIs
// Split script into multiple files and modules?
// Instead of clearing older comments while fetching again, keep them and add new ones later using Diffing.

// Constants and Helpers
const API_TIMEOUT_MS = 980;
let storedComments = [
  {
    id: 1,
    userName: "Rob Hope",
    createdAt: Date.now(),
    text: "Now that's a huge release with some big community earnings back to it - it must be so\
     rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
  },
  {
    id: 2,
    userName: "Cameron Lawrence",
    createdAt: Date.now(),
    text: "Love the native memberships and the zipless themes, I was just asked by a friend about options\
        for a new site, and I think I know what I will be recommending then...",
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
      if (randomMs < 9) {
        storedComments = [commentData, ...storedComments]; // Add comment on top
        resolve("Submitted");
      } else {
        reject(`Unable to submit comment to API, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};

// Application Data
let state = {
  loading: false,
  data: null,
  error: null,
};
const VIEW = {
  LOADING: 0,
  DATA: 1,
  ERROR: 2,
};
const updateState = (action) => {
  const { type, payload } = action;
  switch (type) {
    case VIEW.LOADING:
      state.loading = true;
      break;
    case VIEW.DATA:
      state.data = payload;
      state.error = null;
      break;
    case VIEW.ERROR:
      state.data = null;
      state.error = payload;
  }
};

// DOM Nodes
const D = document;
const $commentInput = D.querySelector("#commentInput");
const $commentSubmit = D.querySelector("#commentSubmit");
const $commentList = D.querySelector("#commentList");
const $commentLoader = D.querySelector("#commentLoader");
const $commentListError = D.querySelector("#commentListError");
const $commentSubmitError = D.querySelector("#commentSubmitError");

// DOM Manipulation
const buildComment = (comment) => {
  const { id, text, userName, createdAt } = comment;
  const $comment = D.createElement("div");
  $comment.innerHTML = `
    <div id="comment-${id}" class="commentContainer">
          <div class="displayPictureContainer">
            <div class="displayPicture">${userName.charAt(0) ?? ""}</div>
          </div>
          <div class="commentDetails">
            <div class="commentHeading">
              <span class="commentUser">${userName}</span>
              <span>&#183;</span>
              <span class="commentCreatedAt">${createdAt}</span>
            </div>
            <p class="commentText">${text}</p>
            <button class="commentAction">&#9650; Upvote</button>
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
  $commentListError.appendChild(D.createTextNode(state.error));
};
const updateView = (action) => {
  const { type } = action;
  switch (type) {
    case VIEW.LOADING:
      // $commentList.classList.add("hidden");
      $commentListError.classList.add("hidden");
      $commentLoader.classList.remove("hidden");
      break;
    case VIEW.DATA:
      buildCommentList(state.data);
      $commentLoader.classList.add("hidden");
      $commentList.classList.remove("hidden");
      break;
    case VIEW.ERROR:
      buildCommentListError();
      $commentLoader.classList.add("hidden");
      $commentListError.classList.remove("hidden");
  }
};

// Dynamic Flow
const loadComments = async () => {
  const update = (action) => {
    updateState(action);
    updateView(action);
  };

  update({ type: VIEW.LOADING });
  try {
    const comments = await fetchCommentsFromAPI();
    update({ type: VIEW.DATA, payload: comments });
  } catch (error) {
    update({ type: VIEW.ERROR, payload: error });
  }
};
const submitComment = async () => {
  try {
    await submitCommentToAPI({
      id: 3,
      userName: "Lashawn Williams",
      createdAt: Date.now(),
      text: $commentInput.value,
    });
    loadComments();
  } catch (error) {
    $commentSubmitError.classList.remove("hidden");
    $commentSubmitError.innerHTML = "";
    $commentSubmitError.appendChild(D.createTextNode(error));
    setTimeout(() => {
      $commentSubmitError.classList.add("hidden");
    }, 5000);
  }
};

// App initialization
$commentSubmit.onclick = submitComment;
loadComments();

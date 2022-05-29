// Constants and Helpers
const currentTime = Date.now();
const storedComments = [
  {
    id: 1,
    userName: "Rob Hope",
    createdAt: "45 min ago",
    text: "Now that's a huge release with some big community earnings back to it - it must be so\
     rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
  },
  {
    id: 2,
    userName: "Cameron Lawrence",
    createdAt: "3 weeks ago",
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
      if (randomMs < 970) {
        resolve(storedComments);
      } else {
        reject(`Unable to fetch comments from API, time: ${randomMs}ms`);
      }
    }, randomMs);
  });
};
const submitCommentToAPI = async (commentData) => {
  console.log("commentData: ", commentData);
  return new Promise((resolve, reject) => {
    const randomMs = getRandomNumber(1000);
    setTimeout(() => {
      if (randomMs < 970) {
        storedComments.push(commentData);
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
const $commentError = D.querySelector("#commentError");

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
const buildComments = (comments) => {
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(buildComment(comment));
  });
};
const buildError = () => {
  $commentError.appendChild(D.createTextNode(state.error));
};
const updateView = (action) => {
  const { type } = action;
  switch (type) {
    case VIEW.LOADING:
      $commentLoader.classList.remove("hidden");
      break;
    case VIEW.DATA:
      buildComments(state.data);
      $commentLoader.classList.add("hidden");
      $commentList.classList.remove("hidden");
      break;
    case VIEW.ERROR:
      buildError();
      $commentLoader.classList.add("hidden");
      $commentError.classList.remove("hidden");
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
    const result = await submitCommentToAPI({
      id: 3,
      userName: "Lashawn Williams",
      createdAt: Date.now(),
      text: $commentInput.value,
    });
    console.log(result);
    loadComments();
  } catch (e) {
    console.log(e);
  }
};

// TODO: Build an error screen

// App initialization
$commentSubmit.onclick = submitComment;
loadComments();

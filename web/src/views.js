import { ASYNC_STATES } from "./states";
import {
  D,
  $appInitialization,
  $commentary,
  $commentSubmit,
  $commentList,
  $commentLoader,
  $commentListError,
  $notification,
  getCommentUpvoteElementById,
} from "./domSelectors";
import { globalState } from "./states";
import { getFormattedDuration } from "./utils";
import { upvoteCommentToAPI } from "./apis";

const MESSAGE_TIMEOUT_MS = 4000;

const displayNotification = (message, className) => {
  $notification.innerHTML = "";
  $notification.appendChild(D.createTextNode(message));
  $notification.classList.add(className);
  $notification.classList.remove("hidden");

  setTimeout(() => {
    $notification.classList.add("hidden");
    $notification.classList.remove(className);
  }, MESSAGE_TIMEOUT_MS);
};
const buildNotification = (stateType, asyncStateType, className) => () => {
  // This function needs to be a closure since the state values need to be
  // picked up during run-time. Only state independent data is taken as input.
  displayNotification(globalState[stateType][asyncStateType], className);
};
const buildComment = (comment) => {
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
      // Migrate to React
      (function () {
        const $element = D.createElement("button");
        $element.id = `comment-${commentId}-upvote`;
        $element.className = "commentAction";
        $element.innerHTML = `${upvotes} &#9650; Upvote`;
        $element.setAttribute("upvotes", `${upvotes}`);
        $element.addEventListener("click", (event) =>
          (async function upvoteComment() {
            const $element = getCommentUpvoteElementById(event.target.id);
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
              displayNotification(error, "error");
            }
          })()
        );
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
const userListLoadingView = () => {
  $appInitialization.textContent = "Initializing App...";
};
const userListSuccessView = () => {
  $appInitialization.className = "hidden";
  $commentary.classList.remove("hidden");
};
const userListErrorView = () => {
  $appInitialization.textContent = globalState.userList.error;
};

// List Comment Views
const commentListLoadingView = () => {
  $commentLoader.textContent = "Loading comments...";
  /*
    By not hiding the existing list, user gets the chance to view the existing comments
    instead of seeing only the loader - leads to better UX.
    // $commentList.classList.add("hidden");
    */
  $commentListError.classList.add("hidden");
  $commentLoader.classList.remove("hidden");
};
const commentListSuccessView = () => {
  const comments = globalState.commentList.data;
  $commentList.innerHTML = "";
  comments.forEach((comment) => {
    $commentList.appendChild(buildComment(comment));
  });
  $commentLoader.classList.add("hidden");
  $commentList.classList.remove("hidden");
};
const commentListErrorView = () => {
  const error = globalState.commentList.error;
  $commentListError.innerHTML = "";
  $commentListError.appendChild(D.createTextNode(error));

  $commentLoader.classList.add("hidden");
  $commentList.classList.add("hidden");
  $commentListError.classList.remove("hidden");
};

// Submit Comment Views
const commentSubmitLoadingView = () => {
  $commentSubmit.textContent = "Submitting...";
};
const commentSubmitSuccessView = () => {
  $commentSubmit.textContent = "Comment";
  buildNotification("commentSubmit", "data", "success")(); // Consider removing this to reduce UX interactions
};
const commentSubmitErrorView = () => {
  $commentSubmit.textContent = "Comment";
  buildNotification("commentSubmit", "error", "error")();
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

export { getViewBuilderByStateType };

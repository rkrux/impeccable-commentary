import React, { useState } from 'react';
import { upvoteCommentToAPI } from './apis';
import { globalState } from './states';
import { displayNotification } from './views';

const Upvote = ({ commentId, upvotes: originalUpvotes }) => {
  const [upvotes, setUpvotes] = useState(originalUpvotes);
  const [loading, setLoading] = useState(false);

  const upvotesComment = async () => {
    setLoading(true);
    try {
      const result = await upvoteCommentToAPI({
        commentId,
        userId: globalState.selectedUser.userId,
      });
      setUpvotes(result.upvotes);
    } catch (error) {
      displayNotification(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id={`comment-${commentId}-upvote`}
      className="commentAction"
      onClick={upvotesComment}
      disabled={loading}
    >
      {upvotes}&#9650;{loading ? ` Upvoting...` : ` Upvote`}
    </button>
  );
};

export default Upvote;

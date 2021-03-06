import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { upvoteCommentToAPI } from '../apis';
import { globalState } from '../states';
import { displayNotification } from '../views';

const Upvote = ({ commentId, upvotes: originalUpvotes }) => {
  const [upvotes, setUpvotes] = useState(originalUpvotes);
  const [loading, setLoading] = useState(false);

  const upvoteComment = async () => {
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

  useEffect(() => {
    const socket = io(process.env.WEB_SOCKET_URL);

    socket.on('connnection', () => {
      console.log('connected to server');
    });

    socket.on('upvote-comment', ({ commentId: updatedCommentId, upvotes }) => {
      if (commentId === updatedCommentId) {
        setUpvotes(upvotes);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnecting');
    });
  }, []);

  return (
    <button
      id={`comment-${commentId}-upvote`}
      className="commentAction"
      onClick={upvoteComment}
      disabled={loading}
    >
      {upvotes}&#9650;{loading ? ` Upvoting...` : ` Upvote`}
    </button>
  );
};

export default Upvote;

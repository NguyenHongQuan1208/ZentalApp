import { useEffect, useState, useCallback } from "react";
import { ref, onValue, push, set, off } from "firebase/database";
import { database } from "../util/firebase-config"; // Đường dẫn tới file Firebase config
import { getUser } from "../util/user-info-http"; // Hàm lấy thông tin người dùng từ userId

function useRealtimeComments(postId) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lắng nghe bình luận theo thời gian thực
  useEffect(() => {
    if (!postId) return;

    const commentsRef = ref(database, `comments/${postId}`);
    setIsLoading(true);

    const unsubscribe = onValue(
      commentsRef,
      async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Chuyển đổi dữ liệu từ object sang array và thêm thông tin người dùng
          const formattedComments = await Promise.all(
            Object.keys(data).map(async (key) => {
              const comment = data[key];
              const userData = await getUser(comment.userId); // Lấy thông tin người dùng từ userId
              return {
                commentId: key,
                ...comment,
                user: userData, // Thêm thông tin người dùng
              };
            })
          );
          setComments(formattedComments);
        } else {
          setComments([]); // Không có bình luận
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching comments:", error);
        setError(error);
        setIsLoading(false);
      }
    );

    // Cleanup khi component unmount
    return () => {
      off(commentsRef);
    };
  }, [postId]);

  // Hàm thêm bình luận mới
  const addComment = useCallback(
    async (userId, content) => {
      try {
        const newCommentRef = push(ref(database, `comments/${postId}`));
        const newComment = {
          userId,
          content,
          createdAt: new Date().toISOString(),
        };
        await set(newCommentRef, newComment);
      } catch (error) {
        console.error("Error adding comment:", error);
        setError(error);
      }
    },
    [postId]
  );

  return { comments, isLoading, error, addComment };
}

export default useRealtimeComments;

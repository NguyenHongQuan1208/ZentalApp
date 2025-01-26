import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../util/firebase-config";

function useRealtimeLikes(postId, currentUserId) {
  const [isLiked, setIsLiked] = useState(false); // Trạng thái like của người dùng hiện tại
  const [likeCount, setLikeCount] = useState(0); // Tổng số like của bài viết

  useEffect(() => {
    if (!postId || !currentUserId) return;

    // Tham chiếu tới node `likes` của bài viết trong Firebase
    const likesRef = ref(database, `posts/${postId}/likes`);

    // Lắng nghe thay đổi dữ liệu thời gian thực
    const unsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();

      if (!likesData) {
        // Nếu không có like nào
        setIsLiked(false);
        setLikeCount(0);
        return;
      }

      // Chuyển đổi dữ liệu likes từ object thành mảng
      const likesArray = Object.keys(likesData);

      // Cập nhật trạng thái like của người dùng hiện tại
      setIsLiked(likesArray.includes(currentUserId));

      // Cập nhật tổng số like
      setLikeCount(likesArray.length);
    });

    // Hủy lắng nghe khi component unmount
    return () => {
      unsubscribe();
    };
  }, [postId, currentUserId]);

  return { isLiked, likeCount };
}

export default useRealtimeLikes;

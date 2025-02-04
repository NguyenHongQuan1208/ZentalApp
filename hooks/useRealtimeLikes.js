import { ref, onValue, set, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../util/firebase-config";

function useRealtimeLikes(postId, currentUserId) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedUserIds, setLikedUserIds] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  useEffect(() => {
    if (!postId || !currentUserId) return;

    const likesRef = ref(database, `likes/${postId}`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();

      if (!likesData) {
        setIsLiked(false);
        setLikeCount(0);
        setLikedUserIds([]);
      } else {
        const likesArray = Object.keys(likesData);
        setIsLiked(likesArray.includes(currentUserId));
        setLikeCount(likesArray.length);
        setLikedUserIds(likesArray);
      }
    });

    return () => unsubscribe();
  }, [postId, currentUserId]);

  const toggleLike = async () => {
    if (!postId || !currentUserId) return;

    setLoading(true); // Bắt đầu loading
    const likeRef = ref(database, `likes/${postId}/${currentUserId}`);

    try {
      if (isLiked) {
        await remove(likeRef);
      } else {
        await set(likeRef, {
          userId: currentUserId,
          postId,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
    likedUserIds,
    loading, // Trả về trạng thái loading
  };
}

export default useRealtimeLikes;

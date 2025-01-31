import { ref, onValue, set, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../util/firebase-config";

function useRealtimeLikes(postId, currentUserId) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!postId || !currentUserId) return;

    const likesRef = ref(database, `likes/${postId}`);

    const unsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();

      if (!likesData) {
        setIsLiked(false);
        setLikeCount(0);
      } else {
        const likesArray = Object.keys(likesData);
        setIsLiked(likesArray.includes(currentUserId));
        setLikeCount(likesArray.length);
      }
    });

    return () => unsubscribe();
  }, [postId, currentUserId]);

  const toggleLike = async () => {
    if (!postId || !currentUserId) return;

    const likeRef = ref(database, `likes/${postId}/${currentUserId}`);

    if (isLiked) {
      await remove(likeRef);
    } else {
      await set(likeRef, {
        userId: currentUserId,
        postId,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
  };
}

export default useRealtimeLikes;

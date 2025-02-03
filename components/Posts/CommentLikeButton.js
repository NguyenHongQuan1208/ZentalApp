import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, update, onValue, off } from "firebase/database";
import { database } from "../../util/firebase-config"; // Adjust the import path as necessary
import { GlobalColors } from "../../constants/GlobalColors";

const CommentLikeButton = ({
  postId,
  commentId,
  currentUserId,
  initialLikeCount,
  initialLikedBy,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);

  useEffect(() => {
    const commentRef = ref(database, `comments/${postId}/${commentId}`);

    const unsubscribe = onValue(commentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikeCount(data.likeCount || 0);
        setIsLiked(data.likedBy?.includes(currentUserId) || false);
      }
    });

    return () => {
      off(commentRef);
    };
  }, [commentId, currentUserId, postId]);

  const handleLikeToggle = async () => {
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const likedBy = initialLikedBy || [];
    const updatedLikedBy = isLiked
      ? likedBy.filter((id) => id !== currentUserId)
      : [...likedBy, currentUserId];

    await update(ref(database, `comments/${postId}/${commentId}`), {
      likeCount: newLikeCount,
      likedBy: updatedLikedBy,
    });
  };

  return (
    <Pressable style={styles.iconButton} onPress={handleLikeToggle}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "red" : GlobalColors.inActivetabBarColor}
      />
      <Text style={styles.iconText}>{likeCount}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.inActivetabBarColor,
  },
});

export default CommentLikeButton;

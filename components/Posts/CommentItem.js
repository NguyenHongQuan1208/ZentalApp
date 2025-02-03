import React, { memo, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import Avatar from "../Profile/Avatar";
import { ref, update } from "firebase/database";
import { database } from "../../util/firebase-config"; // Adjust the import path as necessary

const CommentItem = memo(({ comment, currentUserId, postId }) => {
  const user = comment.user;

  // State to manage whether the current user has liked the comment
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  useEffect(() => {
    // Check if the current user has liked the comment
    if (comment.likedBy && comment.likedBy.includes(currentUserId)) {
      setIsLiked(true);
    }
  }, [comment.likedBy, currentUserId]);

  const handleLikeToggle = async () => {
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const likedBy = comment.likedBy || [];

    // Update the like status
    if (isLiked) {
      // Remove currentUserId from likedBy array
      const updatedLikedBy = likedBy.filter((id) => id !== currentUserId);
      await update(ref(database, `comments/${postId}/${comment.commentId}`), {
        likeCount: newLikeCount,
        likedBy: updatedLikedBy,
      });
    } else {
      // Add currentUserId to likedBy array
      await update(ref(database, `comments/${postId}/${comment.commentId}`), {
        likeCount: newLikeCount,
        likedBy: [...likedBy, currentUserId],
      });
    }

    // Update local state
    setIsLiked((prevLiked) => !prevLiked);
    setLikeCount(newLikeCount);
  };

  return (
    <View style={styles.commentContainer}>
      {/* Avatar and User Info */}
      <View style={styles.userInfoContainer}>
        <Avatar photoUrl={user?.photoUrl} size={40} />
        <View style={styles.userTextContainer}>
          <Text style={styles.commentUser}>
            {user?.username || "Unknown User"}
          </Text>
          <Text style={styles.commentTime}>
            {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </View>
        {/* Like Button positioned to the right */}
        <Pressable style={styles.iconButton} onPress={handleLikeToggle}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : GlobalColors.inActivetabBarColor}
          />
          <Text style={styles.iconText}>{likeCount}</Text>
        </Pressable>
      </View>

      {/* Comment Content */}
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );
});

export default CommentItem;

const styles = StyleSheet.create({
  commentContainer: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: GlobalColors.pureWhite,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalColors.primaryBlack,
  },
  commentTime: {
    fontSize: 12,
    color: GlobalColors.inActivetabBarColor,
    marginTop: 2,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 22,
    color: GlobalColors.primaryBlack,
    marginTop: 4,
  },
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

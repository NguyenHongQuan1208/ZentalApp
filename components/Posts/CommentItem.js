import React, { memo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import Avatar from "../Profile/Avatar";

const CommentItem = memo(({ comment }) => {
  const user = comment.user;

  // State to manage whether the current user has liked the comment
  const [isLiked, setIsLiked] = useState(false); // Initialize to false
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const handleLikeToggle = () => {
    setIsLiked((prevLiked) => !prevLiked); // Toggle the liked state
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // Update like count
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
    justifyContent: "space-between", // Align items to space between
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

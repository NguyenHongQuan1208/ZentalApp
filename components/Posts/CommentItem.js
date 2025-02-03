import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "../Profile/Avatar";
import CommentLikeButton from "./CommentLikeButton";
import { GlobalColors } from "../../constants/GlobalColors";

const CommentItem = memo(({ comment, currentUserId, postId }) => {
  const user = comment.user;

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
        {/* Like Button */}
        <CommentLikeButton
          postId={postId}
          commentId={comment.commentId}
          currentUserId={currentUserId}
          initialLikeCount={comment.likeCount}
          initialLikedBy={comment.likedBy}
        />
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
});

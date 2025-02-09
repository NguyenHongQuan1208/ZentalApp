import React, { memo, useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "../Profile/Avatar";
import CommentLikeButton from "./CommentLikeButton";
import { GlobalColors } from "../../constants/GlobalColors";
import { useNavigation } from "@react-navigation/native";

const CommentItem = memo(({ comment, currentUserId, postId }) => {
  const user = comment.user;
  const navigation = useNavigation();

  const [isUsernamePressed, setIsUsernamePressed] = useState(false);

  const handleAvatarPress = useCallback(() => {
    if (user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
    }
  }, [navigation, user?.uid]);

  const handleUsernamePress = useCallback(() => {
    if (user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
    }
  }, [navigation, user?.uid]);

  const handleUsernamePressIn = useCallback(() => {
    setIsUsernamePressed(true);
  }, []);

  const handleUsernamePressOut = useCallback(() => {
    setIsUsernamePressed(false);
  }, []);

  return (
    <View style={styles.commentContainer}>
      {/* Avatar and User Info */}
      <View style={styles.userInfoContainer}>
        <Pressable
          onPress={handleAvatarPress}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Avatar photoUrl={user?.photoUrl} size={40} />
        </Pressable>
        <View style={styles.userTextContainer}>
          <Pressable
            onPressIn={handleUsernamePressIn}
            onPressOut={handleUsernamePressOut}
            onPress={handleUsernamePress}
          >
            <Text
              style={[
                styles.commentUser,
                {
                  textDecorationLine: isUsernamePressed ? "underline" : "none",
                },
              ]}
            >
              {user?.username || "Unknown User"}
            </Text>
          </Pressable>
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

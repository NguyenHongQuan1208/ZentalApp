import React, { memo, useCallback } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import useRealtimeLikes from "../../hooks/useRealtimeLikes";
import { ref, update } from "firebase/database";
import { database } from "../../util/firebase-config";

const LikeButton = memo(({ postId, currentUserId }) => {
  const { isLiked, likeCount } = useRealtimeLikes(postId, currentUserId);

  const handleLike = useCallback(async () => {
    const likesRef = ref(database, `posts/${postId}/likes`);

    if (isLiked) {
      await update(likesRef, { [currentUserId]: null });
    } else {
      await update(likesRef, { [currentUserId]: true });
    }
  }, [isLiked, postId, currentUserId]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconButton,
        pressed && styles.pressedButton,
      ]}
      onPress={handleLike}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={24}
        color={isLiked ? "red" : GlobalColors.inActivetabBarColor}
      />
      <Text
        style={[styles.iconText, { color: GlobalColors.inActivetabBarColor }]}
      >
        {likeCount}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  pressedButton: {
    opacity: 0.7,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.inActivetabBarColor,
  },
});

export default LikeButton;

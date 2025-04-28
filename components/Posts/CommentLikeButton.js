import React, { useEffect, useState, useCallback } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, update, onValue, off } from "firebase/database";
import { database } from "../../util/firebase-config";
import { GlobalColors } from "../../constants/GlobalColors";
import InfoModal from "./InfoModal";
import { useTranslation } from "react-i18next";

const CommentLikeButton = ({
  postId,
  commentId,
  currentUserId,
  initialLikeCount,
  initialLikedBy,
}) => {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likedBy, setLikedBy] = useState(initialLikedBy || []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  useEffect(() => {
    const commentRef = ref(database, `comments/${postId}/${commentId}`);

    const unsubscribe = onValue(commentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikeCount(data.likeCount || 0);
        setIsLiked(data.likedBy?.includes(currentUserId) || false);
        setLikedBy(data.likedBy || []);
      }
    });

    return () => {
      off(commentRef);
    };
  }, [commentId, currentUserId, postId]);

  const handleLikeToggle = useCallback(async () => {
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const updatedLikedBy = isLiked
      ? likedBy.filter((id) => id !== currentUserId)
      : [...likedBy, currentUserId];

    await update(ref(database, `comments/${postId}/${commentId}`), {
      likeCount: newLikeCount,
      likedBy: updatedLikedBy,
    });

    setLikedBy(updatedLikedBy);
  }, [isLiked, likeCount, likedBy, currentUserId, postId, commentId]);

  const handleLikeCountPress = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  return (
    <View>
      <Pressable style={styles.iconButton} onPress={handleLikeToggle}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "red" : GlobalColors.inActivetabBarColor}
        />
        <Pressable onPress={handleLikeCountPress}>
          <Text style={styles.iconText}>{likeCount}</Text>
        </Pressable>
      </Pressable>

      <InfoModal
        visible={isModalVisible}
        onClose={closeModal}
        userIds={likedBy}
        title={t("Comments Likes")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    paddingHorizontal: 3,
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.inActivetabBarColor,
  },
});

export default CommentLikeButton;

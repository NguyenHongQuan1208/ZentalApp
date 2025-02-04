import React, { memo, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import useRealtimeLikes from "../../hooks/useRealtimeLikes";
import InfoModal from "./InfoModal"; // Import the InfoModal component

const LikeButton = memo(({ postId, currentUserId }) => {
  const { isLiked, likeCount, toggleLike } = useRealtimeLikes(
    postId,
    currentUserId
  );
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.pressedButton,
        ]}
        onPress={toggleLike}
      >
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "red" : GlobalColors.inActivetabBarColor}
        />
        <Pressable onPress={openModal} style={styles.likeCountPressable}>
          <Text
            style={[
              styles.iconText,
              { color: GlobalColors.inActivetabBarColor },
            ]}
          >
            {likeCount}
          </Text>
        </Pressable>
      </Pressable>

      {/* Replace LikesModal with InfoModal */}
      <InfoModal
        visible={modalVisible}
        onClose={closeModal}
        content={`Likes: ${likeCount}`} // Pass dynamic content for the modal
      />
    </>
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
    paddingLeft: 3,
    paddingRight: 4,
    fontSize: 15,
    color: GlobalColors.inActivetabBarColor,
  },
  likeCountPressable: {
    marginLeft: 5,
  },
});

export default LikeButton;

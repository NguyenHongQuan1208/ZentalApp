import React, { useState } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import InfoModal from "./InfoModal";

const CommentButton = ({ commentCount, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressedButton,
          ]}
          onPress={onPress}
          aria-label="View comments"
          accessibilityRole="button"
        >
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={GlobalColors.inActivetabBarColor}
          />
        </Pressable>

        <Pressable
          onPress={openModal}
          style={styles.commentCountPressable}
          aria-label="View comment count"
          accessibilityRole="button"
        >
          <Text style={styles.iconText}>{commentCount}</Text>
        </Pressable>
      </View>

      <InfoModal
        visible={modalVisible}
        onClose={closeModal}
        content={`Comments: ${commentCount}`}
      />
    </>
  );
};

export default CommentButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  iconButton: {
    padding: 4,
  },
  pressedButton: {
    opacity: 0.7,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 15,
    color: GlobalColors.inActivetabBarColor,
  },
  commentCountPressable: {
    marginLeft: -6,
    padding: 4,
  },
});

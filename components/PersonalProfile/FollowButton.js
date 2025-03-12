import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";

const FollowButton = ({ isFollowing, onToggleFollow }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.followButton,
        pressed && styles.buttonPressed,
      ]}
      android_ripple={{ color: "#ccc" }}
      onPress={onToggleFollow}
    >
      <Ionicons
        name={isFollowing ? "checkmark-circle-outline" : "add"}
        size={20} // Adjusted size for consistency with FilterButton
        color={GlobalColors.pureWhite}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: GlobalColors.primaryColor,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    marginLeft: 3,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

export default FollowButton;

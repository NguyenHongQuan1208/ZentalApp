import React, { useState } from "react";
import { Pressable, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";
import ConfirmationDialog from "./ConfirmationDialog";
import { useTranslation } from "react-i18next";

const FollowButton = ({ isFollowing, onToggleFollow }) => {
  const { t } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);

  const handlePress = () => {
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    onToggleFollow();
    setDialogVisible(false);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.followButton,
          pressed && styles.buttonPressed,
          {
            backgroundColor: isFollowing
              ? GlobalColors.error500
              : GlobalColors.primaryColor,
          },
        ]}
        android_ripple={{ color: "#ccc" }}
        onPress={handlePress}
      >
        <Ionicons
          name={
            isFollowing ? "close-circle-outline" : "checkmark-circle-outline"
          }
          size={20}
          color={GlobalColors.pureWhite}
        />
      </Pressable>

      <ConfirmationDialog
        visible={dialogVisible}
        title={isFollowing ? t("Confirm Unfollow") : t("Confirm Follow")}
        message={`${t("Are you sure you want to")} ${
          isFollowing ? t("unfollow") : t("follow")
        } ${t("this user?")}`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  followButton: {
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

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Dimensions, StyleSheet, View, Alert } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import PostImage from "./PostImage";
import { Ionicons } from "@expo/vector-icons";
import OptionsModal from "../ui/OptionsModal";
import { changePublicStatus, deletePost } from "../../util/posts-data-http";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3;

function PostGridItem({ item, currentUserId, onPrivacyChange, onPostDelete }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const postId = item?.id;
  const userId = item?.uid || "";
  const imageUri = item?.imageUri || "";
  const sectionId = item?.sectionId || "";
  const sectionColor = item?.sectionColor || "";
  const publicStatus = item?.publicStatus;

  const [isSelected, setIsSelected] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const timeAgo = item?.createdAt
    ? formatDistanceToNowStrict(parseISO(item.createdAt), { addSuffix: false })
    : "Unknown time";

  function navigateHandler() {
    navigation.navigate("PostDetail", {
      postId: postId,
      userId: userId,
      imageUri: imageUri,
      sectionId: sectionId,
      sectionColor: sectionColor,
      timeAgo: timeAgo,
      currentUserId: currentUserId,
      publicStatus: publicStatus,
      shouldFocusComment: false,
    });
  }

  const handleLongPress = () => {
    setIsSelected(true);
    setShowOptionsModal(true);
  };

  const handleCloseModal = () => {
    setShowOptionsModal(false);
    setIsSelected(false);
  };

  const handleSelectOption = async (option) => {
    handleCloseModal();

    switch (option) {
      case t("Change Post to Public"):
        try {
          await changePublicStatus(postId, 1);
          item.publicStatus = 1;
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to public:", error);
        }
        break;
      case t("Change Post to Private"):
        try {
          await changePublicStatus(postId, 0);
          item.publicStatus = 0;
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to private:", error);
        }
        break;
      case t("Delete Post"):
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this post?",
          [
            {
              text: t("Cancel"),
              style: "cancel",
            },
            {
              text: t("Delete"),
              onPress: async () => {
                try {
                  await deletePost(postId);
                  if (onPostDelete) onPostDelete();
                } catch (error) {
                  console.error("Failed to delete post:", error);
                }
              },
            },
          ]
        );
        break;
      case t("Report Post"):
        navigation.navigate("Report", {
          postId: postId,
          headerTitle: "Report Post",
        });
        break;
      case t("Cancel"):
        break;
      default:
        break;
    }
  };

  // Determine options based on userId comparison
  const options =
    userId === currentUserId
      ? [
          publicStatus === 1
            ? t("Change Post to Private")
            : t("Change Post to Public"),
          t("Delete Post"),
          t("Cancel"),
        ]
      : [t("Report Post"), t("Cancel")];

  return (
    <View>
      <Pressable
        onPress={navigateHandler}
        onLongPress={handleLongPress}
        style={[styles.container, isSelected && styles.selectedContainer]}
      >
        {typeof imageUri === "string" && imageUri.trim() !== "" && (
          <View style={styles.imageContainer}>
            <PostImage imageUri={imageUri} style={styles.image} />
            {publicStatus === 0 && (
              <View style={styles.iconBackground}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={GlobalColors.pureWhite}
                />
              </View>
            )}
          </View>
        )}
      </Pressable>

      <OptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        onSelect={handleSelectOption}
        title={t("Options")}
        options={options}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    aspectRatio: 1,
  },
  selectedContainer: {
    opacity: 0.7,
    borderWidth: 6,
    borderColor: GlobalColors.primaryColor,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  iconBackground: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    padding: 5,
  },
});

export default PostGridItem;

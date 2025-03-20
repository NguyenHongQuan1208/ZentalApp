import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Dimensions, StyleSheet, View, Alert } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import PostImage from "./PostImage";
import { Ionicons } from "@expo/vector-icons";
import OptionsModal from "../ui/OptionsModal";
import { changePublicStatus, deletePost } from "../../util/posts-data-http";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3;

function PostGridItem({ item, currentUserId, onPrivacyChange, onPostDelete }) {
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
      case "Change Post to Public":
        try {
          await changePublicStatus(postId, 1);
          item.publicStatus = 1;
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to public:", error);
        }
        break;
      case "Change Post to Private":
        try {
          await changePublicStatus(postId, 0);
          item.publicStatus = 0;
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to private:", error);
        }
        break;
      case "Delete Post":
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this post?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
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
      case "Report Post":
        navigation.navigate("Report", {
          postId: postId,
          headerTitle: "Report Post",
        });
        break;
      case "Cancel":
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
            ? "Change Post to Private"
            : "Change Post to Public",
          "Delete Post",
          "Cancel",
        ]
      : ["Report Post", "Cancel"];

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
        title="Options"
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

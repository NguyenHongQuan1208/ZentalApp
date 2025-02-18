import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import OptionsModal from "../../components/ui/OptionsModal";
import { changePublicStatus, deletePost } from "../../util/posts-data-http";

function PostHeader({
  user,
  timeAgo,
  noPressEffect,
  publicStatus,
  currentUserId,
  postId,
  onPrivacyChange,
  onPostDelete,
  showOptions = true,
}) {
  const navigation = useNavigation();
  const [isUsernamePressed, setIsUsernamePressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isCurrentUser = currentUserId === user?.uid;

  const options = isCurrentUser
    ? [
        publicStatus === 1 ? "Change Post to Private" : "Change Post to Public",
        "Delete Post",
        "Cancel",
      ]
    : ["Report Post", "Cancel"];

  const handleMoreOptions = () => {
    setModalVisible(true);
  };

  const handleAvatarPress = () => {
    if (!noPressEffect && user?.uid) {
      navigation.navigate("PersonalProfile", {
        userId: user.uid,
      });
    }
  };

  const handleUsernamePress = () => {
    if (!noPressEffect && user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
    }
  };

  const handleUsernamePressIn = () => {
    if (!noPressEffect) {
      setIsUsernamePressed(true);
    }
  };

  const handleUsernamePressOut = () => {
    if (!noPressEffect) {
      setIsUsernamePressed(false);
    }
  };

  const handleOptionSelect = async (option) => {
    setModalVisible(false);

    switch (option) {
      case "Report Post":
        navigation.navigate("Report", {
          postId: postId,
          headerTitle: "Report Post",
        });
        break;
      case "Change Post to Private":
        try {
          await changePublicStatus(postId, 0);
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to private:", error);
        }
        break;
      case "Change Post to Public":
        try {
          await changePublicStatus(postId, 1);
          if (onPrivacyChange) onPrivacyChange();
        } catch (error) {
          console.error("Failed to change post to public:", error);
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
                  if (onPostDelete) onPostDelete(); // Callback to update the UI
                } catch (error) {
                  console.error("Failed to delete post:", error);
                }
              },
            },
          ]
        );
        break;
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.userContainer}>
        <Pressable
          onPress={handleAvatarPress}
          style={({ pressed }) => ({
            opacity: pressed && !noPressEffect ? 0.5 : 1,
          })}
        >
          <Avatar photoUrl={user?.photoUrl} size={40} />
        </Pressable>
        <View style={styles.userInfo}>
          <Pressable
            onPressIn={handleUsernamePressIn}
            onPressOut={handleUsernamePressOut}
            onPress={handleUsernamePress}
            style={styles.usernameContainer}
          >
            <Text
              style={[
                styles.username,
                {
                  textDecorationLine: isUsernamePressed ? "underline" : "none",
                },
              ]}
            >
              {user?.username || "Loading..."}
            </Text>
            {publicStatus === 0 && (
              <Ionicons
                name="lock-closed"
                size={14}
                color={GlobalColors.inActivetabBarColor}
                style={styles.lockIcon}
              />
            )}
          </Pressable>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {showOptions && ( // Kiểm tra prop showOptions
        <Pressable onPress={handleMoreOptions} style={styles.moreOptionsButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={GlobalColors.inActivetabBarColor}
          />
        </Pressable>
      )}

      <OptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleOptionSelect}
        title="Options"
        options={options}
      />
    </View>
  );
}

export default PostHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  lockIcon: {
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: GlobalColors.inActivetabBarColor,
    marginTop: 2,
  },
  moreOptionsButton: {
    marginTop: -16,
    padding: 8,
  },
});

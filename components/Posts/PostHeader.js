import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import OptionsModal from "../../components/ui/OptionsModal";

function PostHeader({ user, timeAgo, noPressEffect, publicStatus }) {
  const navigation = useNavigation();
  const [isUsernamePressed, setIsUsernamePressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  // Adjust options based on publicStatus
  const options = [
    "Report Post",
    publicStatus === 1 ? "Change Post to Private" : "Change Post to Public",
    "Delete Post",
  ];

  const handleMoreOptions = () => {
    setModalVisible(true); // Open the modal
  };

  const handleAvatarPress = () => {
    if (!noPressEffect && user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
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

  const handleOptionSelect = (option) => {
    console.log(`${option} selected for user: ${user?.username}`);
    setModalVisible(false); // Close modal after selection
    // Add additional handling for each option here
    switch (option) {
      case "Report Post":
        // Handle report post logic
        break;
      case "Change Post to Private":
        // Handle change privacy logic (set post to private)
        break;
      case "Change Post to Public":
        // Handle change privacy logic (set post to public)
        break;
      case "Delete Post":
        // Handle delete post logic
        break;
      default:
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
          </Pressable>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      <Pressable onPress={handleMoreOptions} style={styles.moreOptionsButton}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={GlobalColors.inActivetabBarColor}
        />
      </Pressable>

      {/* Options Modal */}
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
  username: {
    fontWeight: "bold",
    fontSize: 16,
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

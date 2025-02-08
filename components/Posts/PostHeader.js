import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

function PostHeader({ user, timeAgo }) {
  const navigation = useNavigation(); // Get the navigation object

  const handleMoreOptions = () => {
    console.log("More options clicked!");
  };

  const handleAvatarPress = () => {
    if (user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid }); // Navigate to PersonalProfile with userId
    }
  };

  const handleUsernamePress = () => {
    if (user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid }); // Navigate to PersonalProfile with userId
    }
  };

  return (
    <View style={styles.header}>
      {/* User Information Section */}
      <View style={styles.userContainer}>
        <Pressable onPress={handleAvatarPress}>
          <Avatar photoUrl={user?.photoUrl} size={40} />
        </Pressable>
        <View style={styles.userInfo}>
          <Pressable onPress={handleUsernamePress}>
            <Text style={styles.username}>
              {user?.username || "Loading..."}
            </Text>
          </Pressable>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* More Options Icon */}
      <Pressable onPress={handleMoreOptions} style={styles.moreOptionsButton}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={GlobalColors.inActivetabBarColor}
        />
      </Pressable>
    </View>
  );
}

export default PostHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align the more options icon to the right
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
    padding: 8, // Increase the pressable area for the icon
  },
});

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";

function PostHeader({ user, timeAgo }) {
  const handleMoreOptions = () => {
    console.log("More options clicked!");
  };

  return (
    <View style={styles.header}>
      {/* Phần thông tin người dùng */}
      <View style={styles.userContainer}>
        <Avatar photoUrl={user?.photoUrl} size={40} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || "Loading..."}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Icon 3 chấm ngang */}
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
    justifyContent: "space-between", // Để icon 3 chấm nằm ở góc phải
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
    padding: 8, // Tăng vùng nhấn cho icon
  },
});

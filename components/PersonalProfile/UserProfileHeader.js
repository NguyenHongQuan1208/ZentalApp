import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";

const UserProfileHeader = ({ userName, bio, photoUrl }) => {
  return (
    <View style={styles.header}>
      <View style={styles.avatarWrapper}>
        <Avatar photoUrl={photoUrl} size={60} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: GlobalColors.thirdColor,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    marginLeft: 15,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  bio: {
    marginTop: 3,
    fontSize: 14,
    color: "#666",
  },
});

export default UserProfileHeader;

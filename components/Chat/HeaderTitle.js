import React from "react";
import { Pressable, Text, StyleSheet, Image, View } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";

const HeaderTitle = ({ photoUrl, username, onPress }) => {
  return (
    <Pressable style={styles.headerContainer} onPress={onPress}>
      {photoUrl ? (
        <View style={styles.avatarWrapper}>
          <Avatar photoUrl={photoUrl} size={36} key={photoUrl} />
        </View>
      ) : (
        <Image
          source={require("../../assets/default-avatar.png")}
          style={styles.defaultImage}
        />
      )}
      <Text style={styles.headerTitle}>{username}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GlobalColors.primaryBlack,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  defaultImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
    flex: 1,
  },
});

export default HeaderTitle;

// ProfileBar.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileBar = ({ userId }) => {
  return (
    <View style={styles.listItem}>
      <Text>{userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    textAlign: "center",
  },
});

export default ProfileBar;

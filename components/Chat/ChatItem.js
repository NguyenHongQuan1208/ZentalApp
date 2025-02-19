import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ChatItem = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.chatItemContainer}>
      <View style={styles.chatItemContent}>
        <Text style={styles.userIdText}>{user.uid}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIdText: {
    fontSize: 18,
  },
});

export default ChatItem;

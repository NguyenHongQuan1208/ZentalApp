import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SingleChatScreen = ({ route }) => {
  // Destructure the parameters passed from ChatsScreen
  const { currentUserId, otherUserId, roomId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Single Chat</Text>
      <Text style={styles.info}>Current User ID: {currentUserId}</Text>
      <Text style={styles.info}>Other User ID: {otherUserId}</Text>
      <Text style={styles.info}>Room ID: {roomId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default SingleChatScreen;

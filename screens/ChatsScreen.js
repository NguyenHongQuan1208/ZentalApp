import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import ChatItem from "../components/Chat/ChatItem";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { getAllUsers } from "../util/user-info-http";
import {
  createChatList,
  checkChatExists,
  getRoomId,
} from "../util/chat-list-data.http";
import { GlobalColors } from "../constants/GlobalColors";

const ChatsScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [currentUserId, setCurrentUserId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCurrentUserData() {
      try {
        const authResponse = await getUserDataWithRetry(
          token,
          refreshToken,
          authCtx,
          refreshCtx
        );
        setCurrentUserId(authResponse.localId);
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchCurrentUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  useEffect(() => {
    if (currentUserId) {
      async function fetchUsers() {
        try {
          const users = await getAllUsers();
          const otherUsers = users.filter((user) => user.id !== currentUserId);
          setFilteredUsers(otherUsers);
        } catch (error) {
          console.error("Error fetching all users:", error);
          setError("Could not fetch users.");
        } finally {
          setLoading(false);
        }
      }
      fetchUsers();
    }
  }, [currentUserId]);

  const handleChatItemClick = async (user) => {
    try {
      const chatExists = await checkChatExists(currentUserId, user.uid);
      const reverseChatExists = await checkChatExists(user.uid, currentUserId);

      let roomId;

      if (chatExists) {
        roomId = await getRoomId(currentUserId, user.uid);
      } else if (reverseChatExists) {
        roomId = await getRoomId(user.uid, currentUserId);
      } else {
        roomId = await createChatList(currentUserId, user.uid);
      }

      // Navigate to the chat screen with the room ID
      navigation.navigate("SingleChat", {
        currentUserId,
        otherUserId: user.uid,
        roomId,
      });
    } catch (error) {
      console.error("Error handling chat item click:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            user={item}
            lastMsg={item.lastMsg || "No messages yet."} // Default message if none exists
            lastMsgTime={item.lastMsgTime || "Just now"} // Default time if none exists
            currentUserId={currentUserId}
            onPress={() => handleChatItemClick(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
});

export default ChatsScreen;

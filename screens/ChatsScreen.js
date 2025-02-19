// ChatsScreen.js
import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ChatItem from "../components/Chat/ChatItem";
import { getAllChatLists } from "../util/chat-list-data.http";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";

const ChatsScreen = () => {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;
  const [userId, setUserId] = useState("");

  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const authResponse = await getUserDataWithRetry(
          token,
          refreshToken,
          authCtx,
          refreshCtx
        );
        setUserId(authResponse.localId);
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  useEffect(() => {
    const fetchChatLists = async () => {
      if (!userId) return;
      try {
        const data = await getAllChatLists(userId);
        setChatData(data);
      } catch (err) {
        console.error("Error fetching chat lists:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatLists();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        data={chatData}
        keyExtractor={(item) => item.otherUserId}
        renderItem={({ item }) => (
          <ChatItem
            userId={item.otherUserId}
            lastMessage={item.lastMessage}
            lastMessageTime={item.lastMessageTime}
            unreadCount={item.unreadCount}
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

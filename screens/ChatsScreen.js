import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatItem from "../components/Chat/ChatItem";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { getAllUsers } from "../util/user-info-http";
import {
  createChatList,
  checkChatExists,
  getRoomId,
} from "../util/chat-list-data-http";
import { GlobalColors } from "../constants/GlobalColors";
import { debounce } from "lodash";

const { width } = Dimensions.get("window"); // Get window width

const ChatsScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [currentUserId, setCurrentUserId] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          setAllUsers(otherUsers);
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

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        const filtered = allUsers.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(allUsers);
      }
    }, 300),
    [allUsers]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={GlobalColors.primaryColor}
            style={styles.icon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      ),
      contentStyle: {
        backgroundColor: GlobalColors.primaryWhite,
      },
    });
  }, [navigation, searchQuery]);

  const handleChatItemClick = useCallback(
    async (user) => {
      try {
        const chatExists = await checkChatExists(currentUserId, user.uid);
        const reverseChatExists = await checkChatExists(
          user.uid,
          currentUserId
        );

        let roomId;

        if (chatExists) {
          roomId = await getRoomId(currentUserId, user.uid);
        } else if (reverseChatExists) {
          roomId = await getRoomId(user.uid, currentUserId);
        } else {
          roomId = await createChatList(currentUserId, user.uid);
        }

        navigation.navigate("SingleChat", {
          currentUserId,
          otherUserId: user.uid,
          roomId,
        });
      } catch (error) {
        console.error("Error handling chat item click:", error);
      }
    },
    [currentUserId, navigation]
  );

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
        renderItem={({ item, index }) => (
          <ChatItem
            user={item}
            currentUserId={currentUserId}
            onPress={() => handleChatItemClick(item)}
            style={index === 0 ? { marginTop: 6 } : {}}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 320, // Set width to match SearchScreen
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: GlobalColors.pureWhite,
    marginBottom: 3,
  },
  icon: {
    padding: 10,
    backgroundColor: GlobalColors.pureWhite,
  },
  searchInput: {
    height: 40,
    width: "90%",
    flexGrow: 1,
    borderColor: "transparent",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
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

export default React.memo(ChatsScreen);

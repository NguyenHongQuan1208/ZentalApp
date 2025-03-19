import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  Dimensions,
  RefreshControl,
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
  getChatList,
} from "../util/chat-list-data-http";
import { GlobalColors } from "../constants/GlobalColors";
import { debounce } from "lodash";
import ToggleButtons from "../components/Chat/ToggleButtons";
import { getFollowing } from "../util/follow-http";

const { width } = Dimensions.get("window");

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
  const [activeTab, setActiveTab] = useState("Recent");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [chatList, setChatList] = useState([]);

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

        const following = await getFollowing(authResponse.localId);
        setFollowingUsers(following.map((user) => user.id));
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchCurrentUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  const fetchUsers = async () => {
    if (!currentUserId) return;
    setRefreshing(true);
    try {
      const users = await getAllUsers();
      const otherUsers = users.filter((user) => user.id !== currentUserId);
      setAllUsers(otherUsers);

      // Fetch following users
      const following = await getFollowing(currentUserId);
      setFollowingUsers(following.map((user) => user.id));

      // Filter users based on the active tab
      if (activeTab === "Following") {
        const filteredFollowing = otherUsers.filter((user) =>
          followingUsers.includes(user.id)
        );
        setFilteredUsers(filteredFollowing);
      } else {
        setFilteredUsers(getRecentUsers());
      }

      // Fetch chat data
      getChatList(currentUserId, (chats) => {
        setChatList(chats);
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      setError("Could not fetch users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        const filtered = allUsers.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(
          activeTab === "Following"
            ? allUsers.filter((user) => followingUsers.includes(user.id))
            : getRecentUsers()
        );
      }
    }, 300),
    [allUsers, activeTab, followingUsers, chatList]
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

  const getRecentUsers = () => {
    const lastMessageTimes = {};
    chatList.forEach((chat) => {
      const otherUserId =
        chat.userId === currentUserId ? chat.otherUserId : chat.userId;
      lastMessageTimes[otherUserId] = chat.lastMsgTime;
    });

    const recentUsers = allUsers
      .filter((user) => lastMessageTimes[user.id])
      .sort(
        (a, b) =>
          new Date(lastMessageTimes[b.id]) - new Date(lastMessageTimes[a.id])
      );

    return recentUsers;
  };

  const handleToggleUsers = (tab) => {
    setActiveTab(tab);
    if (tab === "Following") {
      const filteredFollowing = allUsers.filter((user) =>
        followingUsers.includes(user.id)
      );
      setFilteredUsers(filteredFollowing);
    } else if (tab === "Recent") {
      const recentUsers = getRecentUsers();
      setFilteredUsers(recentUsers);
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
        ListHeaderComponent={
          !searchQuery ? (
            <ToggleButtons activeTab={activeTab} onToggle={handleToggleUsers} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found.</Text>
        }
        refreshing={refreshing}
        onRefresh={fetchUsers}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUsers}
            colors={[GlobalColors.primaryColor]}
            tintColor={GlobalColors.primaryColor} // Change the tint color here
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: GlobalColors.pureWhite,
    marginBottom: 3,
    paddingHorizontal: 10,
  },
  icon: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    width: "100%",
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
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    marginTop: 20,
  },
});

export default React.memo(ChatsScreen);

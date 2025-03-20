import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getAllPosts } from "../util/posts-data-http";
import { getFollowing } from "../util/follow-http";
import { GlobalColors } from "../constants/GlobalColors";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import Post from "../components/Posts/Post";
import { Ionicons } from "@expo/vector-icons";
import ToggleButtons from "../components/Chat/ToggleButtons";

function NewPosts({ navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const { token } = authCtx;
  const { refreshToken } = refreshCtx;

  const [currentUserId, setCurrentUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
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
    };
    fetchUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  // Fetch following users
  const fetchFollowingUsers = useCallback(async () => {
    if (currentUserId) {
      try {
        const following = await getFollowing(currentUserId);
        setFollowingUsers(following.map((user) => user.id));
      } catch (error) {
        console.error("Error fetching following users: ", error);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchFollowingUsers();
  }, [currentUserId]);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const allPosts = await getAllPosts();

      const filteredPosts = allPosts.filter(
        (post) => post.status === 1 && post.publicStatus === 1
      );

      // Filter posts based on active tab
      const sortedPosts = filteredPosts
        .filter((post) => {
          if (activeTab === "following") {
            return followingUsers.includes(post.uid); // Only include posts from followed users
          }
          return true; // For "all" tab, include all posts
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Unable to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, followingUsers]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowingUsers(); // Refresh the following users
    await fetchPosts(); // Then fetch the posts
  };

  const onPrivacyChange = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onPostDelete = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="search"
          size={22}
          color={GlobalColors.pureWhite}
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate("Search", { showInput: true })}
        />
      ),
    });
  }, [navigation]);

  const renderPost = useCallback(
    ({ item, index }) => (
      <Post
        item={item}
        currentUserId={currentUserId}
        onPrivacyChange={onPrivacyChange}
        onPostDelete={onPostDelete}
        style={index === 0 ? { marginTop: 14 } : {}}
      />
    ),
    [currentUserId, onPrivacyChange, onPostDelete]
  );

  // Define toggle options
  const toggleOptions = [
    { value: "all", label: "For You" },
    { value: "following", label: "Following" },
  ];

  // Handle toggle button press
  const handleToggle = (value) => {
    setActiveTab(value); // Set the active tab
    fetchPosts(); // Fetch posts based on the new active tab
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
        <Text style={styles.loadingText}>Loading...</Text>
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

  if (posts.length === 0) {
    return (
      <View style={styles.noPostsContainer}>
        <Text>No posts available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderPost}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[GlobalColors.primaryColor]}
            tintColor={GlobalColors.primaryColor}
          />
        }
        ListHeaderComponent={
          <ToggleButtons
            activeTab={activeTab}
            onToggle={handleToggle}
            options={toggleOptions}
          />
        }
      />
    </View>
  );
}

export default NewPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  loadingText: {
    color: GlobalColors.primaryColor,
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
});

import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllPosts } from "../util/posts-data-http";
import { getFollowing } from "../util/follow-http";
import { GlobalColors } from "../constants/GlobalColors";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import Post from "../components/Posts/Post";
import ToggleButtons from "../components/Chat/ToggleButtons";

function NewPosts({ navigation }) {
  // Contexts
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const { token } = authCtx;
  const { refreshToken } = refreshCtx;

  // State
  const [currentUserId, setCurrentUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [followingUsers, setFollowingUsers] = useState([]);

  // Constants
  const toggleOptions = [
    { value: "all", label: "For You" },
    { value: "following", label: "Following" },
  ];

  // Navigation setup
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

  // Data fetching
  const fetchUserData = useCallback(async () => {
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
  }, [token, refreshToken, authCtx, refreshCtx]);

  const fetchFollowingUsers = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const following = await getFollowing(currentUserId);
      setFollowingUsers(following.map((user) => user.id));
    } catch (error) {
      console.error("Error fetching following users: ", error);
    }
  }, [currentUserId]);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const allPosts = await getAllPosts();

      const filteredPosts = allPosts.filter(
        (post) => post.status === 1 && post.publicStatus === 1
      );

      const sortedPosts = filteredPosts
        .filter((post) =>
          activeTab === "following"
            ? followingUsers.includes(post.uid)
            : true
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Unable to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, followingUsers]);

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (currentUserId) {
      fetchFollowingUsers();
    }
  }, [currentUserId, fetchFollowingUsers]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchFollowingUsers(), fetchPosts()]);
  };

  const onPrivacyChange = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onPostDelete = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleToggle = (value) => {
    setActiveTab(value);
  };

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

  // Render states
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

  return (
    <ImageBackground
      source={require("../assets/Background.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.innerContainer}>
          <ToggleButtons
            activeTab={activeTab}
            onToggle={handleToggle}
            options={toggleOptions}
          />

          {posts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Text>No posts available.</Text>
            </View>
          ) : (
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
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  innerContainer: {
    flex: 1,
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
    backgroundColor: "transparent",
    marginTop: 20,
  },
});

export default NewPosts;
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
import { GlobalColors } from "../constants/GlobalColors";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import Post from "../components/Posts/Post";
import { Ionicons } from "@expo/vector-icons";

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

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const allPosts = await getAllPosts();

      const filteredPosts = allPosts.filter(
        (post) => post.status === 1 && post.publicStatus === 1
      );

      const sortedPosts = filteredPosts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // Mới nhất lên đầu
      });

      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Unable to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
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
        />
      ),
    });
  }, [navigation]);

  const renderPost = useCallback(
    ({ item }) => (
      <Post
        item={item}
        currentUserId={currentUserId}
        onPrivacyChange={onPrivacyChange}
        onPostDelete={onPostDelete}
      />
    ),
    [currentUserId, onPrivacyChange, onPostDelete]
  );

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
      <Text style={styles.title}>New Posts</Text>
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
    </View>
  );
}

export default NewPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.primaryColor,
    marginBottom: 10,
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

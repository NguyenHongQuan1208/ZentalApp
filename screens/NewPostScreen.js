import { useState, useEffect } from "react";
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
import Post from "../components/Posts/Post";

function NewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // Thêm trạng thái "refreshing"

  const fetchPosts = async () => {
    try {
      setError(null); // Reset error state before fetching
      // Lấy tất cả bài đăng
      const allPosts = await getAllPosts();

      // Lọc các bài đăng có status = 1 và publicStatus = 1
      const filteredPosts = allPosts.filter(
        (post) => post.status === 1 && post.publicStatus === 1
      );

      // Cập nhật state với bài đăng đã lọc
      setPosts(filteredPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Unable to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false); // Đảm bảo tắt trạng thái tải lại
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); // Bật trạng thái tải lại
    await fetchPosts(); // Lấy lại bài đăng
  };

  function renderPost({ item }) {
    return <Post item={item} />;
  }

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
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[GlobalColors.primaryColor]} // Màu của spinner
            tintColor={GlobalColors.primaryColor} // Màu của spinner (iOS)
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

import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { getAllPosts } from "../util/posts-data-http";
import { GlobalColors } from "../constants/GlobalColors";
import Post from "../components/Posts/Post";

function NewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Lấy tất cả bài đăng
        const allPosts = await getAllPosts();

        // Lọc các bài đăng có status = 1 và publicStatus = 1
        const filteredPosts = allPosts.filter(
          (post) => post.status === 1 && post.publicStatus === 1
        );

        // Cập nhật state với bài đăng đã lọc
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  function renderPost({ item }) {
    return <Post item={item} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
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
    <View>
      <Text>New Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
    </View>
  );
}

export default NewPosts;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  loadingText: {
    color: GlobalColors.primaryColor,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
});

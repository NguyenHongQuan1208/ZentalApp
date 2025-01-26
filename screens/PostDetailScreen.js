import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import PostHeader from "../components/Posts/PostHeader"; // Import PostHeader
import { GlobalColors } from "../constants/GlobalColors";
import useUser from "../hooks/useUser"; // Import hook useUser
import { getPostById } from "../util/posts-data-http"; // Hàm fetch bài viết theo ID

function PostDetailScreen({ route }) {
  // Lấy các tham số từ route.params
  const { postId, userId, imageUri, sectionId, sectionColor, timeAgo } =
    route.params;

  // State để lưu thông tin bài viết
  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);

  // Sử dụng hook useUser để fetch thông tin người dùng
  const { user, isLoadingUser, userError } = useUser(userId);

  // Fetch thông tin bài viết dựa trên postId
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoadingPost(true);
        const postData = await getPostById(postId); // Hàm fetch bài viết theo ID
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setPostError(error);
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Hiển thị loading nếu đang fetch dữ liệu
  if (isLoadingPost || isLoadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (postError || userError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {postError
            ? "Error fetching post data."
            : "Error fetching user data."}
        </Text>
      </View>
    );
  }

  // Hiển thị nội dung bài viết
  return (
    <View style={styles.container}>
      {/* Phần PostHeader */}
      <PostHeader user={user} timeAgo={timeAgo} />

      {/* Tiêu đề bài viết */}
      <Text style={[styles.title, { color: sectionColor }]}>
        {post?.title || "No title"}
      </Text>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{post?.content || "No content"}</Text>

      {/* Hình ảnh bài viết (nếu có) */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.postImage} />
      )}
    </View>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: GlobalColors.pureWhite,
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
    color: GlobalColors.error,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: GlobalColors.primaryBlack,
    marginTop: 10,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 10,
  },
});

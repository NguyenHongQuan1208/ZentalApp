import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import PostHeader from "../components/Posts/PostHeader";
import { GlobalColors } from "../constants/GlobalColors";
import useUser from "../hooks/useUser";
import { getPostById } from "../util/posts-data-http";
import PostImage from "../components/Posts/PostImage";
import LikeButton from "../components/Posts/LikeButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommentItem from "../components/Posts/CommentItem";
import CommentInput from "../components/Posts/CommentInput";
import useRealtimeComments from "../hooks/useRealtimeComments";

function PostDetailScreen({ route, navigation }) {
  const {
    postId,
    userId,
    imageUri,
    sectionColor,
    timeAgo,
    currentUserId,
    shouldFocusComment,
  } = route.params;

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, isLoadingUser, userError } = useUser(userId); // Lấy thông tin người đăng bài
  const {
    comments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
  } = useRealtimeComments(postId); // Sử dụng custom hook để quản lý bình luận
  const flatListRef = useRef(null);

  // Fetch post data
  const fetchPost = useCallback(async () => {
    try {
      setIsLoadingPost(true);
      const postData = await getPostById(postId);
      setPost(postData);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setPostError(error);
    } finally {
      setIsLoadingPost(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId, fetchPost]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPost(); // Tải lại bài viết
    setIsRefreshing(false);
  }, [fetchPost]);

  // Handle adding a new comment
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(currentUserId, newComment); // Gọi hàm addComment từ hook
      setNewComment(""); // Reset input sau khi thêm bình luận
      flatListRef.current?.scrollToEnd({ animated: true }); // Cuộn xuống cuối danh sách bình luận
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [newComment, addComment, currentUserId]);

  // Loading and error handling
  if (isLoadingPost || isLoadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
        <Text>Loading...</Text>
      </View>
    );
  }

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.rootContainer}>
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={({ item }) => <CommentItem comment={item} />}
          ListHeaderComponent={
            <>
              <PostHeader user={user} timeAgo={timeAgo} />
              <Text style={[styles.title, { color: sectionColor }]}>
                {post?.title || "No title"}
              </Text>
              <Text style={styles.content}>
                {post?.content || "No content"}
              </Text>
              {imageUri && <PostImage imageUri={imageUri} />}
              <View style={styles.actionRow}>
                <LikeButton postId={postId} currentUserId={currentUserId} />
                <Pressable
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressedButton,
                  ]}
                  onPress={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color={GlobalColors.inActivetabBarColor}
                  />
                  <Text style={styles.iconText}>{comments.length}</Text>
                </Pressable>
              </View>
            </>
          }
          ListEmptyComponent={
            isLoadingComments ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={GlobalColors.primaryColor}
                />
                <Text>Loading comments...</Text>
              </View>
            ) : commentError ? (
              <Text style={styles.errorText}>
                Error loading comments: {commentError.message}
              </Text>
            ) : (
              <Text style={styles.emptyText}>No comments yet.</Text>
            )
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[GlobalColors.primaryColor]}
              tintColor={GlobalColors.primaryColor}
            />
          }
        />

        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          autoFocus={shouldFocusComment}
          onBlur={() => navigation.setParams({ shouldFocusComment: false })}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: GlobalColors.pureWhite,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: GlobalColors.error,
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: GlobalColors.primaryBlack,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.lightGray,
    marginBottom: 6,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    padding: 4,
  },
  pressedButton: {
    opacity: 0.7,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 15,
    color: GlobalColors.inActivetabBarColor,
  },
  emptyText: {
    textAlign: "center",
    color: GlobalColors.inActivetabBarColor,
    marginTop: 20,
    fontSize: 15,
    paddingBottom: 20,
  },
});

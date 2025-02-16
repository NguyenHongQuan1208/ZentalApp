import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
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
import CommentButton from "../components/Posts/CommentButton";
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
    publicStatus,
    shouldFocusComment,
  } = route.params;

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(shouldFocusComment);

  const { user, isLoadingUser, userError } = useUser(userId);
  const {
    comments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
  } = useRealtimeComments(postId);
  const flatListRef = useRef(null);

  const ITEM_HEIGHT = 80;

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPost();
    setIsRefreshing(false);
  }, [fetchPost]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(currentUserId, newComment);
      setNewComment("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [newComment, addComment, currentUserId]);

  const sortedComments = useMemo(() => {
    return comments.slice().sort((a, b) => a.timestamp - b.timestamp);
  }, [comments]);

  const renderCommentItem = useCallback(
    ({ item }) => {
      return (
        <CommentItem
          comment={item}
          currentUserId={currentUserId}
          postId={postId} // Pass postId here
        />
      );
    },
    [currentUserId, postId] // Include postId in dependencies
  );

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
          data={sortedComments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={renderCommentItem}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={3}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          removeClippedSubviews={true}
          ListHeaderComponent={
            <>
              <PostHeader
                user={user}
                timeAgo={timeAgo}
                publicStatus={publicStatus}
                currentUserId={currentUserId}
              />
              <Text style={[styles.title, { color: sectionColor }]}>
                {post?.title || "No title"}
              </Text>
              <Text style={styles.content}>
                {post?.content || "No content"}
              </Text>
              {imageUri && <PostImage imageUri={imageUri} />}
              <View style={styles.actionRow}>
                <LikeButton postId={postId} currentUserId={currentUserId} />
                <CommentButton
                  commentCount={comments.length}
                  onPress={() => {
                    setShouldFocusInput(true);
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }}
                />
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
          autoFocus={shouldFocusInput}
          onBlur={() => {
            setShouldFocusInput(false);
            navigation.setParams({ shouldFocusComment: false });
          }}
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
  emptyText: {
    textAlign: "center",
    color: GlobalColors.inActivetabBarColor,
    marginTop: 20,
    fontSize: 15,
    paddingBottom: 20,
  },
});

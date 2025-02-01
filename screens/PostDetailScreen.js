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
} from "react-native";
import PostHeader from "../components/Posts/PostHeader";
import { GlobalColors } from "../constants/GlobalColors";
import useUser from "../hooks/useUser";
import { getPostById } from "../util/posts-data-http";
import PostImage from "../components/Posts/PostImage";
import LikeButton from "../components/Posts/LikeButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommentItem from "../components/Posts/CommentItem";
import { getCommentsByPostId, addComment } from "../util/comment-data-http";
import { getUser } from "../util/user-info-http";
import CommentInput from "../components/Posts/CommentInput";

function PostDetailScreen({ route, navigation }) {
  const {
    postId,
    userId,
    imageUri,
    sectionId,
    sectionColor,
    timeAgo,
    currentUserId,
    shouldFocusComment,
  } = route.params;

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const { user, isLoadingUser, userError } = useUser(userId);
  const [shouldFocus, setShouldFocus] = useState(shouldFocusComment);
  const flatListRef = useRef(null);

  // Update focus state when route params change
  useEffect(() => {
    setShouldFocus(route.params.shouldFocusComment);
  }, [route.params.shouldFocusComment]);

  // Fetch post and comments data
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setIsLoadingPost(true);
        setIsLoadingComments(true);

        const [postData, commentsData] = await Promise.all([
          getPostById(postId),
          getCommentsByPostId(postId),
        ]);

        // Add user info to comments
        const commentsWithUser = await Promise.all(
          commentsData.map(async (comment) => {
            const userData = await getUser(comment.userId);
            return { ...comment, user: userData };
          })
        );

        setPost(postData);
        setComments(commentsWithUser);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPostError(error);
        setCommentError(error);
      } finally {
        setIsLoadingPost(false);
        setIsLoadingComments(false);
      }
    };

    if (postId) fetchPostAndComments();
  }, [postId]);

  // Handle adding a new comment
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      const commentId = await addComment(postId, currentUserId, newComment);
      const userData = await getUser(currentUserId);

      const newCommentData = {
        commentId,
        postId,
        userId: currentUserId,
        user: userData,
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment("");

      // Scroll to the last comment
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [newComment, postId, currentUserId]);

  // Handle comment button press
  const handleCommentButtonPress = useCallback(() => {
    setShouldFocus(true);
  }, []);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    setShouldFocus(false);
    navigation.setParams({ shouldFocusComment: false });
  }, [navigation]);

  // Render a single comment item
  const renderCommentItem = useCallback(
    ({ item }) => <CommentItem comment={item} />,
    []
  );

  // Render the header component for the FlatList
  const renderListHeader = useCallback(
    () => (
      <>
        <PostHeader user={user} timeAgo={timeAgo} />
        <Text style={[styles.title, { color: sectionColor }]}>
          {post?.title || "No title"}
        </Text>
        <Text style={styles.content}>{post?.content || "No content"}</Text>
        {imageUri && <PostImage imageUri={imageUri} />}

        <View style={styles.actionRow}>
          <LikeButton postId={postId} currentUserId={currentUserId} />
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressedButton,
            ]}
            onPress={handleCommentButtonPress}
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
    ),
    [
      user,
      timeAgo,
      sectionColor,
      post,
      imageUri,
      comments.length,
      handleCommentButtonPress,
    ]
  );

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
          renderItem={renderCommentItem}
          ListHeaderComponent={renderListHeader}
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
        />

        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          autoFocus={shouldFocus}
          onBlur={handleInputBlur}
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

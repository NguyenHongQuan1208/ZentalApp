import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
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

function PostDetailScreen({ route, navigation }) {
  const {
    postId,
    userId,
    imageUri,
    sectionId,
    sectionColor,
    timeAgo,
    currentUserId,
  } = route.params;

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState(null);

  const [newComment, setNewComment] = useState("");

  const { user, isLoadingUser, userError } = useUser(userId);

  useEffect(() => {
    const fetchPost = async () => {
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
    };

    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const commentsData = await getCommentsByPostId(postId);

        // Fetch user info for each comment
        const commentsWithUser = await Promise.all(
          commentsData.map(async (comment) => {
            const userData = await getUser(comment.userId);
            return { ...comment, user: userData };
          })
        );

        setComments(commentsWithUser);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setCommentError(error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const commentId = await addComment(postId, currentUserId, newComment);
      const userData = await getUser(currentUserId); // Fetch current user's info
      const newCommentData = {
        commentId,
        postId,
        userId: currentUserId,
        user: userData, // Add user info
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment(""); // Reset input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.commentId.toString()}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={
          <>
            {/* Post Header and Content */}
            <PostHeader user={user} timeAgo={timeAgo} />
            <Text style={[styles.title, { color: sectionColor }]}>
              {post?.title || "No title"}
            </Text>
            <Text style={styles.content}>{post?.content || "No content"}</Text>
            {imageUri && <PostImage imageUri={imageUri} />}

            {/* Like & Comment Buttons */}
            <View style={styles.actionRow}>
              <LikeButton postId={postId} currentUserId={currentUserId} />
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressedButton,
                ]}
                onPress={() => {}}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={GlobalColors.inActivetabBarColor}
                />
                <Text style={styles.iconText}>{comments.length}</Text>
              </Pressable>
            </View>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              {/* Đường kẻ ngăn cách */}
              <View style={styles.separator} />

              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={handleAddComment}
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
        contentContainerStyle={styles.container}
      />
    </KeyboardAvoidingView>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16, // Padding cho toàn bộ màn hình
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
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: GlobalColors.primaryBlack,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  pressedButton: {
    opacity: 0.7,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.inActivetabBarColor,
  },
  commentInputContainer: {
    paddingTop: 16,
  },
  separator: {
    height: 1, // Độ dày của đường kẻ
    backgroundColor: GlobalColors.lightGray, // Màu của đường kẻ
    marginHorizontal: -16, // Kéo dài đường kẻ ra ngoài padding
  },
  commentInput: {
    borderWidth: 1,
    borderColor: GlobalColors.lightGray,
    borderRadius: 8,
    padding: 8,
    marginTop: 12, // Khoảng cách giữa đường kẻ và ô nhập
  },
  emptyText: {
    textAlign: "center",
    color: GlobalColors.inActivetabBarColor,
    marginTop: 16,
  },
});

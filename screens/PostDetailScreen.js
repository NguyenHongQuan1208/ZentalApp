import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import PostHeader from "../components/Posts/PostHeader";
import { GlobalColors } from "../constants/GlobalColors";
import useUser from "../hooks/useUser";
import { getPostById } from "../util/posts-data-http";
import PostImage from "../components/Posts/PostImage";
import LikeButton from "../components/Posts/LikeButton"; // Import LikeButton
import Ionicons from "@expo/vector-icons/Ionicons"; // Import icon

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

    if (postId) {
      fetchPost();
    }
  }, [postId]);

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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <PostHeader user={user} timeAgo={timeAgo} />
        <Text style={[styles.title, { color: sectionColor }]}>
          {post?.title || "No title"}
        </Text>
        <Text style={styles.content}>{post?.content || "No content"}</Text>
        {imageUri && <PostImage imageUri={imageUri} />}

        {/* Like & Comment Buttons */}
        <View style={styles.actionRow}>
          {/* Like Button */}
          <LikeButton postId={postId} currentUserId={currentUserId} />

          {/* Comment Button */}
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
            <Text style={styles.iconText}>0</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
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
});

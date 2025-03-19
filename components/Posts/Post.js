import React, { memo, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import PostHeader from "../../components/Posts/PostHeader";
import PostContent from "../../components/Posts/PostContent";
import PostImage from "../../components/Posts/PostImage";
import LikeButton from "../../components/Posts/LikeButton";
import CommentButton from "../../components/Posts/CommentButton";
import useUser from "../../hooks/useUser";
import useRealtimeComments from "../../hooks/useRealtimeComments";
import getAllTaskSections from "../../util/task-section-http";
import LoadingPlaceholder from "./LoadingPlaceholder";

const Post = memo(
  ({ item, currentUserId, noPressEffect, onPrivacyChange, onPostDelete }) => {
    const navigation = useNavigation();
    const postId = item?.id;
    const userId = item?.uid || "";
    const imageUri = item?.imageUri || "";
    const sectionId = item?.sectionId || "";
    const publicStatus = item?.publicStatus;

    // State for user data and task sections
    const { user, error: userError, loading: userLoading } = useUser(userId);
    const { comments, error: commentsError } = useRealtimeComments(postId);
    const [taskSections, setTaskSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch task sections from API
    useEffect(() => {
      const fetchTaskSections = async () => {
        try {
          const sections = await getAllTaskSections();
          setTaskSections(sections);
        } catch (error) {
          console.error("Error fetching task sections:", error);
          setFetchError(error.message);
        } finally {
          setLoadingSections(false);
        }
      };

      fetchTaskSections();
    }, []);

    const sectionColor =
      taskSections.find((section) => section.id === sectionId)?.color ||
      GlobalColors.primaryBlack;

    const timeAgo = item?.createdAt
      ? formatDistanceToNowStrict(parseISO(item.createdAt), {
          addSuffix: false,
        })
      : "Unknown time";

    const commentCount = comments?.length || 0;

    const navigateHandler = () => {
      navigation.navigate("PostDetail", {
        postId,
        userId,
        imageUri,
        sectionId,
        sectionColor,
        timeAgo,
        currentUserId,
        publicStatus,
        shouldFocusComment: false,
      });
    };

    const handleCommentPress = (event) => {
      event.stopPropagation();
      navigation.navigate("PostDetail", {
        postId,
        userId,
        imageUri,
        sectionId,
        sectionColor,
        timeAgo,
        currentUserId,
        publicStatus,
        shouldFocusComment: true,
      });
    };

    // Loading and error handling
    if (userLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalColors.primary} />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      );
    }

    if (userError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Error fetching user data.</Text>
        </View>
      );
    }

    if (loadingSections) {
      return <LoadingPlaceholder />;
    }

    if (fetchError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Error fetching task sections: {fetchError}</Text>
        </View>
      );
    }

    if (commentsError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Error fetching comments.</Text>
        </View>
      );
    }

    return (
      <Pressable onPress={navigateHandler}>
        <View style={styles.postContainer}>
          <PostHeader
            user={user}
            timeAgo={timeAgo}
            noPressEffect={noPressEffect}
            publicStatus={publicStatus}
            currentUserId={currentUserId}
            postId={postId}
            onPrivacyChange={onPrivacyChange}
            onPostDelete={onPostDelete}
          />
          <Text style={[styles.title, { color: sectionColor }]}>
            {item?.title || "No title"}
          </Text>
          <PostContent content={item?.content} />
          {imageUri && <PostImage imageUri={imageUri} />}
          <View style={styles.actionRow}>
            <LikeButton postId={postId} currentUserId={currentUserId} />
            <CommentButton
              commentCount={commentCount}
              onPress={handleCommentPress}
            />
          </View>
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: GlobalColors.pureWhite,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: GlobalColors.primary,
  },
});

export default Post;

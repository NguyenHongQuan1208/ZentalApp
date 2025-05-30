import React, { memo } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import PostHeader from "../../components/Posts/PostHeader";
import PostContent from "../../components/Posts/PostContent";
import PostImage from "../../components/Posts/PostImage";
import useUser from "../../hooks/useUser";
import LikeButton from "../../components/Posts/LikeButton";
import CommentButton from "../../components/Posts/CommentButton";
import useRealtimeComments from "../../hooks/useRealtimeComments";
import { useTranslation } from "react-i18next";

const Post = memo(
  ({
    item,
    currentUserId,
    noPressEffect,
    onPrivacyChange,
    onPostDelete,
    style,
  }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const postId = item?.id;
    const userId = item?.uid || "";
    const imageUri = item?.imageUri || "";
    const sectionId = item?.sectionId || "";
    const sectionColor = item?.sectionColor || "";
    const publicStatus = item?.publicStatus;

    const { user, error } = useUser(userId);
    const { comments } = useRealtimeComments(postId);

    const timeAgo = item?.createdAt
      ? formatDistanceToNowStrict(parseISO(item.createdAt), {
          addSuffix: false,
        })
      : "Unknown time";

    const commentCount = comments ? comments.length : 0; // Calculate comment count

    function navigateHandler() {
      navigation.navigate("PostDetail", {
        postId: postId,
        userId: userId,
        imageUri: imageUri,
        sectionId: sectionId,
        sectionColor: sectionColor,
        timeAgo: timeAgo,
        currentUserId: currentUserId,
        publicStatus: publicStatus,
        shouldFocusComment: false,
      });
    }

    function handleCommentPress(event) {
      event.stopPropagation();
      navigation.navigate("PostDetail", {
        postId: postId,
        userId: userId,
        imageUri: imageUri,
        sectionId: sectionId,
        sectionColor: sectionColor,
        timeAgo: timeAgo,
        currentUserId: currentUserId,
        publicStatus: publicStatus,
        shouldFocusComment: true,
      });
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text>Error fetching user data.</Text>
        </View>
      );
    }

    return (
      <Pressable onPress={navigateHandler} style={style}>
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
            {t(item?.title) || "No title"}
          </Text>

          <PostContent content={item?.content} />

          {typeof imageUri === "string" && imageUri.trim() !== "" && (
            <PostImage imageUri={imageUri} />
          )}

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
});

export default Post;

import React, { memo } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TASK_SECTIONS } from "../../data/dummy-data";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import PostHeader from "../../components/Posts/PostHeader";
import PostContent from "../../components/Posts/PostContent";
import PostImage from "../../components/Posts/PostImage";
import useUser from "../../hooks/useUser";
import LikeButton from "../../components/Posts/LikeButton"; // Import LikeButton

const Post = memo(({ item, currentUserId }) => {
  const navigation = useNavigation();
  const postId = item?.id;
  const userId = item?.uid || "";
  const imageUri = item?.imageUri || "";
  const sectionId = item?.sectionId || "";

  // Sử dụng hook useUser để fetch thông tin người dùng
  const { user, error } = useUser(userId);

  const sectionColor =
    TASK_SECTIONS.find((section) => section.id === sectionId)?.color ||
    GlobalColors.primaryBlack;

  const timeAgo = item?.createdAt
    ? formatDistanceToNowStrict(parseISO(item.createdAt), { addSuffix: false })
    : "Unknown time";

  function navigateHandler() {
    navigation.navigate("PostDetail", {
      postId: postId,
      userId: userId,
      imageUri: imageUri,
      sectionId: sectionId,
      sectionColor: sectionColor,
      timeAgo: timeAgo,
    });
  }

  // Hiển thị error nếu có lỗi
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error fetching user data.</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={navigateHandler}>
      <View style={styles.postContainer}>
        {/* Header */}
        <PostHeader user={user} timeAgo={timeAgo} />

        {/* Title */}
        <Text style={[styles.title, { color: sectionColor }]}>
          {item?.title || "No title"}
        </Text>

        {/* Content */}
        <PostContent content={item?.content} />

        {/* Image */}
        {typeof imageUri === "string" && imageUri.trim() !== "" && (
          <PostImage imageUri={imageUri} />
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {/* Like Button */}
          <LikeButton postId={postId} currentUserId={currentUserId} />

          {/* Comment Button */}
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => console.log("Comment clicked!")}
          >
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={GlobalColors.inActivetabBarColor}
            />
            <Text
              style={[
                styles.iconText,
                { color: GlobalColors.inActivetabBarColor },
              ]}
            >
              0
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

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
    marginTop: 6,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Post;

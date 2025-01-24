import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { getUser } from "../../util/user-info-http";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TASK_SECTIONS } from "../../data/dummy-data";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { likePost, unlikePost, checkIfLiked } from "../../util/posts-data-http";

function Post({ item, currentUserId }) {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // Trạng thái "Like"
  const postId = item?.id;
  const userId = item?.uid || "";
  const imageUri = item?.imageUri || "";
  const sectionId = item?.sectionId || "";

  useEffect(() => {
    // Kiểm tra trạng thái like khi component được tải
    const checkLikeStatus = async () => {
      const liked = await checkIfLiked(postId, currentUserId);
      setIsLiked(liked);
    };

    checkLikeStatus();
  }, [postId, currentUserId]);

  const handleLike = async () => {
    if (isLiked) {
      await unlikePost(postId, currentUserId);
    } else {
      await likePost(postId, currentUserId);
    }
    setIsLiked(!isLiked); // Cập nhật trạng thái like
  };

  // Tìm màu sắc dựa trên sectionId
  const sectionColor =
    TASK_SECTIONS.find((section) => section.id === sectionId)?.color ||
    GlobalColors.primaryBlack;

  // Hiển thị thời gian đăng bài
  const timeAgo = item?.createdAt
    ? formatDistanceToNowStrict(parseISO(item.createdAt), { addSuffix: false })
    : "Unknown time";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData || { username: "Unknown", photoUrl: null });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null); // Reset user state on error
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar photoUrl={user?.photoUrl} size={40} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || "Loading..."}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: sectionColor }]}>
        {item?.title || "No title"}
      </Text>

      {/* Content */}
      <Text style={styles.content}>{item?.content || "No content"}</Text>

      {/* Image */}
      {typeof imageUri === "string" && imageUri.trim() !== "" && (
        <Image source={{ uri: imageUri }} style={styles.postImage} />
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {/* Like Button */}
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressedButton,
          ]}
          onPress={handleLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : GlobalColors.primaryColor}
          />
          <Text style={styles.iconText}>{isLiked ? "Liked" : "Like"}</Text>
        </Pressable>

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
            color={GlobalColors.primaryColor}
          />
          <Text style={styles.iconText}>Comment</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Post;

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 12,
    color: GlobalColors.inActivetabBarColor,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    color: GlobalColors.primaryBlack,
    lineHeight: 20,
    marginBottom: 6,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
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
    color: GlobalColors.primaryColor,
  },
});

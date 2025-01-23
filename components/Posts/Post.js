import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { getUser } from "../../util/user-info-http";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";

function Post({ item }) {
  const [user, setUser] = useState(null);
  const userId = item.uid;
  const imageUri = item.imageUri;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData);
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
        <Text style={styles.username}>
          {user ? user.username : "Loading..."}
        </Text>
      </View>

      {/* Image */}
      {imageUri && (
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
          onPress={() => console.log("Liked!")}
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={GlobalColors.primaryColor}
          />
          <Text style={styles.iconText}>Like</Text>
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
    marginBottom: 10,
  },
  username: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1, // Đảm bảo ảnh vuông
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
    marginRight: 8,
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

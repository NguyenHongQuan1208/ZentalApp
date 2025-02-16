import { useNavigation } from "@react-navigation/native";
import { Pressable, Dimensions, StyleSheet, View } from "react-native";
import { TASK_SECTIONS } from "../../data/dummy-data";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import PostImage from "./PostImage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

// Get screen width
const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3; // Each item occupies 1/3 of the screen width

function PostGridItem({ item, currentUserId }) {
  const navigation = useNavigation();
  const postId = item?.id;
  const userId = item?.uid || "";
  const imageUri = item?.imageUri || "";
  const sectionId = item?.sectionId || "";
  const publicStatus = item?.publicStatus;

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
      currentUserId: currentUserId,
      publicStatus: publicStatus,
      shouldFocusComment: false,
    });
  }

  return (
    <Pressable onPress={navigateHandler} style={styles.container}>
      {typeof imageUri === "string" && imageUri.trim() !== "" && (
        <View style={styles.imageContainer}>
          <PostImage imageUri={imageUri} style={styles.image} />
          {publicStatus === 0 && (
            <View style={styles.iconBackground}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={GlobalColors.pureWhite}
              />
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    aspectRatio: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  iconBackground: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    padding: 5,
  },
});

export default PostGridItem;

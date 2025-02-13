import { useNavigation } from "@react-navigation/native";
import { Pressable, Dimensions, StyleSheet } from "react-native";
import { TASK_SECTIONS } from "../../data/dummy-data";
import { GlobalColors } from "../../constants/GlobalColors";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import PostImage from "./PostImage";

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3; // Mỗi item chiếm 1/3 chiều rộng màn hình

function PostGridItem({ item, currentUserId }) {
  const navigation = useNavigation();
  const postId = item?.id;
  const userId = item?.uid || "";
  const imageUri = item?.imageUri || "";
  const sectionId = item?.sectionId || "";

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
      shouldFocusComment: false,
    });
  }

  return (
    <Pressable onPress={navigateHandler} style={styles.container}>
      {typeof imageUri === "string" && imageUri.trim() !== "" && (
        <PostImage imageUri={imageUri} style={styles.image} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
});

export default PostGridItem;

import { FlatList, StyleSheet, View } from "react-native";
import { TASK_SECTIONS } from "../data/dummy-data";
import SectionGridTile from "../components/TaskSection/SectionGridTile";
import { GlobalColors } from "../constants/GlobalColors";
import { useEffect, useState, useContext } from "react";
import { getAllPosts } from "../util/posts-data-http";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";

function TaskScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userId, setUserId] = useState("");
  const [taskSections, setTaskSections] = useState(TASK_SECTIONS);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const authResponse = await getUserDataWithRetry(
          token,
          refreshToken,
          authCtx,
          refreshCtx
        );
        const uid = authResponse.localId;
        setUserId(uid); // Lưu UID vào state
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  useEffect(() => {
    if (!userId) return; // Chỉ fetch dữ liệu khi đã có userId

    const fetchDrafts = async () => {
      try {
        const posts = await getAllPosts();
        const updatedSections = TASK_SECTIONS.map((section) => {
          const hasDraft = posts.some(
            (post) =>
              post.status === 0 &&
              post.sectionId === section.id &&
              post.uid === userId
          );
          return { ...section, hasDraft };
        });
        setTaskSections(updatedSections);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    };

    fetchDrafts();
  }, [userId]); // Run on component mount

  const renderSectionItem = ({ item }) => {
    const {
      id,
      title,
      color,
      icon,
      benefits,
      description,
      target,
      placeholderQuestion,
      hasDraft,
    } = item;

    const pressHandler = () => {
      navigation.navigate("TaskDetail", {
        id,
        color,
        icon,
        benefits,
        description,
        target,
        placeholderQuestion,
      });
    };

    return (
      <SectionGridTile
        title={title}
        color={color}
        icon={icon}
        hasDraft={hasDraft}
        onPress={pressHandler}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={taskSections}
        keyExtractor={(section) => section.id}
        renderItem={renderSectionItem}
        numColumns={3}
      />
    </View>
  );
}

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
});

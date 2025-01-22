import { FlatList, StyleSheet, View } from "react-native";
import { TASK_SECTIONS } from "../data/dummy-data";
import SectionGridTile from "../components/TaskSection/SectionGridTile";
import { GlobalColors } from "../constants/GlobalColors";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import useRealtimePosts from "../hooks/useRealtimePosts"; // Import custom hook

function TaskScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userId, setUserId] = useState("");

  // Sử dụng hook `useRealtimePosts` để quản lý trạng thái các section
  const taskSections = useRealtimePosts(userId, TASK_SECTIONS);

  // Lấy userId sau khi đăng nhập
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
        setUserId(uid);
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

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
      if (hasDraft) {
        navigation.navigate("TaskNote", {
          id,
          color,
          icon,
          target,
          placeholderQuestion,
        });
      } else {
        navigation.navigate("TaskDetail", {
          id,
          color,
          icon,
          benefits,
          description,
          target,
          placeholderQuestion,
        });
      }
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

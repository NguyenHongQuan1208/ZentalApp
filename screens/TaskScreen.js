import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import SectionGridTitle from "../components/TaskSection/SectionGridTitle";
import { GlobalColors } from "../constants/GlobalColors";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import useRealtimePosts from "../hooks/useRealtimePosts"; // Import custom hook
import getAllTaskSections from "../util/task-section-http";
import CarouselComponent from "../components/TaskSection/CaroselComponent";

function TaskScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userId, setUserId] = useState("");
  const [taskSections, setTaskSections] = useState([]); // State for task sections
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch task sections from API
  useEffect(() => {
    async function fetchTaskSections() {
      try {
        const sections = await getAllTaskSections(); // Call your API function
        setTaskSections(sections); // Set the fetched sections
      } catch (error) {
        setError(error.message);
        console.error("Error fetching task sections:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTaskSections();
  }, []); // Empty dependency array to run only once on mount

  // Get userId after login
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

  // Use the custom hook to manage the state of sections
  const updatedSections = useRealtimePosts(userId, taskSections);

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
      <SectionGridTitle
        title={title}
        color={color}
        icon={icon}
        hasDraft={hasDraft}
        onPress={pressHandler}
      />
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={GlobalColors.primaryColor} />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    ); // Display error message
  }

  return (
    <View style={styles.container}>
      {/* Carousel at the top */}
      <View style={styles.carouselContainer}>
        <CarouselComponent />
      </View>
      {/* FlatList centered vertically in the remaining space */}
      <View style={styles.flatListContainer}>
        <FlatList
          data={updatedSections}
          keyExtractor={(section) => section.id}
          renderItem={renderSectionItem}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  carouselContainer: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: -70,
  },
});

import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import SectionGridTitle from "../components/TaskSection/SectionGridTitle";
import { GlobalColors } from "../constants/GlobalColors";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import useRealtimePosts from "../hooks/useRealtimePosts";
import getAllTaskSections from "../util/task-section-http";
import CarouselComponent from "../components/TaskSection/CarouselComponent";
import { useTranslation } from "react-i18next";

function TaskScreen({ navigation }) {
  const { t } = useTranslation();
  // Contexts
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const { token } = authCtx;
  const { refreshToken } = refreshCtx;

  // State
  const [userId, setUserId] = useState("");
  const [taskSections, setTaskSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data fetching
  const fetchUserData = useCallback(async () => {
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      setUserId(authResponse.localId);
    } catch (error) {
      console.error("Error fetching user data:", error);
      authCtx.logout();
    }
  }, [token, refreshToken, authCtx, refreshCtx]);

  const fetchTaskSections = useCallback(async () => {
    try {
      const sections = await getAllTaskSections();
      setTaskSections(sections);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching task sections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchTaskSections();
    fetchUserData();
  }, [fetchTaskSections, fetchUserData]);

  // Custom hook for realtime updates
  const updatedSections = useRealtimePosts(userId, taskSections);

  // Handlers
  const handleSectionPress = useCallback((section) => {
    const { id, color, icon, target, placeholderQuestion, hasDraft } = section;

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
        benefits: section.benefits,
        description: section.description,
        target,
        placeholderQuestion,
      });
    }
  }, [navigation]);

  const renderSectionItem = useCallback(({ item }) => (
    <SectionGridTitle
      title={t(item.title)}
      color={item.color}
      icon={item.icon}
      hasDraft={item.hasDraft}
      onPress={() => handleSectionPress(item)}
    />
  ), [handleSectionPress]);

  // Render states
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <CarouselComponent />
      </View>
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

export default TaskScreen;
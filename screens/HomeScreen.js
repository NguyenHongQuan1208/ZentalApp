import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, Image, RefreshControl } from "react-native";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { getUser } from "../util/user-info-http";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { countPostsByUser } from "../util/posts-data-http";
import { getColorAndTitle } from "../util/section-default-image-http";
import { GlobalColors } from '../constants/GlobalColors';
import ProgressBar from "../components/Home/ProgressBar";
import ProfileContainer from "../components/Home/ProfileContainer";

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userId, setUserId] = useState("");
  const [postCounts, setPostCounts] = useState({});
  const [sectionColors, setSectionColors] = useState({});
  const [sectionTitles, setSectionTitles] = useState({});
  const [sectionLevels, setSectionLevels] = useState({});
  const [sectionProgress, setSectionProgress] = useState({});
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [placeholderSections, setPlaceholderSections] = useState([]); // Store section keys for placeholders during refresh

  const POSTS_PER_LEVEL = 5; // Number of posts needed to level up

  const calculateLevelAndProgress = (count) => {
    const level = Math.floor(count / POSTS_PER_LEVEL);
    const progress = ((count % POSTS_PER_LEVEL) / POSTS_PER_LEVEL) * 100;
    return { level, progress };
  };

  const fetchUserData = useCallback(async () => {
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      const uid = authResponse.localId;
      setUserId(uid);

      const userData = await getUser(uid);
      setUserName(userData.username || "No name available");
      setPhotoUrl(userData.photoUrl || "");

      // Explicitly fetch and recount posts for the user to ensure fresh data
      const counts = await countPostsByUser(uid);
      setPostCounts(counts);

      const levels = {};
      const progress = {};
      Object.entries(counts).forEach(([section, count]) => {
        const { level, progress: prog } = calculateLevelAndProgress(count);
        levels[section] = level;
        progress[section] = prog;
      });
      setSectionLevels(levels);
      setSectionProgress(progress);

      await fetchSectionData(counts);
    } catch (error) {
      console.error("Error fetching user data:", error);
      authCtx.logout();
    }
  }, [token, refreshToken, authCtx, refreshCtx]);

  const fetchSectionData = useCallback(async (counts) => {
    const sectionIds = Object.keys(counts);
    const sectionData = await Promise.all(
      sectionIds.map(async (section) => {
        try {
          const { color, title } = await getColorAndTitle(section);
          return { section, color, title };
        } catch (error) {
          console.error(`Error fetching data for section ${section}:`, error);
          return { section, color: "#ccc", title: "Unknown Section" }; // Default values if error occurs
        }
      })
    );

    const colorMap = sectionData.reduce((acc, { section, color }) => {
      acc[section] = color;
      return acc;
    }, {});

    const titleMap = sectionData.reduce((acc, { section, title }) => {
      acc[section] = title;
      return acc;
    }, {});

    setSectionColors(colorMap);
    setSectionTitles(titleMap);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserDataChange = useCallback((userData) => {
    setUserName(userData.username || "User Name");
  }, []);

  useRealtimeUser(userId, handleUserDataChange);

  // Function to handle pull-to-refresh with explicit post count refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Store current section keys for placeholders to maintain container height
    setPlaceholderSections(Object.keys(postCounts));
    setPostCounts({});
    await fetchUserData(); // This will recount posts via countPostsByUser
    setRefreshing(false);
  }, [fetchUserData, postCounts]);

  const progressBarElements = useMemo(() => {
    // If refreshing and we have placeholder sections, render placeholders to maintain height
    if (refreshing && placeholderSections.length > 0) {
      return placeholderSections.map((section) => (
        <View key={section} style={styles.progressItemContainer}>
          <Text style={styles.sectionTitle}>Loading...</Text>
          <ProgressBar
            progress={0}
            level={0}
            color="#ccc"
            barStyle={{ borderWidth: 0.5, borderColor: "#ccc" }}
          />
        </View>
      ));
    }

    // If no post counts, show no data message
    if (Object.keys(postCounts).length === 0 && !refreshing) {
      return (
        <Text style={styles.noDataText}>No posts yet. Start posting to see your progress!</Text>
      );
    }

    // Render actual progress bars
    return Object.entries(postCounts).map(([section, count]) => {
      const sectionColor = sectionColors[section] || "#000";
      const sectionTitle = sectionTitles[section] || "Unknown Section";
      const level = sectionLevels[section] || 0;
      const progress = sectionProgress[section] || 0;

      return (
        <View key={section} style={styles.progressItemContainer}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <ProgressBar
            progress={progress}
            level={level}
            color={sectionColor}
            barStyle={{ borderWidth: 0.5, borderColor: sectionColor }}
          />
        </View>
      );
    });
  }, [postCounts, sectionColors, sectionTitles, sectionLevels, sectionProgress, refreshing, placeholderSections]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[GlobalColors.primaryColor]}
          tintColor={GlobalColors.primaryColor}
        />
      }
    >
      <ProfileContainer photoUrl={photoUrl} userName={userName} />
      <View style={styles.progressBarsContainer}>
        <View style={styles.headerContainer}>
          <Image source={require("../assets/stats.png")} style={styles.statsImage} />
          <Text style={styles.headerText}>My Stats</Text>
        </View>
        {progressBarElements}
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statsImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalColors.primaryBlack,
  },
  progressBarsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressItemContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: GlobalColors.primaryBlack,
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    padding: 16,
    fontWeight: "500",
  },
});

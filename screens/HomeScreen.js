import { useContext, useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  Text,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { getUser } from "../util/user-info-http";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { countPostsByUser } from "../util/posts-data-http";
import { getColorAndTitle } from "../util/section-default-image-http";
import { GlobalColors } from "../constants/GlobalColors";
import ProfileContainer from "../components/Home/ProfileContainer";
import StatsSection from "../components/Home/StatsSection";
import ArticleList from "../components/Home/ArticleList";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

function HomeScreen() {
  const { t } = useTranslation();
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
  const [refreshing, setRefreshing] = useState(false);
  const [placeholderSections, setPlaceholderSections] = useState([]);

  const POSTS_PER_LEVEL = 5;

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
          return { section, color: "#ccc", title: "Unknown Section" };
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPlaceholderSections(Object.keys(postCounts));
    setPostCounts({});
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData, postCounts]);

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
      <StatsSection
        postCounts={postCounts}
        sectionColors={sectionColors}
        sectionTitles={sectionTitles}
        sectionLevels={sectionLevels}
        sectionProgress={sectionProgress}
        refreshing={refreshing}
        placeholderSections={placeholderSections}
      />
      <View style={styles.articlesContainer}>
        <View style={styles.articlesHeader}>
          <Ionicons name="flask" size={24} color={GlobalColors.primaryColor} />
          <Text style={styles.articlesTitle}>{t("the_science")}</Text>
        </View>
        <ArticleList />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          2025 ©Zental, Inc. All Rights Reserved. Twill does not provide medical
          advice, psychiatric diagnosis or treatment. All third-party
          trademarks, service marks, logos and domain names appearing on this
          web page are the property of their respective owners. None of these
          companies endorse, sponsor or are in any way affiliated with Twill.
          See additional information.
        </Text>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalColors.primaryGrey,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8,
  },
  articlesContainer: {
    width: "100%",
    marginTop: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginBottom: 20,
  },
  articlesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  articlesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: GlobalColors.primaryBlack,
    textAlign: "center",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: "#959393",
  },
});

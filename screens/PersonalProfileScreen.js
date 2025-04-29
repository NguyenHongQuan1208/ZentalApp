import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import IconButton from "../components/ui/IconButton";
import OptionsModal from "../components/ui/OptionsModal";
import { getAllPosts } from "../util/posts-data-http";
import Post from "../components/Posts/Post";
import ToggleViewMode from "../components/PersonalProfile/ToggleViewMode";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import PostGridItem from "../components/Posts/PostGridItem";
import {
  followUser,
  unfollowUser,
  checkIfFollowing,
} from "../util/follow-http";
import ProfileHeader from "../components/PersonalProfile/ProfileHeader";
import { useTranslation } from "react-i18next";

const PersonalProfileScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const { token } = authCtx;
  const { refreshToken } = refreshCtx;

  const [currentUserId, setCurrentUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    userName: "",
    photoUrl: "",
    bio: "",
  });
  const [userId, setUserId] = useState(route.params?.userId || "");
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(t("Public Posts")); // Sử dụng t() cho Public Posts
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(true);
  const [loadingFollowStatus, setLoadingFollowStatus] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async (userId) => {
    if (!userId) return setError("No user ID provided.");
    try {
      const userData = await getUser(userId);
      setUserData({
        userName: userData.username || "No name available",
        photoUrl: userData.photoUrl || "",
        bio: userData.bio || "No bio",
      });
      setError(null);
    } catch (error) {
      setError("Failed to load user data.");
    }
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const allPosts = await getAllPosts();
      const filteredPosts = allPosts.filter((post) => {
        const isUserPost = post.uid === userId && post.status === 1;
        if (selectedFilter === t("All Posts")) return isUserPost;
        return (
          isUserPost &&
          post.publicStatus === (selectedFilter === t("Public Posts") ? 1 : 0)
        );
      });

      const sortedPosts = filteredPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
      setError(null);
    } catch (error) {
      setError("Failed to load posts.");
    } finally {
      setRefreshing(false);
      setLoadingFilter(false);
    }
  }, [userId, selectedFilter, t]);

  // Fetch current user data
  const fetchCurrentUserData = useCallback(async () => {
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      setCurrentUserId(authResponse.localId);
      setError(null);
    } catch (error) {
      setError("Failed to fetch current user data.");
    } finally {
      setLoading(false);
    }
  }, [token, refreshToken, authCtx, refreshCtx]);

  // Fetch initial follow status
  const fetchFollowStatus = useCallback(async () => {
    if (!currentUserId || !userId) return;

    setLoadingFollowStatus(true); // Start loading

    try {
      const isFollowingUser = await checkIfFollowing(currentUserId, userId);
      setIsFollowing(isFollowingUser);
    } catch (error) {
      console.error("Error checking follow status: ", error);
    } finally {
      setLoadingFollowStatus(false); // End loading
    }
  }, [currentUserId, userId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUserId || !userId) return;

    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, userId);
        setIsFollowing(false);
      } else {
        await followUser(currentUserId, userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status: ", error);
    }
  }, [currentUserId, userId, isFollowing]);

  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      fetchPosts();
    }
  }, [userId, fetchUserData, fetchPosts]);

  useEffect(() => {
    if (currentUserId && userId) {
      setSelectedFilter(
        currentUserId === userId ? t("All Posts") : t("Public Posts")
      );
      fetchFollowStatus();
    }
  }, [currentUserId, userId, fetchFollowStatus, t]);

  const handleUserDataChange = useCallback((userData) => {
    setUserData({
      userName: userData.username || "User Name",
      photoUrl: userData.photoUrl || null,
      bio: userData.bio || null,
    });
  }, []);

  useRealtimeUser(userId, handleUserDataChange);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    await Promise.all([fetchUserData(userId), fetchPosts()]);
    setRefreshing(false);
  }, [fetchUserData, fetchPosts, userId]);

  const onPrivacyChange = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onPostDelete = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderPost = useCallback(
    ({ item }) => (
      <View style={viewMode === "grid" ? styles.postsGrid : styles.postWrapper}>
        {viewMode === "grid" ? (
          <PostGridItem
            item={item}
            currentUserId={currentUserId}
            onPrivacyChange={onPrivacyChange}
            onPostDelete={onPostDelete}
          />
        ) : (
          <Post
            item={item}
            currentUserId={currentUserId}
            noPressEffect
            onPrivacyChange={onPrivacyChange}
            onPostDelete={onPostDelete}
          />
        )}
      </View>
    ),
    [currentUserId, viewMode, onPrivacyChange, onPostDelete]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (loading || !currentUserId || !userId) return null;

        const isCurrentUserProfile = currentUserId === userId;
        return (
          <IconButton
            icon={isCurrentUserProfile ? "add" : "alert-circle"}
            size={24}
            color="white"
            onPress={() =>
              isCurrentUserProfile
                ? navigation.navigate("AppOverview", { screen: "Task" })
                : console.log("Options")
            }
          />
        );
      },
    });
  }, [navigation, currentUserId, userId, loading]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const options = useMemo(
    () => [t("All Posts"), t("Public Posts"), t("Private Posts")],
    [t]
  );

  const handleSelect = (option) => {
    setLoadingFilter(true);
    setSelectedFilter(option);
    fetchPosts();
    closeModal();
  };

  const onSwipe = (event) => {
    const { translationX } = event.nativeEvent;
    if (Math.abs(translationX) > 50) {
      setViewMode(translationX < 0 ? "list" : "grid");
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const ListHeaderComponent = () => (
    <>
      <ProfileHeader
        userData={userData}
        currentUserId={currentUserId}
        userId={userId}
        isFollowing={isFollowing}
        toggleFollow={toggleFollow}
        openModal={openModal}
        viewMode={viewMode}
      />
      <ToggleViewMode
        viewMode={viewMode}
        setViewMode={setViewMode}
        style={{ marginBottom: viewMode === "grid" ? 1 : 16 }}
      />
      {posts.length === 0 && (
        <View
          style={[
            styles.postsContainer,
            { marginTop: viewMode === "grid" ? 15 : 0 },
          ]}
        >
          <Text style={styles.noPostsText}>{t("No post available")}</Text>
        </View>
      )}
    </>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler activeOffsetX={[-10, 10]} onGestureEvent={onSwipe}>
        <View style={styles.container}>
          {loading || loadingFilter || loadingFollowStatus ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={GlobalColors.primaryColor}
              />
            </View>
          ) : (
            <FlatList
              key={viewMode + posts.length}
              data={posts}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={renderPost}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={21}
              numColumns={viewMode === "grid" ? 3 : 1}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[GlobalColors.primaryColor]}
                  tintColor={GlobalColors.primaryColor}
                />
              }
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={{ gap: 2 }}
              columnWrapperStyle={viewMode === "grid" ? { gap: 2 } : null}
            />
          )}
          <OptionsModal
            visible={modalVisible}
            onClose={closeModal}
            onSelect={handleSelect}
            title={t("Select Filter")}
            options={options}
          />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  postsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  postWrapper: {
    paddingHorizontal: 16,
  },
  noPostsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default PersonalProfileScreen;

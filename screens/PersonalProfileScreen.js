import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useContext, useCallback } from "react";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import IconButton from "../components/ui/IconButton";
import FollowButton from "../components/PersonalProfile/FollowButton";
import FilterButton from "../components/PersonalProfile/FilterButton";
import OptionsModal from "../components/ui/OptionsModal";
import { getAllPosts } from "../util/posts-data-http";
import Post from "../components/Posts/Post";
import UserProfileHeader from "../components/PersonalProfile/UserProfileHeader";
import ToggleViewMode from "../components/PersonalProfile/ToggleViewMode";
import { PanGestureHandler } from "react-native-gesture-handler"; // Import PanGestureHandler

function PersonalProfileScreen({ route, navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [userId, setUserId] = useState(route.params?.userId || "");
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Posts");
  const [viewMode, setViewMode] = useState("list");

  const fetchUserData = useCallback(async (userId) => {
    if (!userId) {
      console.warn("No userId provided");
      setError("No user ID provided.");
      return;
    }
    try {
      const userData = await getUser(userId);
      setUserName(userData.username || "No name available");
      setPhotoUrl(userData.photoUrl || "");
      setBio(userData.bio || "No bio");
      setError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data.");
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const allPosts = await getAllPosts();
      const filteredPosts = allPosts.filter((post) => {
        const isUserPost = post.uid === userId && post.status === 1;

        if (selectedFilter === "All Posts") return isUserPost;
        if (selectedFilter === "Public Posts")
          return isUserPost && post.publicStatus === 1;
        return isUserPost && post.publicStatus === 0;
      });

      const sortedPosts = filteredPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts.");
    } finally {
      setRefreshing(false);
    }
  }, [userId, selectedFilter]);

  async function fetchCurrentUserData() {
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
      console.error("Error fetching user data:", error);
      setError("Failed to fetch current user data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserData();
  }, [token, refreshToken]);

  useEffect(() => {
    fetchUserData(userId);
  }, [userId, fetchUserData]);

  const handleUserDataChange = useCallback((userData) => {
    setUserName(userData.username || "User Name");
    setPhotoUrl(userData.photoUrl || null);
    setBio(userData.bio || null);
  }, []);

  useRealtimeUser(userId, handleUserDataChange);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId, fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await Promise.all([fetchUserData(userId), fetchPosts()]);
    } catch (error) {
      console.error("Error during refresh:", error);
      setError("Failed to refresh data.");
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserData, fetchPosts, userId]);

  const renderPost = useCallback(
    ({ item }) => {
      return (
        <View style={styles.postWrapper}>
          {viewMode === "grid" ? (
            <Text style={styles.dummyGridText}>Grid Item</Text>
          ) : (
            <Post item={item} currentUserId={currentUserId} noPressEffect />
          )}
        </View>
      );
    },
    [currentUserId, viewMode]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (loading || !currentUserId || !userId) {
          return null;
        }

        const isCurrentUserProfile = currentUserId === userId;

        return isCurrentUserProfile ? (
          <IconButton
            icon="add"
            size={24}
            color="white"
            onPress={() =>
              navigation.navigate("AppOverview", { screen: "Task" })
            }
          />
        ) : (
          <IconButton
            icon="alert-circle"
            size={24}
            color="white"
            onPress={() => console.log("Options")}
          />
        );
      },
    });
  }, [navigation, currentUserId, userId, loading]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const options = ["All Posts", "Public Posts", "Private Posts"];

  const handleSelect = (option) => {
    setSelectedFilter(option);
    fetchPosts();
    closeModal();
  };

  const onSwipe = (event) => {
    const { translationX } = event.nativeEvent;

    if (translationX < -50) {
      // Swipe phải
      setViewMode("list");
    } else if (translationX > 50) {
      // Swipe trái
      setViewMode("grid");
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
      <View style={styles.headerContainer}>
        <UserProfileHeader userName={userName} bio={bio} photoUrl={photoUrl} />
        <View style={styles.buttonsContainer}>
          <FollowButton
            title="Following"
            onPress={() => console.log("Following pressed")}
          />
          <FollowButton
            title="Follower"
            onPress={() => console.log("Follower pressed")}
          />
          {currentUserId === userId && <FilterButton onPress={openModal} />}
        </View>
      </View>

      {/* View Mode Toggle */}
      <ToggleViewMode viewMode={viewMode} setViewMode={setViewMode} />

      {posts.length === 0 && (
        <View style={styles.postsContainer}>
          <Text style={styles.noPostsText}>No Posts yet</Text>
        </View>
      )}
    </>
  );

  return (
    <PanGestureHandler onGestureEvent={onSwipe}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderPost}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[GlobalColors.primaryColor]}
                tintColor={GlobalColors.primaryColor}
              />
            }
            ListHeaderComponent={ListHeaderComponent}
          />
        )}

        <OptionsModal
          visible={modalVisible}
          onClose={closeModal}
          onSelect={handleSelect}
          title="Select Filter"
          options={options}
        />
      </View>
    </PanGestureHandler>
  );
}

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
  headerContainer: {
    backgroundColor: GlobalColors.pureWhite,
    paddingBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: -10,
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
});

export default PersonalProfileScreen;

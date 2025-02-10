import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import Avatar from "../components/Profile/Avatar";
import { useState, useEffect, useContext } from "react";
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

function PersonalProfileScreen({ route, navigation }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch current user data with retry logic
  async function fetchCurrentUserData() {
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      const uid = authResponse.localId;
      setCurrentUserId(uid);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserData();
  }, [token, refreshToken]);

  const { userId: routeUserId } = route.params || {};
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [userId, setUserId] = useState(routeUserId);

  // Fetch user data based on userId
  async function fetchUserData() {
    try {
      if (!userId) {
        console.log("No userId provided");
        return;
      }
      const userData = await getUser(userId);
      setUserName(userData.username || "No name available");
      setPhotoUrl(userData.photoUrl || "");
      setBio(userData.bio || "This user has no bio.");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Handle user data changes in real-time
  const handleUserDataChange = (userData) => {
    setUserName(userData.username || "User Name");
    setPhotoUrl(userData.photoUrl || null);
    setBio(userData.bio || null);
  };

  useRealtimeUser(userId, handleUserDataChange);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!loading && currentUserId && userId) {
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
              onPress={() => {
                console.log("Options");
              }}
            />
          );
        }
        return null;
      },
    });
  }, [navigation, currentUserId, userId, loading]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (option) => {
    console.log("Selected option:", option);
    closeModal(); // Close the modal after selection
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Avatar photoUrl={photoUrl} size={60} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.bio}>{bio}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <FollowButton
              title="Following"
              onPress={() => console.log("Following pressed")}
            />
            <FollowButton
              title="Follower"
              onPress={() => console.log("Follower pressed")}
            />
            {currentUserId === userId && (
              <FilterButton
                onPress={openModal} // Open modal when pressed
              />
            )}
          </View>

          <View style={styles.postsContainer}>
            <Text style={styles.postsText}>No Posts yet</Text>
          </View>

          {/* Render OptionsModal */}
          <OptionsModal
            visible={modalVisible}
            onClose={closeModal}
            onSelect={handleSelect}
            title="Select Filter"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: GlobalColors.thirdColor,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    marginLeft: 15,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  bio: {
    marginTop: 3,
    fontSize: 14,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
  },
  postsContainer: {
    flex: 1,
    backgroundColor: GlobalColors.primaryGrey,
    borderTopWidth: 2,
    borderTopColor: GlobalColors.primaryColor,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  postsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
});

export default PersonalProfileScreen;

import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Avatar from "../components/Profile/Avatar";
import { useState, useEffect, useContext } from "react";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import useRealtimeUser from "../hooks/useRealtimeUser";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";

function PersonalProfileScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

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
      setLoading(false); // Set loading to false after fetching
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

  return (
    <View style={styles.container}>
      {loading ? ( // Full-screen loading indicator
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
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              android_ripple={{ color: "#ccc" }}
            >
              <Text style={styles.buttonText}>Following</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              android_ripple={{ color: "#ccc" }}
            >
              <Text style={styles.buttonText}>Follower</Text>
            </Pressable>
            {currentUserId === userId && ( // Render filter button only if currentUserId matches userId
              <Pressable
                style={({ pressed }) => [
                  styles.filterButton,
                  pressed && styles.buttonPressed,
                ]}
                android_ripple={{ color: "#ccc" }}
              >
                <Icon name="funnel-outline" size={20} color="#fff" />
              </Pressable>
            )}
          </View>

          <View style={styles.postsContainer}>
            <Text style={styles.postsText}>Các bài đăng</Text>
          </View>
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
    backgroundColor: "#f5f5f5", // Optional: same as container background
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
  button: {
    backgroundColor: GlobalColors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    backgroundColor: GlobalColors.primaryColor,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    marginLeft: 3,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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

import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { getUser } from "../util/user-info-http";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { RefreshTokenContext } from "../store/RefreshTokenContext";

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

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

        const userData = await getUser(uid);
        setUserName(userData.username || "No name available");
      } catch (error) {
        console.error("Error fetching user data:", error);
        authCtx.logout();
      }
    }
    fetchUserData();
  }, [token, refreshToken, authCtx, refreshCtx]);

  const handleUserDataChange = (userData) => {
    setUserName(userData.username || "User Name");
  };

  // Lắng nghe thay đổi dữ liệu người dùng realtime
  useRealtimeUser(userId, handleUserDataChange);
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {userName}</Text>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Màu nền
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Màu chữ
  },
});

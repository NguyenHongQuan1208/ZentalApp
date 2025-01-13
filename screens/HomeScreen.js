import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { getUser } from "../util/user-info-http";

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const authResponse = await getUserData(token);
        const uid = authResponse.localId;
        setUserId(uid); // Lưu UID vào state
        const userData = await getUser(uid);
        setUserName(userData.username || "No name available");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, [token]);

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

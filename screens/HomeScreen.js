import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
function HomeScreen() {
  // const name = route.params
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUserData(token);
        const displayName = response.displayName;
        setUsername(displayName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, [token]);
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {username}</Text>
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

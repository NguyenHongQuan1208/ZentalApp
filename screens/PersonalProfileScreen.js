import { Text, View, StyleSheet, Pressable } from "react-native";
import Avatar from "../components/Profile/Avatar";
import { useState, useEffect } from "react";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import useRealtimeUser from "../hooks/useRealtimeUser";

function PersonalProfileScreen({ route }) {
  // Get userId from navigation params
  const { userId: routeUserId } = route.params || {};
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [userId, setUserId] = useState(routeUserId); // Set initial userId from params

  async function fetchData() {
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
    fetchData();
  }, [userId]); // Fetch data when userId changes

  const handleUserDataChange = (userData) => {
    setUserName(userData.username || "User Name");
    setPhotoUrl(userData.photoUrl || null);
    setBio(userData.bio || null);
  };

  // Lắng nghe thay đổi dữ liệu người dùng realtime
  useRealtimeUser(userId, handleUserDataChange);

  return (
    <View style={styles.container}>
      {/* Phần thông tin cá nhân */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Avatar photoUrl={photoUrl} size={60} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </View>

      {/* Các nút Following và Follower nằm ngang */}
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
      </View>

      {/* Phần các bài đăng */}
      <View style={styles.postsContainer}>
        <Text style={styles.postsText}>Các bài đăng</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: "row", // Nút nằm ngang
    justifyContent: "space-evenly", // Căn đều
    width: "100%", // Chiếm hết chiều rộng
    paddingHorizontal: 20, // Lề trái phải
    marginTop: -10, // Giảm khoảng cách giữa các nút và phần thông tin cá nhân
    marginBottom: 10,
  },
  button: {
    backgroundColor: GlobalColors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "48%", // Kích thước nút
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
    flex: 1, // Chiếm phần còn lại của màn hình
    backgroundColor: GlobalColors.primaryGrey, // Màu nền
    borderTopWidth: 2, // Đường viền ngăn cách
    borderTopColor: GlobalColors.primaryColor, // Màu đường viền
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

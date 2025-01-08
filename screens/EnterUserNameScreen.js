import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../store/auth-context";
import { getUserData, updateProfile } from "../util/auth";

function EnterUserNameScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(true); // Trạng thái kiểm tra
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    async function checkIfUserNameSet() {
      try {
        const response = await getUserData(token); // Đảm bảo sử dụng await
        const uid = response.localId;

        const isUserNameSet = await AsyncStorage.getItem(`userNameSet_${uid}`);
        if (isUserNameSet === "true") {
          navigation.replace("AppOverview"); // Chuyển hướng nếu đã đặt tên
        }
      } catch (error) {
        console.error("Error checking username set:", error);
      } finally {
        setIsChecking(false); // Đánh dấu kiểm tra đã hoàn tất
      }
    }
    checkIfUserNameSet();
  }, [navigation, token]);

  if (isChecking) {
    // Hiển thị màn hình tải khi đang kiểm tra
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  async function saveUserToDatabase() {
    if (username.trim() === "") {
      Alert.alert("Invalid Input", "Please enter a valid username.");
      return;
    }

    try {
      const response = await updateProfile(token, username); // Đảm bảo API trả về localId
      const uid = response.localId;

      await AsyncStorage.setItem(`userNameSet_${uid}`, "true"); // Lưu trạng thái đã đặt tên
      navigation.replace("AppOverview"); // Chuyển hướng sau khi lưu
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update user information. Please try again."
      );
      console.error("Error updating profile:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Save" onPress={saveUserToDatabase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: "white",
  },
});

export default EnterUserNameScreen;

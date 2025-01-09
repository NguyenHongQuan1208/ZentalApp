import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../store/auth-context";
import { getUserData, updateProfile } from "../util/auth";
import { GlobalColors } from "../constants/GlobalColors";
import LongButton from "../components/ui/LongButton";
import { storeUser } from "../util/user-info-http";

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
      const email = response.email;

      const userData = {
        uid,
        username,
        email,
        photoUrl: "", // Chưa có ảnh, sẽ thêm sau
        bio: "", // Chưa có mô tả, sẽ thêm sau
      };

      const newRespone = await storeUser(uid, userData);
      console.log(newRespone);

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
      <LongButton style={styles.button} onPress={saveUserToDatabase}>
        Save
      </LongButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: GlobalColors.primaryWhite,
  },
  label: {
    fontSize: 24,
    fontWeight: "600",
    color: GlobalColors.thirdColor,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: GlobalColors.primaryWhite,
    borderColor: GlobalColors.secondColor,
    borderWidth: 1,
    color: GlobalColors.primaryBlack, // Text color for input
    fontSize: 18,
    fontWeight: "500",
  },
  button: {
    backgroundColor: GlobalColors.thirdColor, // Button color
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default EnterUserNameScreen;

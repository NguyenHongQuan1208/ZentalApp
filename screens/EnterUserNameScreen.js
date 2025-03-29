import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import { updateProfile } from "../util/auth";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { GlobalColors } from "../constants/GlobalColors";
import LongButton from "../components/ui/LongButton";
import { checkUserIdExists, storeUser } from "../util/user-info-http";
import { RefreshTokenContext } from "../store/RefreshTokenContext";

function EnterUserNameScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(true); // Trạng thái kiểm tra
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  async function checkIfUserNameSet() {
    try {
      if (!refreshToken) {
        console.error("No refresh token available.");
        authCtx.logout();
        return;
      }
      const response = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );

      if (response?.error) {
        console.error("Error fetching user data:", response.error);
        authCtx.logout();
        return;
      }

      if (!response?.localId) {
        authCtx.logout();
        return;
      }

      const uid = response.localId;
      const userIdExists = await checkUserIdExists(uid);

      if (userIdExists) {
        navigation.replace("AppOverview");
      }
    } catch (error) {
      console.error("Error checking username set:", error);
      authCtx.logout();
    } finally {
      setIsChecking(false);
    }
  }

  useEffect(() => {
    checkIfUserNameSet();
  }, []);

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
      };

      const newRespone = await storeUser(uid, userData);
      navigation.replace("AppOverview"); // Chuyển hướng sau khi lưu
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update user information. Please try again."
      );
      console.error("Error updating profile:", error);
    }
  }

  if (isChecking) {
    // Hiển thị màn hình tải khi đang kiểm tra
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
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
    color: GlobalColors.primaryColor,
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
    backgroundColor: GlobalColors.primaryColor, // Button color
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default EnterUserNameScreen;

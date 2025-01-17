import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import { getUserData, updateProfile } from "../util/auth";
import { GlobalColors } from "../constants/GlobalColors";
import LongButton from "../components/ui/LongButton";
import { checkUserIdExists, storeUser } from "../util/user-info-http";
import { refreshTokenFn } from "../util/auth";
import { RefreshTokenContext } from "../store/RefreshTokenContext";

function EnterUserNameScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(true); // Trạng thái kiểm tra
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const refreshCtx = useContext(RefreshTokenContext);
  const refreshToken = refreshCtx.refreshToken;
  async function getUserDataWithRetry(token, refreshToken, refreshTokenFn) {
    const response = await getUserData(token); // Gọi hàm getUserData

    // Kiểm tra xem phản hồi có chứa lỗi không
    if (response.error) {
      if (response.message === "INVALID_ID_TOKEN") {
        console.log("Token is invalid or expired. Refreshing token...");

        // Kiểm tra refreshToken
        if (!refreshToken) {
          console.error("Refresh token is missing.");
          throw new Error("Refresh token is missing");
        }

        try {
          const newTokens = await refreshTokenFn(refreshToken); // Làm mới token
          authCtx.authenticate(newTokens.idToken); // Cập nhật token mới trong AuthContext

          // Gọi lại API với token mới
          const newResponse = await getUserData(newTokens.idToken);
          if (newResponse) {
            console.log("Refresh Token Success");

            // Điều hướng lại trang sau khi refresh token thành công
            // navigation.replace("AppOverview");
          }
          return newResponse;
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          throw refreshError; // Nếu refresh thất bại, ném lỗi
        }
      }
      // Nếu lỗi không phải là INVALID_ID_TOKEN, trả về lỗi khác
      console.log({ error: response.message || "Unknown error" });
      return { error: response.message || "Unknown error" };
    }

    return response; // Trả về dữ liệu người dùng nếu không có lỗi
  }

  useEffect(() => {
    async function checkIfUserNameSet() {
      try {
        if (!refreshToken) {
          console.error("No refresh token available.");
          authCtx.logout();
          return;
        }

        // Gọi hàm để kiểm tra user data và thử lại nếu token hết hạn
        let response = await getUserDataWithRetry(
          token,
          refreshToken,
          refreshTokenFn
        );

        if (response?.error) {
          // Nếu có lỗi (ví dụ: token hết hạn, không có refresh token), xử lý như logout hoặc làm mới token
          console.error("Error fetching user data:", response.error);
          if (
            response.error === "Refresh token is missing" ||
            response.error === "Failed to refresh token"
          ) {
            authCtx.logout(); // Nếu lỗi liên quan đến refresh token, logout
            return;
          }
          // Nếu lỗi không phải là liên quan đến refresh token, bạn có thể tiếp tục các hành động khác (ví dụ: hiển thị cảnh báo, v.v.)
        }

        if (!response?.localId) {
          authCtx.logout(); // Nếu không có localId, logout
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
        setIsChecking(false); // Đánh dấu kiểm tra đã hoàn tất
      }
    }

    checkIfUserNameSet();
  }, [navigation, token, authCtx, refreshToken]);

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

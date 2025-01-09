import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { useContext, useState, useEffect } from "react";
import Avatar from "../components/Profile/Avatar";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";
import { getUserData } from "../util/auth";
import { Ionicons } from "@expo/vector-icons";
import { getUser } from "../util/user-info-http";

function EditProfileScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(""); // Để lưu URL ảnh đại diện
  const [bio, setBio] = useState("");

  async function fetchData() {
    try {
      const authResponse = await getUserData(token);
      const uid = authResponse.localId;

      // Lấy thông tin người dùng từ Firebase Realtime Database
      const userData = await getUser(uid);
      // Cập nhật thông tin người dùng vào state
      setUserName(userData.username || "");
      setPhotoUrl(userData.photoUrl || "");
      setBio(userData.bio || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar photoUrl={photoUrl} />
        <Pressable style={styles.editIcon}>
          <Ionicons name="pencil" size={18} color={GlobalColors.primaryBlack} />
        </Pressable>
      </View>

      {/* Tên người dùng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      {/* Bio */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Enter your bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>

      {/* Save Button */}
      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: GlobalColors.primaryWhite,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  editIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalColors.secondColor,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: GlobalColors.thirdColor,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: GlobalColors.primaryWhite,
    borderColor: GlobalColors.secondColor,
    borderWidth: 1,
    color: GlobalColors.primaryBlack,
    fontSize: 18,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top", // Đảm bảo text nằm ở trên khi nhập multiline
  },
  saveButton: {
    backgroundColor: GlobalColors.thirdColor,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.5,
  },
});

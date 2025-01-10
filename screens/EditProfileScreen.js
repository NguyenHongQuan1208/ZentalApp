import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import Avatar from "../components/Profile/Avatar";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";
import { getUserData } from "../util/auth";
import { Ionicons } from "@expo/vector-icons";
import { getUser, updateUser } from "../util/user-info-http";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";

function EditProfileScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function fetchData() {
    try {
      const authResponse = await getUserData(token);
      const uid = authResponse.localId;

      const userData = await getUser(uid);
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

  function handleTakePhoto() {
    console.log("Take Photo");
    setIsModalVisible(false); // Đóng Modal
  }

  function handleSelectPhoto() {
    console.log("Select Photo");
    setIsModalVisible(false); // Đóng Modal
  }

  async function handleDeletePhoto() {
    try {
      // const authResponse = await getUserData(token);
      // const uid = authResponse.localId;

      // // Xóa ảnh trên Firebase Auth
      // await updateProfile(token, null, ""); // Cập nhật ảnh đại diện trên Firebase
      // await updateUser(uid, { photoUrl: "" });

      setPhotoUrl(""); // Xóa ảnh trên giao diện
      setIsModalVisible(false); // Đóng Modal
      Alert.alert("Success", "Profile photo deleted successfully.");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      Alert.alert("Error", "Failed to delete profile photo.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar photoUrl={photoUrl} />
        <Pressable
          style={styles.editIcon}
          onPress={() => setIsModalVisible(true)} // Hiển thị Modal
        >
          <Ionicons name="pencil" size={18} color={GlobalColors.primaryBlack} />
        </Pressable>
      </View>

      {/* Modal */}
      <PhotoOptionsModal
        visible={isModalVisible}
        onTakePhoto={handleTakePhoto}
        onSelectPhoto={handleSelectPhoto}
        onDeletePhoto={handleDeletePhoto}
        onClose={() => setIsModalVisible(false)}
      />

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
    textAlignVertical: "top",
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

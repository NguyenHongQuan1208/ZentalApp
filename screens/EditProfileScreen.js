import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  Button,
} from "react-native";
import Avatar from "../components/Profile/Avatar";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";
import { getUserData, updateProfile } from "../util/auth";
import { Ionicons } from "@expo/vector-icons";
import { getUser, updateUser } from "../util/user-info-http";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";
import { supabase } from "../store/supabaseClient";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";

function EditProfileScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState();
  // Camera permission
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }

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

  // Handle taking photo
  const handleTakePhoto = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (result) {
        setFile(result.assets[0]);
        setPhotoUrl(result.assets[0].uri); // Set the photo URL after taking the picture
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo.");
    }

    setIsModalVisible(false); // Close the modal after taking the photo
  };

  // Handle selecting photo from library
  const handleSelectPhoto = async () => {
    try {
      const result = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (result) {
        setFile(result.assets[0]);
        setPhotoUrl(result.assets[0].uri); // Set the selected image URL
      }
      setIsModalVisible(false); // Close the modal after selecting a photo
    } catch (error) {
      Alert.alert("Error", "Failed to select photo.");
    }
  };

  async function handleDeletePhoto() {
    try {
      setPhotoUrl(""); // Remove photo from the interface
      setIsModalVisible(false); // Close the modal
      Alert.alert("Success", "Profile photo deleted successfully.");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      Alert.alert("Error", "Failed to delete profile photo.");
    }
  }

  async function handleSave() {
    let publicUrl = null; // Khai báo biến publicUrl ở phạm vi lớn hơn
    if (file) {
      try {
        // Lấy userId từ Firebase Auth
        const authResponse = await getUserData(token);
        const uid = authResponse.localId;
        // console.log(uid);
        // Tạo tên tệp với userId
        const filePath = `profile_photos/${uid}_${Date.now()}.jpg`;
        const { data, error } = await supabase.storage
          .from("ZentalApp")
          .upload(filePath, {
            uri: file.uri,
            type: file.type,
            name: filePath,
          });

        if (error) {
          console.error("Upload error:", error.message);
          Alert.alert("Error", "Failed to upload profile photo.");
          return;
        }

        // Lấy link công khai
        const { data: publicData, error: publicError } = supabase.storage
          .from("ZentalApp")
          .getPublicUrl(filePath);

        if (publicError) {
          console.error("Public URL error:", publicError.message);
          Alert.alert(
            "Error",
            "Failed to generate public URL for the profile photo."
          );
          return;
        }

        // Gán giá trị publicUrl vào biến ngoài phạm vi try-catch
        publicUrl = publicData.publicUrl;
        // console.log(publicUrl); // Log URL trước khi sử dụng
      } catch (uploadError) {
        Alert.alert("Error", "Failed to upload profile photo.");
        console.error("Error uploading photo:", uploadError);
        return;
      }
    }

    // Đảm bảo userName không trống
    if (!userName.trim()) {
      Alert.alert("Validation Error", "Username cannot be empty.");
      return;
    }

    try {
      const authResponse = await getUserData(token);
      const uid = authResponse.localId;

      // Chuẩn bị dữ liệu người dùng
      const updateUserData = {
        username: userName,
        bio: bio || null, // Set bio thành null nếu không có dữ liệu
        photoUrl: publicUrl || null, // Sử dụng publicUrl nếu có, nếu không thì sử dụng photoUrl hiện tại
      };

      // Cập nhật thông tin trong Firebase Auth
      await updateProfile(token, userName, publicUrl);

      // Cập nhật thông tin trong Firebase Realtime Database
      await updateUser(uid, updateUserData);

      Alert.alert("Success", "Your profile has been updated.");
      navigation.navigate("AppOverview", { screen: "Profile" });
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again later.");
      console.error("Error saving profile:", error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar photoUrl={photoUrl} />
        <Pressable
          style={styles.editIcon}
          onPress={() => setIsModalVisible(true)} // Show modal
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

      {/* Username */}
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
        onPress={handleSave}
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

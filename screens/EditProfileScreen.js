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
    if (!userName.trim()) {
      Alert.alert("Validation Error", "Username cannot be empty.");
      return;
    }

    try {
      const authResponse = await getUserData(token);
      const uid = authResponse.localId;

      const updateUserData = {
        username: userName,
        bio: bio || null, // Set bio to null if it's empty
        photoUrl: photoUrl || null, // Save photo URL if exists
      };

      const authRespone = await updateProfile(token, userName, photoUrl);
      // console.log(authRespone);
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

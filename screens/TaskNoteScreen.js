import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";
import LongButton from "../components/ui/LongButton";
import { Ionicons } from "@expo/vector-icons";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { GlobalColors } from "../constants/GlobalColors";
import Target from "../components/TaskSection/Target";

function TaskNoteScreen({ route }) {
  const sectionId = route.params.id;
  const color = route.params.color;
  const icon = route.params.icon;
  const target = route.params.target;

  const [textInputValue, setTextInputValue] = useState("");
  const [file, setFile] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái của modal

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

  const handleTakePhoto = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo.");
    }
    setIsModalVisible(false);
  };

  const handleSelectPhoto = async () => {
    try {
      const result = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select photo.");
    }
    setIsModalVisible(false);
  };

  const handleDeletePhoto = () => {
    setImageUri(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Target icon={icon} target={target} />
      <View style={styles.headerContainer}>
        <Ionicons name="bulb" size={16} color={color} />
        <Text style={[styles.textTitle, { color: color }]}>You decide How</Text>
      </View>

      {/* TextInput */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your decision here"
        value={textInputValue}
        onChangeText={setTextInputValue}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Image Preview */}
      <View style={styles.imagePreviewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Image
            source={require("../assets/image-preview.jpg")} // Đảm bảo bạn có ảnh mặc định trong assets
            style={styles.imagePreview}
          />
        )}

        {/* Button nằm trên ảnh */}
        <Pressable
          style={styles.overlayButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.overlayButtonText}>Take or Choose Photo</Text>
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

      <View>
        <LongButton>PLEDGE TO DO IT</LongButton>
        <LongButton>I'VE DONE IT, POST</LongButton>
      </View>
    </View>
  );
}

export default TaskNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  imagePreviewContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  overlayButton: {
    position: "absolute",
    top: "40%",
    left: "20%",
    bottom: "40%",
    right: "20%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  overlayButtonText: {
    color: GlobalColors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});

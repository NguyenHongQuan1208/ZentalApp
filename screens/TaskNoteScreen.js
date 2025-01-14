import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";
import { Ionicons } from "@expo/vector-icons";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";

function TaskNoteScreen({ route }) {
  const sectionId = route.params.id;
  const color = route.params.color;

  const [textInputValue, setTextInputValue] = useState("");
  const [file, setFile] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái của modal

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

  // Hàm chọn ảnh từ thư viện
  const handleSelectPhoto = async () => {
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
        setImageUri(result.assets[0].uri); // Set the photo URL after taking the picture
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo.");
    }

    setIsModalVisible(false); // Close the modal after taking the photo
  };

  // Hàm chụp ảnh mới
  const handleTakePhoto = async () => {
    try {
      const result = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
        setImageUri(result.assets[0].uri); // Set the selected image URL
      }
      setIsModalVisible(false); // Close the modal after selecting a photo
    } catch (error) {
      Alert.alert("Error", "Failed to select photo.");
    }
  };

  // Hàm xóa ảnh đã chọn
  const handleDeletePhoto = () => {
    setImageUri(""); // Xóa ảnh đã chọn
    setIsModalVisible(false); // Đóng modal
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="bulb" size={16} color={color} />
        <Text style={[styles.text, { color: color }]}>You decide How</Text>
      </View>

      {/* TextInput */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your decision here"
        value={textInputValue}
        onChangeText={setTextInputValue}
      />

      {/* Image Preview */}
      <View style={styles.imagePreviewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Image
            source={require("../assets/image-preview.jpg")} // Đảm bảo bạn có ảnh mặc định ở thư mục assets
            style={styles.imagePreview}
          />
        )}
      </View>

      {/* Button để mở modal chọn ảnh hoặc chụp ảnh */}
      <Button
        title="Take or Choose from Library"
        onPress={() => setIsModalVisible(true)}
      />

      {/* Modal với các tùy chọn */}
      <PhotoOptionsModal
        visible={isModalVisible}
        onTakePhoto={handleTakePhoto}
        onSelectPhoto={handleSelectPhoto}
        onDeletePhoto={handleDeletePhoto}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}

export default TaskNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginLeft: 8,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 20,
  },
  imagePreviewContainer: {
    width: "100%", // Đảm bảo ảnh preview chiếm hết chiều ngang màn hình
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%", // Đảm bảo ảnh chiếm hết chiều ngang
    height: 200, // Bạn có thể điều chỉnh chiều cao theo ý muốn
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

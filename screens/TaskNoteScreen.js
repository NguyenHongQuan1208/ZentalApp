import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
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
import { addPost, getAllPosts, updatePost } from "../util/posts-data-http";
import { getUserData } from "../util/auth";
import { AuthContext } from "../store/auth-context";

function TaskNoteScreen({ route, navigation }) {
  const sectionId = route.params.id;
  const color = route.params.color;
  const icon = route.params.icon;
  const target = route.params.target;

  const [textInputValue, setTextInputValue] = useState("");
  const [file, setFile] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const authCtx = useContext(AuthContext);
  const [uid, setUid] = useState(null); // Store UID here

  useEffect(() => {
    const fetchUserData = async () => {
      const token = authCtx.token;
      const authResponse = await getUserData(token);
      setUid(authResponse.localId); // Fetch and set UID
    };

    fetchUserData();
  }, [authCtx.token]); // Dependency on token to refetch user data when token changes

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const posts = await getAllPosts();
        const filteredPost = posts.find(
          (post) =>
            post.status === 0 &&
            post.sectionId === sectionId &&
            post.uid === uid
        );
        if (filteredPost) {
          setTextInputValue(filteredPost.content);
          setImageUri(filteredPost.imageUri);
        }
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };

    fetchPostData();
  }, [sectionId, uid]); // Dependency vào sectionId và uid

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

  // Hàm lưu bài đăng lên Firebase khi nhấn "PLEDGE TO DO IT" với status là 0
  const handlePledgeToDoIt = async () => {
    if (!textInputValue || !uid) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    const postData = {
      uid: uid,
      sectionId: sectionId,
      title: target,
      content: textInputValue,
      imageUri,
      status: 0, // Mark as incomplete
    };

    try {
      // Lấy tất cả các bài đăng để kiểm tra bài viết đã tồn tại
      const posts = await getAllPosts();
      const existingPost = posts.find(
        (post) =>
          post.status === 0 && post.sectionId === sectionId && post.uid === uid
      );

      if (existingPost) {
        // Cập nhật bài viết nếu đã tồn tại
        await updatePost(existingPost.id, postData);
        Alert.alert("Success", "Your note has been updated.");
      } else {
        // Thêm bài viết mới nếu chưa tồn tại
        const newPostId = await addPost(postData);
        Alert.alert("Success", "Your note has been saved.");
      }

      // Chuyển hướng về màn hình tổng quan nhiệm vụ
      navigation.navigate("AppOverview", { screen: "Tasks" });
    } catch (error) {
      Alert.alert("Error", "Failed to save or update post.");
      console.error(error);
    }
  };

  const handlePost = async () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.targetContainer}>
          <Target
            icon={icon}
            target={target}
            color={GlobalColors.secondBlack}
            size={13}
          />
        </View>
        <View style={styles.headerContainer}>
          <Ionicons name="bulb" size={16} color={color} />
          <Text style={[styles.textTitle, { color: color }]}>
            You decide How
          </Text>
        </View>

        {/* Nội dung chính */}
        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your decision here"
            value={textInputValue}
            onChangeText={setTextInputValue}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.imagePreviewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Image
                source={require("../assets/image-preview.jpg")}
                style={styles.imagePreview}
              />
            )}

            <Pressable
              style={styles.overlayButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.overlayButtonText}>Take or Choose Photo</Text>
            </Pressable>
          </View>
        </View>

        {/* Modal */}
        <PhotoOptionsModal
          visible={isModalVisible}
          onTakePhoto={handleTakePhoto}
          onSelectPhoto={handleSelectPhoto}
          onDeletePhoto={handleDeletePhoto}
          onClose={() => setIsModalVisible(false)}
        />

        {/* Nút nằm ở cuối màn hình */}
        <View style={styles.footer}>
          <LongButton
            style={[
              styles.longButton,
              { backgroundColor: GlobalColors.inActivetabBarColor },
            ]}
            onPress={handlePledgeToDoIt}
          >
            PLEDGE TO DO IT
          </LongButton>
          <LongButton style={styles.longButton} onPress={handlePost}>
            I'VE DONE IT, POST
          </LongButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default TaskNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  targetContainer: {
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  content: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
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
  footer: {
    marginTop: 16, // Khoảng cách giữa nội dung và footer
    marginBottom: 28,
    justifyContent: "flex-end", // Đẩy nút xuống cuối màn hình
  },
  longButton: {
    width: "100%",
    marginTop: 8,
    paddingVertical: 12,
  },
});

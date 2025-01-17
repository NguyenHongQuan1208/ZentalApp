import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";
import LongButton from "../components/ui/LongButton";
import NoteImagePreview from "../components/TaskSection/NoteImagePreview";
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
import { supabase } from "../store/supabaseClient";

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
      if (!uid || !sectionId) return; // Tránh gọi API khi dữ liệu chưa sẵn sàng

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

    let publicUrl = imageUri;

    try {
      if (file) {
        // Tạo tên tệp duy nhất
        const filePath = `task_notes/${uid}_${sectionId}_${Date.now()}.jpg`;

        // Upload ảnh lên Supabase
        const { data, error } = await supabase.storage
          .from("ZentalApp")
          .upload(filePath, {
            uri: file.uri,
            type: file.type,
            name: filePath,
          });

        if (error) {
          console.error("Upload error:", error.message);
          Alert.alert("Error", "Failed to upload image.");
          return;
        }

        // Lấy URL công khai cho ảnh vừa tải lên
        const { data: publicData, error: publicError } = supabase.storage
          .from("ZentalApp")
          .getPublicUrl(filePath);

        if (publicError) {
          console.error("Public URL error:", publicError.message);
          Alert.alert("Error", "Failed to generate public URL for the image.");
          return;
        }

        publicUrl = publicData.publicUrl;
      }

      // Chuẩn bị dữ liệu để gửi lên
      const postData = {
        uid: uid,
        sectionId: sectionId,
        title: target,
        content: textInputValue,
        imageUri: publicUrl, // Sử dụng publicUrl nếu có ảnh
        status: 0, // Mark as incomplete
      };

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
        await addPost(postData);
        Alert.alert("Success", "Your note has been saved.");
      }

      // Chuyển hướng về màn hình tổng quan nhiệm vụ
      navigation.navigate("AppOverview", { screen: "Tasks" });
    } catch (error) {
      Alert.alert("Error", "Failed to save or update post.");
      console.error(error);
    }
  };

  const handlePost = async () => {
    navigation.navigate("ConfirmPost");
  };

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

          <NoteImagePreview
            imageUri={imageUri}
            onPress={() => setIsModalVisible(true)}
          />
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

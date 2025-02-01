import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
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
import { AuthContext } from "../store/auth-context";
import { supabase } from "../store/supabaseClient";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { fetchImageBySectionId } from "../util/section-default-image-http";

const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;

function TaskNoteScreen({ route, navigation }) {
  const sectionId = route.params.id;
  const color = route.params.color;
  const icon = route.params.icon;
  const target = route.params.target;
  const placeholderQuestion = route.params.placeholderQuestion;

  const [textInputValue, setTextInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [file, setFile] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [uid, setUid] = useState(null); // Store UID here

  useEffect(() => {
    const fetchUserData = async () => {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      setUid(authResponse.localId); // Fetch and set UID
    };

    fetchUserData();
  }, [token, refreshToken]); // Dependency on token to refetch user data when token changes

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
          setIsFocused(true);
        }
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };

    fetchPostData();
  }, [sectionId, uid]); // Dependency vào sectionId và uid

  useEffect(() => {
    const fetchDefaultImage = async () => {
      if (!sectionId) return; // Đảm bảo sectionId hợp lệ

      try {
        const defaultImageUri = await fetchImageBySectionId(sectionId);
        if (defaultImageUri) {
          setImageUri((prevUri) => prevUri || defaultImageUri); // Chỉ set ảnh mặc định nếu người dùng chưa chọn ảnh
        }
      } catch (error) {
        console.error("Error fetching default image:", error);
      }
    };

    fetchDefaultImage();
  }, [sectionId]);

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
        aspect: [1, 1],
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
        aspect: [1, 1],
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

  // Hàm dùng chung để upload ảnh lên Supabase và trả về public URL
  const uploadImageToSupabase = async (file, uid, sectionId) => {
    try {
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
        return null;
      }

      // Lấy URL công khai
      const { data: publicData, error: publicError } = supabase.storage
        .from("ZentalApp")
        .getPublicUrl(filePath);

      if (publicError) {
        console.error("Public URL error:", publicError.message);
        Alert.alert("Error", "Failed to generate public URL for the image.");
        return null;
      }

      return publicData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during image upload:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while uploading the image."
      );
      return null;
    }
  };

  // Hàm lưu bài đăng lên cơ sở dữ liệu
  const saveOrUpdatePost = async (postData, sectionId, uid) => {
    try {
      const posts = await getAllPosts();
      const existingPost = posts.find(
        (post) =>
          post.status === 0 && post.sectionId === sectionId && post.uid === uid
      );

      if (existingPost) {
        await updatePost(existingPost.id, postData);
        Alert.alert("Success", "Your note has been updated.");
      } else {
        await addPost(postData);
        Alert.alert("Success", "Your note has been saved.");
      }
    } catch (error) {
      console.error("Error saving or updating post:", error);
      Alert.alert("Error", "Failed to save or update post.");
    }
  };

  // Tối ưu hàm handlePledgeToDoIt
  const handlePledgeToDoIt = async () => {
    if (!textInputValue || !uid) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    let publicUrl = imageUri;

    try {
      // Upload ảnh nếu có file
      if (file) {
        const uploadedUrl = await uploadImageToSupabase(file, uid, sectionId);
        if (uploadedUrl) {
          publicUrl = uploadedUrl;
        }
      } else if (!imageUri) {
        // Nếu chưa có ảnh, lấy ảnh mặc định
        publicUrl = await fetchImageBySectionId(sectionId);
      }

      // Chuẩn bị dữ liệu để lưu
      const postData = {
        content: textInputValue,
        imageUri: publicUrl,
        sectionId: sectionId,
        status: 0, // Mark as incomplete
        title: target,
        uid: uid,
      };

      await saveOrUpdatePost(postData, sectionId, uid);

      // Chuyển hướng về màn hình tổng quan nhiệm vụ
      navigation.navigate("AppOverview", { screen: "Task" });
    } catch (error) {
      console.error("Error in handlePledgeToDoIt:", error);
      Alert.alert("Error", "Failed to process your note.");
    }
  };

  // Tối ưu hàm handlePost
  const handlePost = async () => {
    if (!textInputValue.trim()) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    let publicUrl = imageUri;

    try {
      // Upload ảnh nếu có file
      if (file) {
        const uploadedUrl = await uploadImageToSupabase(file, uid, sectionId);
        if (uploadedUrl) {
          publicUrl = uploadedUrl;
        }
      }

      // Điều hướng sang màn hình ConfirmPost
      navigation.navigate("ConfirmPost", {
        content: textInputValue,
        imageUri: publicUrl,
        sectionId: sectionId,
        title: target,
        uid: uid,
        icon: icon,
        color: color,
      });
    } catch (error) {
      console.error("Error in handlePost:", error);
      Alert.alert("Error", "Failed to process your post.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Scrollable Area */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

        {/* Main Content */}
        <View style={styles.content}>
          {isFocused && (
            <Text style={[styles.placeholderText, { color: color }]}>
              {placeholderQuestion}
            </Text>
          )}
          <TextInput
            style={[styles.textInput, isFocused && { borderColor: color }]}
            placeholder={placeholderQuestion}
            value={textInputValue}
            onChangeText={setTextInputValue}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <NoteImagePreview
            imageUri={imageUri}
            sectionId={sectionId}
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
      </ScrollView>

      {/* Footer (Fixed at bottom) */}
      <View style={styles.footer}>
        <View style={styles.footerOverlay}>
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
    </View>
  );
}

export default TaskNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
    minHeight: 800,
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
    fontWeight: "500",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    marginLeft: 10,
    alignSelf: "flex-start",
    marginBottom: 2,
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
    backgroundColor: GlobalColors.pureWhite,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  footerOverlay: {
    padding: 16,
    paddingBottom: aspectRatio <= 1.78 ? 16 : 32,
    width: "100%",
    alignItems: "center",
  },
  longButton: {
    width: "100%",
    marginTop: 8,
    paddingVertical: 12,
  },
});

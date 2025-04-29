import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
} from "expo-image-picker";
import PhotoOptionsModal from "../components/Profile/PhotoOptionsModal";
import LongButton from "../components/ui/LongButton";
import NoteImagePreview from "../components/TaskSection/NoteImagePreview";
import Target from "../components/TaskSection/Target";
import { GlobalColors } from "../constants/GlobalColors";
import { addPost, getAllPosts, updatePost } from "../util/posts-data-http";
import { AuthContext } from "../store/auth-context";
import { supabase } from "../store/supabaseClient";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { fetchDefaultImageUriBySectionId } from "../util/section-default-image-http";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

function TaskNoteScreen({ route, navigation }) {
  const { t } = useTranslation();
  // Destructure route params
  const {
    id: sectionId,
    color,
    icon,
    target,
    placeholderQuestion,
  } = route.params;

  // State management
  const [textInputValue, setTextInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [defaultImageUri, setDefaultImageUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [uid, setUid] = useState(null);

  // Contexts
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authResponse = await getUserDataWithRetry(
          authCtx.token,
          refreshCtx.refreshToken,
          authCtx,
          refreshCtx
        );
        setUid(authResponse.localId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authCtx, refreshCtx]);

  // Fetch post data
  useEffect(() => {
    const fetchPostData = async () => {
      if (!uid || !sectionId) return;

      try {
        const posts = await getAllPosts();
        const draftPost = posts.find(
          (post) =>
            post.status === 0 &&
            post.sectionId === sectionId &&
            post.uid === uid
        );

        if (draftPost) {
          setTextInputValue(draftPost.content);
          setImageUri(draftPost.imageUri);
          setIsFocused(true);
        }
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };

    fetchPostData();
  }, [sectionId, uid]);

  // Fetch default image
  useEffect(() => {
    const fetchDefaultImage = async () => {
      if (!sectionId) return;

      try {
        const uri = await fetchDefaultImageUriBySectionId(sectionId);
        if (uri) {
          setDefaultImageUri(uri);
          setImageUri((prevUri) => prevUri || uri);
        }
      } catch (error) {
        console.error("Error fetching default image:", error);
      }
    };

    fetchDefaultImage();
  }, [sectionId]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => Platform.OS === "android" && setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => Platform.OS === "android" && setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Camera permissions
  const verifyPermissions = useCallback(async () => {
    if (cameraPermissionInformation.status === "UNDETERMINED") {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === "DENIED") {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }, [cameraPermissionInformation]);

  // Image handling
  const handleTakePhoto = useCallback(async () => {
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
  }, [verifyPermissions]);

  const handleSelectPhoto = useCallback(async () => {
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
  }, []);

  const handleDeletePhoto = useCallback(() => {
    setImageUri(defaultImageUri);
    setIsModalVisible(false);
  }, [defaultImageUri]);

  // Supabase image upload
  const uploadImageToSupabase = useCallback(async (file, uid, sectionId) => {
    try {
      const filePath = `task_notes/${uid}_${sectionId}_${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("ZentalApp")
        .upload(filePath, {
          uri: file.uri,
          type: file.type,
          name: filePath,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("ZentalApp")
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error.message);
      Alert.alert("Error", "Failed to upload image.");
      return null;
    }
  }, []);

  // Post management
  const saveOrUpdatePost = useCallback(
    async (postData) => {
      try {
        const posts = await getAllPosts();
        const existingPost = posts.find(
          (post) =>
            post.status === 0 &&
            post.sectionId === postData.sectionId &&
            post.uid === postData.uid
        );

        existingPost
          ? await updatePost(existingPost.id, postData)
          : await addPost(postData);

        Alert.alert("Success", existingPost ? "Note updated" : "Note saved");
        navigation.navigate("AppOverview", { screen: "Task" });
      } catch (error) {
        console.error("Post error:", error);
        Alert.alert("Error", "Failed to save note.");
      }
    },
    [navigation]
  );

  // Button handlers
  const handlePledgeToDoIt = useCallback(async () => {
    if (!textInputValue || !uid) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    try {
      const publicUrl = file
        ? await uploadImageToSupabase(file, uid, sectionId)
        : imageUri || defaultImageUri;

      await saveOrUpdatePost({
        content: textInputValue,
        sectionColor: color,
        imageUri: publicUrl,
        sectionId,
        status: 0,
        title: target,
        uid,
      });
    } catch (error) {
      console.error("Pledge error:", error);
      Alert.alert("Error", "Failed to process your note.");
    }
  }, [
    textInputValue,
    uid,
    file,
    imageUri,
    defaultImageUri,
    sectionId,
    color,
    target,
    uploadImageToSupabase,
    saveOrUpdatePost,
  ]);

  const handlePost = useCallback(async () => {
    if (!textInputValue.trim()) {
      Alert.alert("Error", "Please enter your note.");
      return;
    }

    try {
      const publicUrl = file
        ? await uploadImageToSupabase(file, uid, sectionId)
        : imageUri;

      navigation.navigate("ConfirmPost", {
        content: textInputValue,
        imageUri: publicUrl,
        sectionId,
        sectionColor: color,
        title: target,
        uid,
        icon,
        color,
      });
    } catch (error) {
      console.error("Post error:", error);
      Alert.alert("Error", "Failed to process your post.");
    }
  }, [
    textInputValue,
    file,
    uid,
    sectionId,
    imageUri,
    color,
    target,
    icon,
    navigation,
    uploadImageToSupabase,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.targetContainer}>
          <Target
            icon={icon}
            target={t(target)}
            color={GlobalColors.secondBlack}
            size={13}
          />
        </View>

        <View style={styles.headerContainer}>
          <Ionicons name="bulb" size={16} color={color} />
          <Text style={[styles.textTitle, { color }]}>
            {t("You decide How")}
          </Text>
        </View>

        <View style={styles.content}>
          {isFocused && (
            <Text style={[styles.placeholderText, { color }]}>
              {placeholderQuestion}
            </Text>
          )}
          <TextInput
            style={[styles.textInput, isFocused && { borderColor: color }]}
            placeholder={placeholderQuestion}
            value={textInputValue}
            onChangeText={setTextInputValue}
            multiline
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

        <PhotoOptionsModal
          visible={isModalVisible}
          onTakePhoto={handleTakePhoto}
          onSelectPhoto={handleSelectPhoto}
          onDeletePhoto={handleDeletePhoto}
          onClose={() => setIsModalVisible(false)}
        />
      </ScrollView>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <View style={styles.footerOverlay}>
            <LongButton
              style={[
                styles.longButton,
                { backgroundColor: GlobalColors.inActivetabBarColor },
              ]}
              onPress={handlePledgeToDoIt}
            >
              {t("PLEDGE TO DO IT")}
            </LongButton>
            <LongButton style={styles.longButton} onPress={handlePost}>
              {t("I'VE DONE IT, POST")}
            </LongButton>
          </View>
        </View>
      )}
    </View>
  );
}

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

export default TaskNoteScreen;

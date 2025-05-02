import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import Avatar from "../components/Profile/Avatar";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";
import { updateProfile } from "../util/auth";
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
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { useTranslation } from "react-i18next";

function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;

  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        t("editProfile.permissionTitle"),
        t("editProfile.permissionMessage")
      );
      return false;
    }

    return true;
  }

  async function fetchData() {
    setIsLoading(true);
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );

      const uid = authResponse.localId;
      const userData = await getUser(uid);
      setUserEmail(userData.email || "");
      setUserName(userData.username || "");
      setPhotoUrl(userData.photoUrl || "");
      setBio(userData.bio || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [token, refreshToken]);

  const handleTakePhoto = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result) {
        setFile(result.assets[0]);
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.cameraError"));
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
        setPhotoUrl(result.assets[0].uri);
      }
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.libraryError"));
    }
  };

  async function handleDeletePhoto() {
    try {
      setPhotoUrl("");
      setIsModalVisible(false);
      Alert.alert(t("editProfile.successTitle"), t("editProfile.photoDeleted"));
    } catch (error) {
      console.error("Failed to delete photo:", error);
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.deleteError"));
    }
  }

  async function handleSave() {
    setIsLoading(true);

    let publicUrl = photoUrl;

    if (file) {
      try {
        const authResponse = await getUserDataWithRetry(
          token,
          refreshToken,
          authCtx,
          refreshCtx
        );

        const uid = authResponse.localId;
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
          Alert.alert(
            t("editProfile.errorTitle"),
            t("editProfile.uploadFailed")
          );
          return;
        }

        const { data: publicData, error: publicError } = supabase.storage
          .from("ZentalApp")
          .getPublicUrl(filePath);

        if (publicError) {
          console.error("Public URL error:", publicError.message);
          Alert.alert(
            t("editProfile.errorTitle"),
            t("editProfile.urlGenerationError")
          );
          return;
        }

        publicUrl = publicData.publicUrl;
      } catch (uploadError) {
        Alert.alert(t("editProfile.errorTitle"), t("editProfile.uploadFailed"));
        console.error("Error uploading photo:", uploadError);
        return;
      }
    }

    if (!userName.trim()) {
      Alert.alert(
        t("editProfile.validationError"),
        t("editProfile.usernameRequired")
      );
      return;
    }

    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      const uid = authResponse.localId;

      const updateUserData = {
        username: userName,
        bio: bio,
        photoUrl: publicUrl,
      };

      await updateProfile(token, userName, publicUrl);
      await updateUser(uid, updateUserData);

      Alert.alert(
        t("editProfile.successTitle"),
        t("editProfile.profileUpdated")
      );
      navigation.navigate("AppOverview", { screen: "Profile" });
    } catch (error) {
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.saveError"));
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t("editProfile.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar photoUrl={photoUrl} />
        <Pressable
          style={styles.editIcon}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="pencil" size={18} color={GlobalColors.primaryBlack} />
        </Pressable>
      </View>
      <Text style={styles.userEmail}>{userEmail}</Text>

      <PhotoOptionsModal
        visible={isModalVisible}
        onTakePhoto={handleTakePhoto}
        onSelectPhoto={handleSelectPhoto}
        onDeletePhoto={handleDeletePhoto}
        onClose={() => setIsModalVisible(false)}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("editProfile.usernameLabel")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("editProfile.usernamePlaceholder")}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("editProfile.bioLabel")}</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder={t("editProfile.bioPlaceholder")}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>{t("editProfile.saveButton")}</Text>
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
  userEmail: {
    marginTop: -5,
    fontSize: 13,
    color: GlobalColors.inActivetabBarColor,
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
    color: GlobalColors.primaryColor,
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
    backgroundColor: GlobalColors.primaryColor,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.primaryWhite,
  },
  loadingText: {
    color: GlobalColors.primaryColor,
  },
});

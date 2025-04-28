import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";
import Avatar from "../components/Profile/Avatar";
import MenuItem from "../components/Profile/MenuItem";
import { GlobalColors } from "../constants/GlobalColors";
import { getUser } from "../util/user-info-http";
import useRealtimeUser from "../hooks/useRealtimeUser";
import { getUserDataWithRetry } from "../util/refresh-auth-token";
import { useTranslation } from "react-i18next";

const menuItems = [
  { icon: "person", screen: "PersonalProfile", screenName: "Personal Profile" },
  { icon: "home", screen: "Home", screenName: "Home" },
  { icon: "sunny", screen: "Task", screenName: "Tasks" },
  { icon: "paper-plane", screen: "Posts", screenName: "Posts" },
  { icon: "chatbubbles", screen: "Chats", screenName: "Chats" },
  { icon: "exit", screen: "logout", screenName: "Log out" },
];

const ProfileScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);
  const token = authCtx.token;
  const refreshToken = refreshCtx.refreshToken;
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userName, setUserName] = useState("User Name");
  const [userId, setUserId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const fetchData = useCallback(async () => {
    try {
      const authResponse = await getUserDataWithRetry(
        token,
        refreshToken,
        authCtx,
        refreshCtx
      );
      const uid = authResponse.localId;
      setUserId(uid);

      const userData = await getUser(uid);
      setUserName(userData.username || "");
      setPhotoUrl(userData.photoUrl || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserDataChange = useCallback((userData) => {
    setUserName(userData.username || "User Name");
    setPhotoUrl(userData.photoUrl || null);
  }, []);

  useRealtimeUser(userId, handleUserDataChange);

  const pressHandler = useCallback(() => {
    navigation.navigate("EditProfile");
  }, [navigation]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Avatar photoUrl={photoUrl} size={100} />
      <Text style={styles.userName}>{userName}</Text>

      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          styles.editProfile,
          pressed && styles.editPressed,
        ]}
      >
        <Ionicons name="create" size={16} color={GlobalColors.thirdColor} />
        <Text style={styles.editText}>{t("Edit profile")}</Text>
      </Pressable>

      {/* Language Selection Radio Buttons */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>{t("Language")}</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleLanguageChange('en')}
          >
            <View style={[
              styles.radioCircle,
              selectedLanguage === 'en' && styles.selectedRadioCircle
            ]} />
            <Text style={styles.radioText}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton, styles.radioButtonRight]}
            onPress={() => handleLanguageChange('vi')}
          >
            <View style={[
              styles.radioCircle,
              selectedLanguage === 'vi' && styles.selectedRadioCircle
            ]} />
            <Text style={styles.radioText}>Tiếng Việt</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={`${item.screen}-${index}`}
            icon={item.icon}
            screen={item.screen}
            screenName={t(item.screenName)}
            userId={userId}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  userName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  editProfile: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
  },
  editPressed: {
    opacity: 0.5,
  },
  editText: {
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.thirdColor,
    fontWeight: "500",
  },
  menuContainer: {
    marginTop: 20,
    width: "90%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GlobalColors.primaryGrey,
  },
  languageContainer: {
    marginTop: 20,
    width: "90%",
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: GlobalColors.primaryBlack,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButtonRight: {
    justifyContent: "flex-end",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GlobalColors.thirdColor,
    marginRight: 8,
  },
  selectedRadioCircle: {
    backgroundColor: GlobalColors.thirdColor,
  },
  radioText: {
    fontSize: 14,
    color: GlobalColors.primaryBlack,
  },
});

export default React.memo(ProfileScreen);

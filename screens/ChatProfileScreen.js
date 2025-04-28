import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { getUser } from "../util/user-info-http";
import Avatar from "../components/Profile/Avatar";
import SelectItem from "../components/ui/SelectItem";
import { GlobalColors } from "../constants/GlobalColors";
import { useTranslation } from "react-i18next";

const ChatProfileScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { otherUserId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUser(otherUserId);
        setUserInfo(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [otherUserId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={GlobalColors.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar photoUrl={userInfo?.photoUrl} size={80} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userInfo?.username}</Text>
          <Text style={styles.email}>{userInfo?.email}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <SelectItem
          icon="person"
          itemName={t("View Profile")}
          userId={otherUserId}
          onPress={() =>
            navigation.navigate("PersonalProfile", { userId: otherUserId })
          }
        />
        <SelectItem
          icon="person-add"
          itemName={t("Set Nickname")}
          userId={otherUserId}
          onPress={() => console.log("Set Nickname")}
        />
        <SelectItem
          icon="alert-circle"
          itemName={t("Report Account")}
          userId={otherUserId}
          onPress={() => console.log("Report Account")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    marginTop: 12,
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
  optionsContainer: {
    marginTop: 20,
  },
});

export default ChatProfileScreen;

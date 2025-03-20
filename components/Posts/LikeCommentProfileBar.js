import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Avatar from "../Profile/Avatar";
import { getUser } from "../../util/user-info-http";
import useRealtimeUser from "../../hooks/useRealtimeUser";
import { GlobalColors } from "../../constants/GlobalColors";
import { useNavigation } from "@react-navigation/native";

const LikeCommentProfileBar = React.memo(({ userId, onClose }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userName, setUserName] = useState("User Name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await getUser(userId);
        setUserName(user.username);
        setPhotoUrl(user.photoUrl);
      } catch (err) {
        setError(err.message || "Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError("No userId provided.");
      setIsLoading(false);
    }
  }, [userId]);

  const handleUserDataChange = (userData) => {
    setUserName(userData.username || "User Name");
    setPhotoUrl(userData.photoUrl || null);
  };

  useRealtimeUser(userId, handleUserDataChange);

  const handleProfilePress = useCallback(() => {
    if (userId) {
      onClose(); // Gọi hàm onClose để đóng Modal
      navigation.navigate("PersonalProfile", { userId: userId });
    }
  }, [navigation, userId, onClose]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={GlobalColors.primaryColor} />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <Pressable
      onPress={handleProfilePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      accessible={true}
      aria-label={`View profile of ${userName}`}
    >
      <View style={styles.container}>
        <Avatar photoUrl={photoUrl} size={40} />
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    padding: 12,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 12,
  },
});

export default LikeCommentProfileBar;

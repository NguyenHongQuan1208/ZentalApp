import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Avatar from "../Profile/Avatar";
import { getUser } from "../../util/user-info-http";
import useRealtimeUser from "../../hooks/useRealtimeUser";
import { GlobalColors } from "../../constants/GlobalColors";

const ProfileBar = ({ userId }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userName, setUserName] = useState("User Name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <View style={styles.container}>
      <Avatar photoUrl={photoUrl} size={40} />
      <Text style={styles.userName}>{userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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

export default ProfileBar;

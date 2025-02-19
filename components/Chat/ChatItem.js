import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import { getUser } from "../../util/user-info-http";
import useRealtimeUser from "../../hooks/useRealtimeUser";

const ChatItem = ({
  userId,
  lastMessage,
  lastMessageTime,
  unreadCount,
  onPress,
}) => {
  const [userName, setUserName] = useState("User Name");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const formattedTime = new Date(lastMessageTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={GlobalColors.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarColumn}>
        <Avatar photoUrl={photoUrl} size={50} />
      </View>

      <View style={styles.nameColumn}>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          {lastMessage}
        </Text>
      </View>

      <View style={styles.infoColumn}>
        <View style={styles.timeUnreadContainer}>
          <Text style={styles.time}>{formattedTime}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalColors.pureWhite,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: GlobalColors.primaryBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  nameColumn: {
    flex: 2,
    justifyContent: "center",
  },
  infoColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalColors.primaryBlack,
    maxWidth: "100%",
  },
  timeUnreadContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  time: {
    fontSize: 12,
    color: GlobalColors.lightGray,
  },
  unreadBadge: {
    backgroundColor: GlobalColors.error500,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  unreadText: {
    color: GlobalColors.primaryWhite,
    fontSize: 10,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: GlobalColors.primaryGrey,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  errorContainer: {
    padding: 15,
    alignItems: "center",
  },
  errorText: {
    color: GlobalColors.errorRed,
    textAlign: "center",
  },
});

export default ChatItem;

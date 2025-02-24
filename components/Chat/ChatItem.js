import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Avatar from "../Profile/Avatar";
import { getUnreadCount } from "../../util/chat-list-data-http";
import { GlobalColors } from "../../constants/GlobalColors";
import useRealtimeUser from "../../hooks/useRealtimeUser";

const ChatItem = ({
  user,
  lastMsg,
  lastMsgTime,
  currentUserId,
  onPress,
  style,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState(user?.username);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const userId = user?.uid;

  // Fetch unread count when the component mounts or when `currentUserId` or `user.uid` changes
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount(currentUserId, user.uid);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [currentUserId, user.uid]);

  // Use the custom hook to listen for user data changes
  useRealtimeUser(userId, (userData) => {
    if (userData) {
      setUsername(userData.username);
      setPhotoUrl(userData.photoUrl);
    }
  });

  // Memoize the onPress handler to avoid unnecessary re-renders
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.avatarColumn}>
        <Avatar photoUrl={photoUrl} size={50} />
      </View>

      <View style={styles.nameColumn}>
        <Text style={styles.userName} numberOfLines={1}>
          {username}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          {lastMsg}
        </Text>
      </View>

      <View style={styles.infoColumn}>
        <View style={styles.timeUnreadContainer}>
          <Text style={styles.time}>{lastMsgTime}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
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
    marginVertical: 3,
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
    marginLeft: -24,
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
    alignItems: "center",
    justifyContent: "flex-end",
  },
  time: {
    fontSize: 12,
    color: GlobalColors.inActivetabBarColor,
  },
  unreadBadge: {
    backgroundColor: GlobalColors.thirdColor,
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
    color: GlobalColors.inActivetabBarColor,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default React.memo(ChatItem);

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Firebase Realtime Database
import Avatar from "../Profile/Avatar";
import {
  getUnreadCount,
  resetUnreadCount,
} from "../../util/chat-list-data-http"; // Import updateChatList
import { GlobalColors } from "../../constants/GlobalColors";
import useRealtimeUser from "../../hooks/useRealtimeUser";
import { formatDistanceToNowStrict, parseISO } from "date-fns"; // Import date-fns

const ChatItem = ({ user, currentUserId, onPress, style }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState(user?.username);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [lastMsg, setLastMsg] = useState(null); // Initially null
  const [lastMsgTime, setLastMsgTime] = useState(null); // Initially null
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

  // Listen for real-time updates to `lastMsg` and `lastMsgTime` in Firebase
  useEffect(() => {
    const db = getDatabase();
    const chatRef = ref(db, `/chatlist/${currentUserId}/${userId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        setLastMsg(chatData.lastMsg || null); // If no message, set to null
        setLastMsgTime(chatData.lastMsgTime || null); // If no time, set to null
        setUnreadCount(chatData.unreadCount || 0);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUserId, userId]);

  // Memoize the onPress handler to avoid unnecessary re-renders
  const handlePress = useCallback(() => {
    resetUnreadCount(currentUserId, userId); // Reset unread count when chat item is pressed
    onPress(); // Call the onPress function passed as a prop
  }, [onPress, resetUnreadCount]);

  // Format `lastMsgTime` using date-fns
  const formattedLastMsgTime = lastMsgTime
    ? formatDistanceToNowStrict(parseISO(lastMsgTime)) // Format time if available
    : "just now"; // If no time, display "just now"

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
        <Text
          style={[
            styles.lastMessage,
            unreadCount > 0 && styles.boldLastMessage, // Apply bold style if unreadCount > 0
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lastMsg || "No message yet"}{" "}
          {/* If no message, display "No message yet" */}
        </Text>
      </View>

      <View style={styles.infoColumn}>
        <View style={styles.timeUnreadContainer}>
          <Text style={styles.time}>{formattedLastMsgTime}</Text>
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
  boldLastMessage: {
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.5,
  },
});

export default React.memo(ChatItem);

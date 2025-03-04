import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import Avatar from "../Profile/Avatar";
import { getUser } from "../../util/user-info-http";

const MessageItem = ({ message, currentUserId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const isCurrentUser = message.from === currentUserId;

  useEffect(() => {
    if (!isCurrentUser) {
      const fetchUser = async () => {
        try {
          const user = await getUser(message.from);
          setUserInfo(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUser();
    } else {
      setUserInfo(null);
    }
  }, [message.from, isCurrentUser]);

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUser : styles.otherUser,
      ]}
    >
      {!isCurrentUser && userInfo?.photoUrl && (
        <View style={styles.avatarContainer}>
          <Avatar photoUrl={userInfo.photoUrl} size={36} />
        </View>
      )}
      <View
        style={[
          styles.bubbleContainer,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        {!isCurrentUser && userInfo?.username && (
          <Text style={styles.username}>{userInfo.username}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.message}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
          ]}
        >
          {new Date(message.sendTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
  },
  currentUser: {
    justifyContent: "flex-end",
  },
  otherUser: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  bubbleContainer: {
    maxWidth: "75%",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 2,
  },
  currentUserBubble: {
    backgroundColor: GlobalColors.primaryColor,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: GlobalColors.primaryWhite,
    borderBottomLeftRadius: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  currentUserText: {
    color: GlobalColors.pureWhite,
  },
  otherUserText: {
    color: "#000000",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  currentUserTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTime: {
    color: "#8E8E8E",
  },
});

export default MessageItem;

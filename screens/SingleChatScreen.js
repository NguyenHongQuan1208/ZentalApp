import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import HeaderTitle from "../components/Chat/HeaderTitle";
import { sendMessage } from "../util/message-data-http";
import {
  updateChatList,
  incrementUnreadCount,
  updateUserActiveStatus,
  getChatListData,
} from "../util/chat-list-data-http";
import useRealtimeChat from "../hooks/useRealtimeChat";
import MessageItem from "../components/Chat/MessageItem";
import ChatInput from "../components/Chat/ChatInput";
import { useFocusEffect } from "@react-navigation/native";

const SingleChatScreen = ({ route, navigation }) => {
  const { currentUserId, otherUserId, roomId } = route.params;
  const [msgInput, setMsgInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [allChat, setAllChat] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = React.useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(otherUserId);
        navigation.setOptions({
          headerTitle: () => (
            <HeaderTitle
              photoUrl={userData.photoUrl}
              username={userData.username}
            />
          ),
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: GlobalColors.primaryColor,
          },
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();

    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [otherUserId, navigation]);

  useRealtimeChat(roomId, setAllChat);

  useEffect(() => {
    if (allChat.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [allChat]);

  const msgValid = (txt) => txt && txt.trim().length > 0;

  const sendMsg = useCallback(async () => {
    if (!msgValid(msgInput)) {
      Alert.alert("Input Error", "Please enter a valid message.");
      return;
    }

    setDisabled(true);

    const msgData = {
      from: currentUserId,
      to: otherUserId,
      message: msgInput,
      sendTime: new Date().toISOString(),
      msgType: "text",
    };

    const chatListUpdate = {
      lastMsg: msgInput,
      lastMsgTime: msgData.sendTime,
    };

    try {
      // Send the message
      const messageResponse = await sendMessage(roomId, msgData);
      if (!messageResponse) {
        throw new Error("Failed to send message.");
      }

      // Fetch the chat list data to check the other user's active status
      const chatListData = await getChatListData(otherUserId, currentUserId);

      // Update the chat list for the other user
      await updateChatList(otherUserId, currentUserId, chatListUpdate);

      // Increment unread count only if the other user is not active
      if (chatListData && !chatListData.userActive) {
        await incrementUnreadCount(currentUserId, otherUserId);
      }

      // Clear the message input
      setMsgInput("");
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to send message. Please try again."
      );
      console.error("Send message error:", error);
    } finally {
      setDisabled(false);
    }
  }, [msgInput, currentUserId, otherUserId, roomId]);

  const renderMessageItem = ({ item }) => (
    <MessageItem message={item} currentUserId={currentUserId} />
  );

  useFocusEffect(
    useCallback(() => {
      updateUserActiveStatus(currentUserId, otherUserId, true);

      return () => {
        // Set the user as inactive when the screen is unfocused
        updateUserActiveStatus(currentUserId, otherUserId, false);
      };
    }, [currentUserId, otherUserId])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ImageBackground
        source={require("../assets/Background.jpg")}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
          data={allChat}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: keyboardHeight + 60 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
        <ChatInput
          msgInput={msgInput}
          setMsgInput={setMsgInput}
          sendMsg={sendMsg}
          disabled={disabled}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
});

export default SingleChatScreen;

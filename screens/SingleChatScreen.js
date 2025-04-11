import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  Alert,
  Keyboard,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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

const SingleChatScreen = ({ route, navigation }) => {
  // Destructure route params
  const { currentUserId, otherUserId, roomId } = route.params;

  // State
  const [msgInput, setMsgInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [allChat, setAllChat] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Refs
  const flatListRef = useRef();

  // Fetch user data and set up header
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const userData = await getUser(otherUserId);
        navigation.setOptions({
          headerTitle: () => (
            <HeaderTitle
              photoUrl={userData.photoUrl}
              username={userData.username}
              onPress={() => navigation.navigate("ChatProfile", { otherUserId })}
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

    fetchAndSetUserData();
  }, [otherUserId, navigation]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Real-time chat updates
  useRealtimeChat(roomId, setAllChat);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (allChat.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [allChat]);

  // Message validation helper
  const isMessageValid = useCallback((text) => text?.trim().length > 0, []);

  // Send message handler
  const sendMsg = useCallback(async () => {
    if (!isMessageValid(msgInput)) {
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
      const [messageResponse, chatListData] = await Promise.all([
        sendMessage(roomId, msgData),
        getChatListData(otherUserId, currentUserId),
      ]);

      if (!messageResponse) throw new Error("Failed to send message.");

      await Promise.all([
        updateChatList(otherUserId, currentUserId, chatListUpdate),
        chatListData && !chatListData.userActive
          ? incrementUnreadCount(currentUserId, otherUserId)
          : Promise.resolve(),
      ]);

      setMsgInput("");
    } catch (error) {
      console.error("Send message error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to send message. Please try again."
      );
    } finally {
      setDisabled(false);
    }
  }, [msgInput, currentUserId, otherUserId, roomId, isMessageValid]);

  // Render individual message item
  const renderMessageItem = useCallback(
    ({ item }) => <MessageItem message={item} currentUserId={currentUserId} />,
    [currentUserId]
  );

  // Update user active status when screen is focused/unfocused
  useFocusEffect(
    useCallback(() => {
      updateUserActiveStatus(currentUserId, otherUserId, true);
      return () => updateUserActiveStatus(currentUserId, otherUserId, false);
    }, [currentUserId, otherUserId])
  );

  return (
    <View style={styles.container}>
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
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />
        <ChatInput
          msgInput={msgInput}
          setMsgInput={setMsgInput}
          sendMsg={sendMsg}
          disabled={disabled}
        />
      </ImageBackground>
    </View>
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

export default React.memo(SingleChatScreen);
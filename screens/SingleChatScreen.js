import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitle from "../components/Chat/HeaderTitle";
import { sendMessage } from "../util/message-data-http";
import { updateChatList } from "../util/chat-list-data-http"; // Import hàm updateChatList

const SingleChatScreen = ({ route, navigation }) => {
  const { currentUserId, otherUserId, roomId } = route.params;
  const [msgInput, setMsgInput] = useState("");
  const [disabled, setdisabled] = useState(false);

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
  }, [otherUserId, navigation]);

  const msgvalid = (txt) => txt && txt.replace(/\s/g, "").length;

  const sendMsg = async () => {
    if (msgInput === "" || !msgvalid(msgInput)) {
      Alert.alert("Input Error", "Please enter a valid message.");
      return;
    }

    setdisabled(true);

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
      // Gửi tin nhắn
      const messageResponse = await sendMessage(roomId, msgData);

      // Kiểm tra phản hồi từ API
      if (!messageResponse) {
        throw new Error(
          "Failed to send message: " +
            (messageResponse?.error || "Unknown error")
        );
      }

      await updateChatList(otherUserId, currentUserId, chatListUpdate);

      // Xóa nội dung tin nhắn trong input
      setMsgInput("");
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to send message. Please try again."
      );
      console.error("Send message error:", error);
    } finally {
      setdisabled(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Background.jpg")}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          placeholderTextColor={GlobalColors.primaryBlack}
          value={msgInput}
          onChangeText={setMsgInput}
        />
        <TouchableOpacity onPress={sendMsg} disabled={disabled}>
          <Ionicons
            name="paper-plane"
            size={24}
            color={GlobalColors.primaryBlack}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: GlobalColors.white,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: GlobalColors.primaryBlack,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default SingleChatScreen;

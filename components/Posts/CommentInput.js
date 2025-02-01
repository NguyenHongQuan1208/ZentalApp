import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";

const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;

const CommentInput = ({ newComment, setNewComment, handleAddComment }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const paddingBottomAnim = useRef(
    new Animated.Value(aspectRatio <= 1.78 ? 16 : 32)
  ).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Tạo hiệu ứng chuyển đổi mượt khi bàn phím hiển thị
        Animated.timing(paddingBottomAnim, {
          toValue: 6, // Giá trị paddingBottom khi bàn phím hiển thị
          duration: 200, // Thời gian chuyển đổi (200ms)
          useNativeDriver: false, // Vì paddingBottom không hỗ trợ native driver
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        // Tạo hiệu ứng chuyển đổi mượt khi bàn phím ẩn
        Animated.timing(paddingBottomAnim, {
          toValue: aspectRatio <= 1.78 ? 16 : 32, // Giá trị paddingBottom khi bàn phím ẩn
          duration: 100, // Thời gian chuyển đổi (100ms)
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [paddingBottomAnim]);

  const handleSend = () => {
    if (newComment.trim()) {
      handleAddComment(); // Gọi hàm xử lý logic gửi bình luận
      Keyboard.dismiss(); // Ẩn bàn phím
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.keyboardAvoidingView}
    >
      <Animated.View
        style={[
          styles.inputContainer,
          {
            paddingBottom: paddingBottomAnim, // Sử dụng Animated.Value cho paddingBottom
          },
        ]}
      >
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={1000}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.pressedButton,
            !newComment.trim() && styles.disabledButton,
          ]}
          onPress={handleSend} // Gọi hàm handleSend
          disabled={!newComment.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={
              newComment.trim()
                ? GlobalColors.primaryColor
                : GlobalColors.inActivetabBarColor
            }
          />
        </Pressable>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlobalColors.pureWhite,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  pressedButton: {
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: GlobalColors.lightGray,
    backgroundColor: GlobalColors.pureWhite,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: GlobalColors.lightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    backgroundColor: GlobalColors.pureWhite,
    fontSize: 15,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: GlobalColors.pureWhite,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

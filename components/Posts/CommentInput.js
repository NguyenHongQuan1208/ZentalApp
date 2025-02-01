import React, { useEffect, useState, useRef } from "react";
import {
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

const CommentInput = ({
  newComment,
  setNewComment,
  handleAddComment,
  autoFocus = false,
  onBlur, // Thêm prop onBlur
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef(null);
  const paddingBottomAnim = useRef(
    new Animated.Value(aspectRatio <= 1.78 ? 16 : 32)
  ).current;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.timing(paddingBottomAnim, {
          toValue: 6,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        Animated.timing(paddingBottomAnim, {
          toValue: aspectRatio <= 1.78 ? 16 : 32,
          duration: 100,
          useNativeDriver: false,
        }).start();
        // Gọi onBlur khi keyboard ẩn
        if (onBlur) {
          onBlur();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [paddingBottomAnim, onBlur]);

  const handleSend = () => {
    if (newComment.trim()) {
      handleAddComment();
      Keyboard.dismiss();
    }
  };

  const handleInputBlur = () => {
    // Gọi onBlur khi input bị blur
    if (onBlur) {
      onBlur();
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
            paddingBottom: paddingBottomAnim,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={1000}
          onBlur={handleInputBlur} // Thêm onBlur handler
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.pressedButton,
            !newComment.trim() && styles.disabledButton,
          ]}
          onPress={handleSend}
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

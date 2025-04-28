import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;

const ChatInput = ({ msgInput, setMsgInput, sendMsg, disabled, onBlur }) => {
  const { t } = useTranslation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef(null);
  const paddingBottomAnim = useRef(
    new Animated.Value(aspectRatio >= 1.78 ? 32 : 16)
  ).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.timing(paddingBottomAnim, {
          toValue: 16,
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
          toValue: aspectRatio >= 1.78 ? 32 : 16,
          duration: 200,
          useNativeDriver: false,
        }).start();
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
    if (msgInput.trim() && !disabled) {
      sendMsg();
      Keyboard.dismiss();
    }
  };

  const handleInputBlur = () => {
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
          style={styles.textInput}
          placeholder={t("Type a message") + `...`}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          value={msgInput}
          onChangeText={setMsgInput}
          multiline
          maxHeight={100}
          onBlur={handleInputBlur}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !msgInput.trim()}
          style={[
            styles.sendButton,
            (disabled || !msgInput.trim()) && styles.disabledButton,
            msgInput.trim() && !disabled && styles.activeSendButton,
          ]}
        >
          <Ionicons
            name="paper-plane"
            size={20}
            color={
              msgInput.trim() && !disabled
                ? "#FFFFFF"
                : GlobalColors.inActivetabBarColor
            }
          />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlobalColors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: GlobalColors.white,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1.2,
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 12,
    fontSize: 15,
    backgroundColor: "#F8F9FA",
    color: "#1A1A1A",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeSendButton: {
    backgroundColor: GlobalColors.primaryBlack,
    transform: [{ scale: 1 }],
  },
  disabledButton: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});

export default ChatInput;

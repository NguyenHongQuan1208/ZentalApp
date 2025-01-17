import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import Target from "../components/TaskSection/Target";
import { GlobalColors } from "../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng icon từ Expo

function ConfirmPostScreen({ route }) {
  const icon = route.params.icon;
  const color = route.params.color;
  const target = route.params.target;

  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const emotions = [
    { label: "Tons!", icon: "happy" },
    { label: "A Lot", icon: "happy-outline" },
    { label: "So so", icon: "sad-outline" },
    { label: "Nah", icon: "sad" },
  ];

  function handleSelectEmotion(index) {
    setSelectedEmotion(index);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Target icon={icon} target={target} color={color} size={13} />
        <Text style={[styles.textTitle, { color: color }]}>You decide How</Text>
      </View>

      <View style={styles.emotionSection}>
        <Text style={styles.question}>How much did you enjoy this?</Text>
        <View style={styles.buttonsContainer}>
          {emotions.map((emotion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emotionButton}
              onPress={() => handleSelectEmotion(index)}
            >
              <Ionicons
                name={emotion.icon}
                size={45} // Phóng to icon
                color={
                  selectedEmotion === index
                    ? GlobalColors.primaryColor // Màu chính khi được chọn
                    : GlobalColors.inActivetabBarColor // Màu xám ban đầu
                }
              />
              <Text
                style={[
                  styles.emotionLabel,
                  selectedEmotion === index && {
                    color: GlobalColors.primaryColor, // Đổi màu text khi được chọn
                  },
                ]}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

export default ConfirmPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: GlobalColors.primaryWhite,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  textTitle: {
    fontSize: 18,
  },
  emotionSection: {
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  emotionButton: {
    alignItems: "center",
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "transparent", // Bỏ viền
  },
  emotionLabel: {
    marginTop: 5,
    fontSize: 16,
    color: GlobalColors.primaryBlack, // Màu xám ban đầu
  },
});

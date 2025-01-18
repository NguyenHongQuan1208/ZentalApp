import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useState } from "react";
import Target from "../components/TaskSection/Target";
import { GlobalColors } from "../constants/GlobalColors";
import CustomSwitch from "../components/ui/CustomSwitch";
import EmotionButton from "../components/TaskSection/EmotionButton";
import LongButton from "../components/ui/LongButton";

function ConfirmPostScreen({ route }) {
  const sectionId = route.params.sectionId;
  const uid = route.params.uid;
  const icon = route.params.icon;
  const color = route.params.color;
  const target = route.params.target;

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isCommunityVisible, setIsCommunityVisible] = useState(false); // Trạng thái của nút gạt

  const emotions = [
    { label: "Tons!", icon: "happy" },
    { label: "A Lot", icon: "happy-outline" },
    { label: "So so", icon: "sad-outline" },
    { label: "Nah", icon: "sad" },
  ];

  function handleSelectEmotion(index) {
    setSelectedEmotion(index);
  }

  function handleToggleCommunityVisibility() {
    setIsCommunityVisible((prevState) => !prevState); // Đổi trạng thái khi gạt nút
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Target icon={icon} target={target} color={color} size={13} />
          <Text style={[styles.textTitle, { color: color }]}>
            You decide How
          </Text>
        </View>

        <View style={styles.emotionSection}>
          <Text style={styles.question}>How much did you enjoy this?</Text>
          <View style={styles.buttonsContainer}>
            {emotions.map((emotion, index) => (
              <EmotionButton
                key={index}
                emotion={emotion}
                isSelected={selectedEmotion === index}
                onSelect={() => handleSelectEmotion(index)}
              />
            ))}
          </View>
        </View>

        {/* Public Switch */}
        <View style={styles.communitySection}>
          <Text style={styles.communityText}>
            Zental Community can see this post
          </Text>
          <CustomSwitch
            isOn={isCommunityVisible} // Trạng thái hiện tại của nút gạt
            onToggle={handleToggleCommunityVisibility} // Hàm xử lý khi đổi trạng thái
          />
        </View>
      </ScrollView>

      {/* Nút LongButton */}
      <View style={styles.footer}>
        <LongButton style={styles.longButton}>POST IT!</LongButton>
      </View>
    </View>
  );
}

export default ConfirmPostScreen;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
  },
  scrollContainer: {
    flexGrow: 1, // Đảm bảo nội dung có thể cuộn
    paddingBottom: 20, // Đảm bảo có khoảng cách dưới
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 15,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "500",
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
  communitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Tăng chiều cao phần nút gạt
    paddingHorizontal: 15,
    borderTopWidth: 1.5, // Tăng độ dày viền
    borderBottomWidth: 1.5,
    borderColor: GlobalColors.inActivetabBarColor, // Màu xám viền
    marginTop: 20, // Khoảng cách với phần trên
    width: "100%", // Chiều rộng tối đa
  },
  communityText: {
    fontSize: 18, // Phóng to tiêu đề
    fontWeight: "bold", // Tăng độ đậm
    color: GlobalColors.inActivetabBarColor,
    flexWrap: "wrap", // Cho phép tiêu đề xuống dòng
    width: "80%", // Giới hạn chiều rộng nếu cần
  },
  footer: {
    padding: 16,
    marginBottom: height < 700 ? 14 : 28, // Tùy chỉnh marginBottom cho các thiết bị khác nhau
    justifyContent: "flex-end", // Đẩy nút xuống cuối màn hình
  },
  longButton: {
    width: "100%",
    paddingVertical: 12,
  },
});

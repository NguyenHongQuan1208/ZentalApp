import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TaskBenefits({ benefits, color }) {
  return (
    <View>
      <Text style={[styles.contentText, styles.titleText]}>
        This activity can help you:
      </Text>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitContainer}>
          <Ionicons
            name="caret-forward-circle"
            size={14}
            color={color}
            style={styles.icon}
          />
          <Text style={styles.contentText}>{benefit}</Text>
        </View>
      ))}
    </View>
  );
}

export default TaskBenefits;

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  contentText: {
    fontSize: 14,
    color: "white",
  },
  benefitContainer: {
    flexDirection: "row", // Đặt icon và text trên cùng một hàng
    alignItems: "center", // Căn giữa theo chiều dọc
    marginBottom: 8, // Khoảng cách giữa các mục
  },
  icon: {
    marginRight: 8, // Khoảng cách giữa icon và text
  },
});

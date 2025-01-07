import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SectionGridTile({ title, color, onPress, icon }) {
  return (
    <View style={styles.gridItem}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: color }]}>
          <Ionicons name={icon} size={34} color="white" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
}
export default SectionGridTile;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    alignItems: "center", // Căn giữa theo chiều ngang toàn bộ mục
    margin: 10,
  },
  pressable: {
    alignItems: "center", // Căn giữa nội dung bên trong Pressable
  },
  buttonPressed: {
    opacity: 0.5,
  },
  iconWrapper: {
    width: 75,
    height: 75,
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
    borderRadius: 25, // Tùy chỉnh góc bo tròn nếu cần
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

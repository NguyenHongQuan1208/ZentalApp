import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";

function SectionGridTile({ title, color, onPress, icon, hasDraft }) {
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
          {hasDraft && (
            <View style={styles.draftIcon}>
              <Ionicons
                name="pencil"
                size={14}
                color={GlobalColors.thirdColor}
              />
            </View>
          )}
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
    alignItems: "center",
    margin: 10,
  },
  pressable: {
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  iconWrapper: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    position: "relative", // Để hỗ trợ định vị tuyệt đối cho draftIcon
  },
  draftIcon: {
    position: "absolute",
    bottom: -5, // Vị trí ở góc dưới bên trái
    right: -5,
    backgroundColor: GlobalColors.primaryWhite, // Nền tối hơn để dễ nhìn
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GlobalColors.thirdColor,
    padding: 2,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: GlobalColors.secondBlack,
  },
});

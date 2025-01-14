import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Target({ icon, color, target }) {
  return (
    <View style={styles.targetContainer}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.targetText, { color: color }]}>{target}</Text>
    </View>
  );
}
export default Target;

const styles = StyleSheet.create({
  // Renamed headerContainer to targetContainer
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  targetText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

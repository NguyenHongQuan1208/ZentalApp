import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Target({ icon, color, target, size }) {
  return (
    <View style={styles.targetContainer}>
      <Ionicons name={icon} size={size || 20} color={color} />
      <Text style={[styles.targetText, { color: color, fontSize: size || 20 }]}>
        {target}
      </Text>
    </View>
  );
}
export default Target;

const styles = StyleSheet.create({
  // Renamed headerContainer to targetContainer
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  targetText: {
    marginLeft: 5,
    fontWeight: "bold",
  },
});

import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TaskNoteScreen({ route }) {
  const sectionId = route.params.id;
  const color = route.params.color;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="bulb" size={16} color={color} />
        <Text style={[styles.text, { color: color }]}>You decide How</Text>
      </View>
    </View>
  );
}
export default TaskNoteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginLeft: 8,
  },
});

import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/GlobalColors";

function TaskDetailScreen({ route }) {
  const id = route.params.id;
  return (
    <View style={styles.rootContainer}>
      <View style={styles.boxContainer}>
        <View style={styles.header}>
          <Ionicons name="flask" size={24} color={GlobalColors.primaryColor} />
          <Text style={styles.headerText}>Benefits</Text>
        </View>
        <Text style={styles.contentText}>Sẽ có list benefits dưới sau</Text>
      </View>
    </View>
  );
}

export default TaskDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
    padding: 32,
    backgroundColor: GlobalColors.primaryBlack, // Thêm màu nền nếu cần
  },
  boxContainer: {
    width: "100%",
    padding: 16,
    borderWidth: 3,
    borderColor: GlobalColors.primaryColor,
    borderRadius: 8,
    backgroundColor: GlobalColors.secondBlack,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.primaryColor,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.primaryColor,
  },
  contentText: {
    fontSize: 14,
    color: "white",
  },
});

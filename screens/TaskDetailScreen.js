import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/GlobalColors";
import TaskBenefits from "../components/TaskSection/TaskBenefits";
import DecisionBox from "../components/TaskSection/Decision";

function TaskDetailScreen({ route }) {
  const id = route.params.id;
  const frameColor = route.params.color;
  const benefits = route.params.benefits;

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.boxContainer, { borderColor: frameColor }]}>
        <View style={[styles.header, { borderBottomColor: frameColor }]}>
          <Ionicons name="flask" size={24} color={frameColor} />
          <Text style={[styles.headerText, { color: frameColor }]}>
            Benefits
          </Text>
        </View>
        <TaskBenefits benefits={benefits} color={frameColor} />
        <DecisionBox color={frameColor} id={id} />
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
    backgroundColor: GlobalColors.primaryGrey, // Thêm màu nền nếu cần
  },
  boxContainer: {
    width: "100%",
    padding: 16,
    borderWidth: 3,
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
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
});

import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/GlobalColors";
import TaskBenefits from "../components/TaskSection/TaskBenefits";
import DecisionBox from "../components/TaskSection/DecisionBox";
import Target from "../components/TaskSection/Target";

function TaskDetailScreen({ route }) {
  const id = route.params.id;
  const color = route.params.color;
  const icon = route.params.icon;
  const benefits = route.params.benefits;
  const description = route.params.description;
  const target = route.params.target;
  const placeholderQuestion = route.params.placeholderQuestion;
  return (
    <View style={styles.rootContainer}>
      <Target icon={icon} color={color} target={target} />

      <View style={[styles.boxContainer, { borderColor: color }]}>
        <View style={[styles.header, { borderBottomColor: color }]}>
          <Ionicons name="flask" size={24} color={color} />
          <Text style={[styles.headerText, { color: color }]}>Benefits</Text>
        </View>
        <TaskBenefits benefits={benefits} color={color} />
        <DecisionBox
          id={id}
          color={color}
          icon={icon}
          target={target}
          description={description}
          placeholderQuestion={placeholderQuestion}
        />
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
    backgroundColor: GlobalColors.primaryGrey,
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

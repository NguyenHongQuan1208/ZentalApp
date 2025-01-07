import { Text } from "react-native";

function TaskNoteScreen({ route }) {
  const sectionId = route.params.id;
  console.log(sectionId);
  return <Text style={{ color: "white" }}>TaskNote Screen</Text>;
}
export default TaskNoteScreen;

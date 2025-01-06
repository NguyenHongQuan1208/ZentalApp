import { FlatList } from "react-native";
import { TASK_SECTIONS } from "../data/dummy-data";
function TaskScreen() {
  function renderSectionItem(sectionData) {}

  return (
    <FlatList
      data={TASK_SECTIONS}
      keyExtractor={(section) => section.id}
      renderItem={renderSectionItem}
      numColumns={3}
    />
  );
}

export default TaskScreen;

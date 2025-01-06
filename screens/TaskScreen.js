import { FlatList, StyleSheet, View } from "react-native";
import { TASK_SECTIONS } from "../data/dummy-data";
import SectionGridTile from "../components/TaskSection/SectionGridTile";
import { GlobalColors } from "../constants/GlobalColors";
function TaskScreen({ navigation }) {
  function renderSectionItem(sectionData) {
    function pressHandler() {
      navigation.navigate("TaskDetail", {
        id: sectionData.item.id,
      });
    }
    return (
      <SectionGridTile
        title={sectionData.item.title}
        color={sectionData.item.color}
        icon={sectionData.item.icon}
        onPress={pressHandler}
      />
    );
  }
  // console.log(TASK_SECTIONS);
  return (
    <View style={styles.container}>
      <FlatList
        data={TASK_SECTIONS}
        keyExtractor={(section) => section.id}
        renderItem={renderSectionItem}
        numColumns={3}
      />
    </View>
  );
}

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryBlack,
  },
});

import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/GlobalColors";
import TaskBenefits from "../components/TaskSection/TaskBenefits";
import DecisionBox from "../components/TaskSection/DecisionBox";
import Target from "../components/TaskSection/Target";
import { WebView } from "react-native-webview";

function TaskDetailScreen({ route }) {
  const id = route.params.id;
  const color = route.params.color;
  const icon = route.params.icon;
  const benefits = route.params.benefits;
  const description = route.params.description;
  const target = route.params.target;
  const placeholderQuestion = route.params.placeholderQuestion;

  const videoUrl =
    "https://www.youtube.com/embed/zThE1yg5MBE?autoplay=0&controls=1&showinfo=0";

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

      <View
        style={[
          styles.videoContainer,
          { borderColor: GlobalColors.primaryColor },
        ]}
      >
        <View
          style={[
            styles.header,
            { borderBottomColor: GlobalColors.primaryColor },
          ]}
        >
          <Ionicons
            name="logo-youtube"
            size={24}
            color={GlobalColors.primaryColor}
          />
          <Text
            style={[styles.headerText, { color: GlobalColors.primaryColor }]}
          >
            Intruction Video
          </Text>
        </View>
        <WebView
          source={{ uri: videoUrl }}
          style={styles.video}
          allowsInlineMediaPlayback
          javaScriptEnabled
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
    padding: 24, // Giảm padding xuống cho không gian thoáng hơn
    backgroundColor: GlobalColors.primaryGrey,
  },

  boxContainer: {
    width: "100%",
    marginTop: 16, // Thêm margin-top để tạo khoảng cách với Target
    padding: 20,
    borderWidth: 2, // Giảm độ dày của border
    borderRadius: 12, // Tăng border radius để bo tròn hơn
    backgroundColor: GlobalColors.secondBlack,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 }, // Tăng độ offset của shadow
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },

  headerText: {
    marginLeft: 12,
    fontSize: 18, // Giảm font size một chút
    fontWeight: "600", // Sử dụng 600 thay vì bold để mềm mại hơn
    letterSpacing: 0.5, // Thêm letter spacing để text đẹp hơn
  },

  videoContainer: {
    width: "100%",
    height: 300,
    marginTop: 48,
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: GlobalColors.secondBlack,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden", // Thêm overflow hidden để video không tràn ra ngoài border radius
  },

  video: {
    flex: 1,
    borderRadius: 8, // Bo tròn cho video
    marginTop: 8, // Thêm margin top để tạo khoảng cách với header
  },
});

import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
    <ImageBackground
      source={require("../assets/nature.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.5)"]}
        style={styles.gradient}
      >
        <View style={styles.rootContainer}>
          <Target icon={icon} color={color} target={target} />

          <View style={[styles.boxContainer, { borderColor: color }]}>
            <View style={[styles.header, { borderBottomColor: color }]}>
              <Ionicons name="flask" size={24} color={color} />
              <Text style={[styles.headerText, { color: color }]}>
                Benefits
              </Text>
            </View>
            <TaskBenefits benefits={benefits} color={color} />

            <View
              style={[
                styles.header,
                { borderBottomColor: color, marginTop: 24 },
              ]}
            >
              <Ionicons name="logo-youtube" size={24} color={color} />
              <Text style={[styles.headerText, { color: color }]}>
                Instruction Video
              </Text>
            </View>
            <View style={styles.videoContainer}>
              <WebView
                source={{ uri: videoUrl }}
                style={styles.video}
                allowsInlineMediaPlayback
                javaScriptEnabled
              />
            </View>
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
      </LinearGradient>
    </ImageBackground>
  );
}

export default TaskDetailScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  boxContainer: {
    width: "100%",
    marginTop: 16,
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: GlobalColors.pureWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    fontSize: 20, // Tăng kích thước font
    fontWeight: "700", // Đậm hơn
    letterSpacing: 0.5,
  },
  videoContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderRadius: 12,
  },
  video: {
    flex: 1,
    borderRadius: 12, // Bo tròn cho video
  },
});

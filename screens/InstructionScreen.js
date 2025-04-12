import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../constants/GlobalColors";
import TaskBenefits from "../components/TaskSection/TaskBenefits";
import LongButton from "../components/ui/LongButton";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;

function InstructionScreen({ route }) {
  const { icon, name, color, slogan, instructions, benefits } = route.params;
  const navigation = useNavigation();

  const handleStartPress = () => {
    switch (name) {
      case "Uplift":
        navigation.navigate("Uplift");
        break;
      case "Monster Mind Cleanse":
        navigation.navigate("MonsterRainScreen");
        break;
      case "Breather":
        navigation.navigate("Breather");
        break;
      case "Serenity Scene":
        navigation.navigate("SerenityScene");
        break;
      default:
        console.warn("No matching screen found for:", name);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={[styles.slogan, { color: color }]}>{slogan}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.instructionsTitleContainer}>
          <View style={[styles.iconContainer, { borderColor: color }]}>
            <Ionicons name="bulb" size={24} color={color} />
          </View>
          <Text style={styles.instructionsTitle}>Instructions</Text>
        </View>
        <Text style={styles.instructions}>{instructions}</Text>
        <TaskBenefits benefits={benefits} color={color} />
      </View>

      <View style={styles.footer}>
        <LongButton
          style={[styles.longButton, { backgroundColor: color }]}
          onPress={handleStartPress}
        >
          START NOW
        </LongButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    width: "100%",
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  instructionsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  slogan: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    textAlign: "center",
  },
  instructions: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: "left",
    marginBottom: 20,
    color: GlobalColors.inActivetabBarColor,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  benefitItem: {
    fontSize: 16,
    textAlign: "left",
  },
  footer: {
    padding: 16,
    paddingBottom: aspectRatio <= 1.78 ? 16 : 40,
    justifyContent: "flex-end",
  },
  longButton: {
    width: "100%",
    paddingVertical: 12,
  },
});

export default InstructionScreen;

import { View, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
function DescribeBox({ color, description }) {
  return (
    <View style={[styles.descriptionBox, { borderColor: color }]}>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

export default DescribeBox;

const styles = StyleSheet.create({
  descriptionBox: {
    backgroundColor: GlobalColors.primaryGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  description: {
    fontSize: 14,
    color: GlobalColors.secondBlack,
    textAlign: "left",
  },
});

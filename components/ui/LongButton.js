import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

function LongButton({ children, onPress, style }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default LongButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "90%",
    backgroundColor: GlobalColors.primaryColor,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

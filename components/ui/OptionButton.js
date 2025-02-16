import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { GlobalColors } from "../../constants/GlobalColors";

const OptionButton = ({ title, onSelect }) => {
  // Xác định style dựa trên title
  const getButtonStyle = () => {
    switch (title) {
      case "Cancel":
        return {
          color: GlobalColors.primaryColor,
          fontWeight: "bold",
        };
      case "Delete Post":
        return {
          color: "red",
          fontWeight: "bold",
        };
      default:
        return {
          color: GlobalColors.primaryBlack,
          fontWeight: "normal",
        };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <Pressable style={styles.buttonContainer} onPress={() => onSelect(title)}>
      <Text
        style={[
          styles.buttonText,
          {
            color: buttonStyle.color,
            fontWeight: buttonStyle.fontWeight,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

OptionButton.propTypes = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "90%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default OptionButton;

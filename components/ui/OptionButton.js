import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const OptionButton = ({ title, onSelect }) => {
  return (
    <Pressable style={styles.buttonContainer} onPress={() => onSelect(title)}>
      <Text style={styles.buttonText}>{title}</Text>
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

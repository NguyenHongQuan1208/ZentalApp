import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";
import { useTranslation } from "react-i18next";

const SearchInput = ({ value, onChangeText, onClear }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={t("Search") + `...`}
        value={value}
        onChangeText={onChangeText}
        autoFocus
        selectionColor={GlobalColors.primaryColor}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons
            name="close"
            size={20}
            color={GlobalColors.primaryColor}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: GlobalColors.primaryColor,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: GlobalColors.pureWhite,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  closeIcon: {
    marginLeft: 10,
  },
});

export default SearchInput;

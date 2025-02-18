import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../constants/GlobalColors";

function SearchScreen({ navigation, route }) {
  const [searchValue, setSearchValue] = useState("");
  const [inputAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));
  const showInput = route.params?.showInput;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Animated.View
          style={{
            width: inputAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 320], // Width of the input field
            }),
            opacity: fadeAnimation,
          }}
        >
          {showInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search..."
                value={searchValue}
                onChangeText={setSearchValue}
                autoFocus
                selectionColor={GlobalColors.primaryColor} // Change the caret color here
              />
              {searchValue.length > 0 && ( // Show the close icon only when there is text
                <TouchableOpacity onPress={() => setSearchValue("")}>
                  <Ionicons
                    name="close"
                    size={20}
                    color={GlobalColors.primaryColor}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      ),
    });

    if (showInput) {
      Animated.parallel([
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: 500, // Increased duration for input animation
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 500, // Increased duration for fade animation
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
    }
  }, [navigation, showInput, searchValue]);

  return (
    <View style={styles.container}>
      {/* Other content of the screen if needed */}
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalColors.primaryWhite,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: GlobalColors.primaryColor,
    borderWidth: 1,
    borderRadius: 15, // More rounded corners
    backgroundColor: GlobalColors.pureWhite,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    borderRadius: 15, // Match the container's border radius
  },
  closeIcon: {
    marginLeft: 10, // Space between input and icon
  },
});

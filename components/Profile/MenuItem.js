import React, { useContext, useRef } from "react";
import { Text, Pressable, StyleSheet, Alert, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/auth-context";

function MenuItem({ icon, screenName, screen, userId }) {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(1)).current;
  const authCtx = useContext(AuthContext);

  function pressHandler() {
    if (screen === "logout") {
      // Show confirmation dialog for logout
      Alert.alert("Confirm", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => authCtx.logout(), // Call logout function from context
          style: "destructive",
        },
      ]);
    } else {
      // Perform fade effect
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // After the animation completes, navigate to the specified screen
        if (screen === "PersonalProfile" && userId) {
          navigation.navigate(screen, { userId }); // Pass userId if navigating to PersonalProfile
        } else {
          navigation.navigate(screen);
        }

        // Reset opacity
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }

  const isLogout = screen === "logout";

  return (
    <Pressable
      onPress={pressHandler}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Animated.View style={[styles.menuItem, { opacity }]}>
        <Ionicons
          name={icon}
          size={20}
          color={isLogout ? GlobalColors.errorRed : GlobalColors.primaryBlack}
        />
        <Text
          style={[
            styles.menuText,
            {
              color: isLogout
                ? GlobalColors.errorRed
                : GlobalColors.primaryBlack,
            },
          ]}
        >
          {screenName}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.primaryGrey,
    paddingHorizontal: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.5,
  },
});

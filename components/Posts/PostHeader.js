import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

function PostHeader({ user, timeAgo, noPressEffect }) {
  const navigation = useNavigation();
  const [isUsernamePressed, setIsUsernamePressed] = useState(false);

  const handleMoreOptions = () => {
    console.log("More options clicked!");
  };

  const handleAvatarPress = () => {
    if (!noPressEffect && user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
    }
  };

  const handleUsernamePress = () => {
    if (!noPressEffect && user?.uid) {
      navigation.navigate("PersonalProfile", { userId: user.uid });
    }
  };

  const handleUsernamePressIn = () => {
    if (!noPressEffect) {
      setIsUsernamePressed(true);
    }
  };

  const handleUsernamePressOut = () => {
    if (!noPressEffect) {
      setIsUsernamePressed(false);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.userContainer}>
        <Pressable
          onPress={handleAvatarPress}
          style={({ pressed }) => ({
            opacity: pressed && !noPressEffect ? 0.5 : 1,
          })}
        >
          <Avatar photoUrl={user?.photoUrl} size={40} />
        </Pressable>
        <View style={styles.userInfo}>
          <Pressable
            onPressIn={handleUsernamePressIn}
            onPressOut={handleUsernamePressOut}
            onPress={handleUsernamePress}
          >
            <Text
              style={[
                styles.username,
                {
                  textDecorationLine: isUsernamePressed ? "underline" : "none",
                },
              ]}
            >
              {user?.username || "Loading..."}
            </Text>
          </Pressable>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      <Pressable onPress={handleMoreOptions} style={styles.moreOptionsButton}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={GlobalColors.inActivetabBarColor}
        />
      </Pressable>
    </View>
  );
}

export default PostHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 12,
    color: GlobalColors.inActivetabBarColor,
    marginTop: 2,
  },
  moreOptionsButton: {
    marginTop: -16,
    padding: 8,
  },
});

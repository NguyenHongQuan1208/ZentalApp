import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Avatar from "../components/Profile/Avatar";
import { getUser } from "../util/user-info-http";
import { GlobalColors } from "../constants/GlobalColors";

const SingleChatScreen = ({ route, navigation }) => {
  const { currentUserId, otherUserId, roomId } = route.params;
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(otherUserId);
        setOtherUser(userData);

        navigation.setOptions({
          headerTitle: () => (
            <View style={styles.headerContainer}>
              {userData.photoUrl ? (
                <View style={styles.avatarWrapper}>
                  <Avatar
                    photoUrl={userData.photoUrl}
                    size={36}
                    key={userData.photoUrl}
                  />
                </View>
              ) : (
                <Image
                  source={require("../assets/default-avatar.png")}
                  style={styles.defaultImage}
                />
              )}
              <Text style={styles.headerTitle}>{userData.username}</Text>
            </View>
          ),
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: GlobalColors.primaryColor,
          },
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [otherUserId, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Single Chat</Text>
      <Text style={styles.info}>Current User ID: {currentUserId}</Text>
      <Text style={styles.info}>Other User ID: {otherUserId}</Text>
      <Text style={styles.info}>Room ID: {roomId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GlobalColors.primaryBlack,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  defaultImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
    flex: 1,
  },
});

export default SingleChatScreen;

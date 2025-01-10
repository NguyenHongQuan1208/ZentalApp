import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
import Avatar from "../components/Profile/Avatar";
import { GlobalColors } from "../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons";
import MenuItem from "../components/Profile/MenuItem";
import { getUser } from "../util/user-info-http";

function ProfileScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const [photoUrl, setPhotoUrl] = useState(null);
  const [userName, setUserName] = useState("User Name");

  async function fetchData() {
    try {
      const authResponse = await getUserData(token);
      const uid = authResponse.localId;

      const userData = await getUser(uid);
      setUserName(userData.username || "");
      setPhotoUrl(userData.photoUrl || "");
      // console.log(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function pressHandler() {
    navigation.navigate("EditProfile");
  }
  return (
    <View style={styles.container}>
      <Avatar photoUrl={photoUrl} size={100} />
      <Text style={styles.userName}>{userName}</Text>
      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          styles.editProfile,
          pressed && styles.editPressed,
        ]}
      >
        <Ionicons name="create" size={16} color={GlobalColors.thirdColor} />
        <Text style={styles.editText}>Edit profile</Text>
      </Pressable>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="person"
          screen="PersonalProfile"
          screenName="Personal Profile"
        />
        <MenuItem icon="home" screen="Home" screenName="Home" />
        <MenuItem icon="sunny" screen="Task" screenName="Task" />
        <MenuItem icon="paper-plane" screen="Posts" screenName="Posts" />
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  userName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  editProfile: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  editPressed: {
    opacity: 0.5,
  },
  editText: {
    marginLeft: 5,
    fontSize: 14,
    color: GlobalColors.thirdColor,
    fontWeight: "500",
  },
  menuContainer: {
    marginTop: 20,
    width: "90%",
    borderTopWidth: 1,
    borderTopColor: GlobalColors.primaryGrey,
  },
});

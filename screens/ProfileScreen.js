import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
import Avatar from "../components/Profile/Avatar";

function ProfileScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const [photoUrl, setPhotoUrl] = useState(null);

  async function fetchData() {
    try {
      const response = await getUserData(token);
      setPhotoUrl(response.photoUrl);
      // console.log(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Avatar photoUrl={photoUrl} size={100} />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({});

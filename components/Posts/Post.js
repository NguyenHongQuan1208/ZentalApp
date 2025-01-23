import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getUser } from "../../util/user-info-http";
import Avatar from "../Profile/Avatar";
import { GlobalColors } from "../../constants/GlobalColors";

function Post({ item }) {
  const [user, setUser] = useState(null);
  const userId = item.uid;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null); // Reset user state on error
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Avatar photoUrl={user?.photoUrl} size={40} />
        <Text style={styles.username}>
          {user ? user.username : "Loading..."}
        </Text>
      </View>
    </View>
  );
}

export default Post;

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: GlobalColors.pureWhite,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginLeft: 10,
    fontWeight: "bold",
  },
});

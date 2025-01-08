import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
import { storeUser } from "../util/user-info-http";
import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app/";

function EnterUserNameScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const authCtx = useContext(AuthContext);

  async function saveUserToDatabase() {
    const token = authCtx.token;
    const userData = await getUserData(token);

    const email = userData.email;
    const uid = userData.localId;
    console.log(userData);
    const userInfo = {
      email: email,
      username: username,
    };

    await axios.put(`${BACKEND_URL}/users/${uid}.json`, userInfo);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Save" onPress={saveUserToDatabase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: "white",
  },
});

export default EnterUserNameScreen;

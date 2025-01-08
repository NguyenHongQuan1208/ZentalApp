import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserData } from "../util/auth";
function HomeScreen({ route }) {
  // const name = route.params
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  async function getData() {
    const respone = await getUserData(token);
    console.log(respone);
  }
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Get" onPress={getData}></Button>
    </View>
  );
}

export default HomeScreen;

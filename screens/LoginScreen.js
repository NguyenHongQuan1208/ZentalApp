import AuthContent from "../components/Auth/AuthContent";
import { login } from "../util/auth";
import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert, Image, View, StyleSheet, Text } from "react-native";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  async function loginpHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        "Authentication Failed",
        "Could not log you in. Please check your credentials"
      );
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging In..." />;
  }
  return (
    <View>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/earth.png")} style={styles.image} />
        <Text style={styles.slogan}>Make the world better!</Text>
      </View>
      <AuthContent
        style={styles.authContent}
        isLogin
        onAuthenticate={loginpHandler}
      />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  slogan: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
  },
  image: {
    width: 110,
    height: 110,
  },
  authContent: {
    marginTop: 0,
  },
});

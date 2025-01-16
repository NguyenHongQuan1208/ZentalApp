import AuthContent from "../components/Auth/AuthContent";
import { login } from "../util/auth";
import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert, Image, View, StyleSheet, Text } from "react-native";
import { AuthContext } from "../store/auth-context";
import { GlobalColors } from "../constants/GlobalColors";
import { RefreshTokenContext } from "../store/RefreshTokenContext";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { idToken, refreshToken } = await login(email, password);
      // console.log({ idToken, refreshToken });
      authCtx.authenticate(idToken); // Sử dụng idToken cho việc xác thực
      refreshCtx.setRefreshToken(refreshToken);
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
        onAuthenticate={loginHandler}
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

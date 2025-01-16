import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { createUser } from "../util/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { RefreshTokenContext } from "../store/RefreshTokenContext";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  const refreshCtx = useContext(RefreshTokenContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { idToken, refreshToken } = await createUser(email, password);
      authCtx.authenticate(idToken);
      refreshCtx.setRefreshToken(refreshToken);
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not create user. Please check your input or try agian later"
      );
      setIsAuthenticating(false);
    }

    // navigation.navigate("Login");
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating User..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;

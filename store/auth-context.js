import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, getIdToken } from "firebase/auth"; // Assuming you're using Firebase

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();

  useEffect(() => {
    // Check for token when the app starts
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setAuthToken(storedToken);

        // Optionally: If the token is expired, refresh it
        const user = getAuth().currentUser;
        if (user) {
          try {
            // Get the current ID token, force refresh if expired
            const freshToken = await getIdToken(user, true);
            setAuthToken(freshToken);
            AsyncStorage.setItem("token", freshToken); // Store the refreshed token
          } catch (error) {
            console.error("Error refreshing token:", error);
            logout(); // Log out if token refresh fails
          }
        }
      }
    };

    loadToken();
  }, []);

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem("token", token);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("token");
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;

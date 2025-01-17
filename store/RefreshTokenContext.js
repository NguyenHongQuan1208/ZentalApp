import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo context cho refreshToken
export const RefreshTokenContext = createContext({
  refreshToken: "",
  setRefreshToken: (refreshToken) => {},
  clearRefreshToken: () => {},
});

function RefreshTokenContextProvider({ children }) {
  const [refreshToken, setRefreshToken] = useState(null);

  // Lấy refreshToken từ AsyncStorage khi ứng dụng khởi động
  useEffect(() => {
    const fetchStoredRefreshToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("refreshToken");
        if (storedToken) {
          setRefreshToken(storedToken);
        }
      } catch (error) {
        console.log("Error fetching refresh token:", error);
      }
    };
    fetchStoredRefreshToken();
  }, []);

  // Save refreshToken to AsyncStorage when it changes
  useEffect(() => {
    if (refreshToken) {
      AsyncStorage.setItem("refreshToken", refreshToken);
    }
  }, [refreshToken]);

  function setNewRefreshToken(newToken) {
    setRefreshToken(newToken);
    AsyncStorage.setItem("refreshToken", refreshToken);
  }

  function clearStoredRefreshToken() {
    setRefreshToken(null);
    AsyncStorage.removeItem("refreshToken");
  }

  const value = {
    refreshToken: refreshToken,
    setRefreshToken: setNewRefreshToken,
    clearRefreshToken: clearStoredRefreshToken,
  };

  return (
    <RefreshTokenContext.Provider value={value}>
      {children}
    </RefreshTokenContext.Provider>
  );
}

export default RefreshTokenContextProvider;

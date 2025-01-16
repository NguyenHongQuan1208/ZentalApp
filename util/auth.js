import axios from "axios";

const API_KEY = "AIzaSyB8PVnvThQNPDDggiK1qTXqncZtAq98Y1Y";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
    return {
      idToken: response.data.idToken, // ID token
      refreshToken: response.data.refreshToken, // Refresh token
    };
  } catch (error) {
    console.error(
      "Authentication failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export async function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

export async function getUserData(token) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      idToken: token,
    });
    return response.data.users[0]; // Trả về thông tin người dùng
  } catch (error) {
    console.error(
      "Fetching user data failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateProfile(
  token,
  displayName,
  photoUrl,
  deleteAttributes = [],
  returnSecureToken = true
) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
  const payload = {
    idToken: token,
    displayName,
    photoUrl,
    deleteAttribute: deleteAttributes,
    returnSecureToken,
  };

  try {
    const response = await axios.post(url, payload);
    return response.data; // Trả về thông tin đã cập nhật
  } catch (error) {
    console.error(
      "Profile update failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Hàm refresh token
export async function refreshTokenFn(refreshToken) {
  const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    return {
      idToken: response.data.id_token, // ID token mới
      refreshToken: response.data.refresh_token, // Refresh token mới
      expiresIn: response.data.expires_in, // Thời gian hết hạn của ID token
    };
  } catch (error) {
    console.error(
      "Token refresh failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

import axios from "axios";
import { getAuth, getIdToken } from "firebase/auth"; // Import thêm Firebase Authentication

const API_KEY = "AIzaSyB8PVnvThQNPDDggiK1qTXqncZtAq98Y1Y";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
    return response.data.idToken; // Trả về token
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
    // Làm mới token nếu cần
    const user = getAuth().currentUser;
    if (user) {
      // Nếu có user đăng nhập, làm mới token
      token = await getIdToken(user, true); // true để làm mới token
    }

    const response = await axios.post(url, {
      idToken: token,
    });
    return response.data.users[0]; // Trả về thông tin người dùng
  } catch (error) {
    if (
      error.response &&
      error.response.data.error.message === "INVALID_ID_TOKEN"
    ) {
      // Làm mới token nếu gặp lỗi INVALID_ID_TOKEN
      console.log("Invalid ID Token, refreshing token...");
      const user = getAuth().currentUser;
      if (user) {
        try {
          const freshToken = await getIdToken(user, true); // Làm mới token
          // Gọi lại API với token mới
          const response = await axios.post(url, {
            idToken: freshToken,
          });
          return response.data.users[0]; // Trả về thông tin người dùng
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          throw refreshError;
        }
      }
    }
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
    // Làm mới token nếu cần
    const user = getAuth().currentUser;
    if (user) {
      // Nếu có user đăng nhập, làm mới token
      token = await getIdToken(user, true); // true để làm mới token
    }

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

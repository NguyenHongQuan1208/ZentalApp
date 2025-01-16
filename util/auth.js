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

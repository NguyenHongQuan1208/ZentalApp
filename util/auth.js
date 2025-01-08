import axios from "axios";

const API_KEY = "AIzaSyB8PVnvThQNPDDggiK1qTXqncZtAq98Y1Y";

async function authenticate(mode, email, password) {
  //   Mode should be signIn and signUp
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const respone = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  // console.log(respone.data);
  const token = respone.data.idToken;
  return token;
}

export async function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

export async function getUserData(token) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  const respone = await axios.post(url, {
    idToken: token,
  });
  return respone.data.users[0];
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
    return response.data; // Contains updated user information
  } catch (error) {
    console.error(
      "Profile update failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

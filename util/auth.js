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
// export async function createUser(email, password) {
//   const respone = await axios.post(
//     "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
//     {
//       email: email,
//       password: password,
//       returnSecureToken: true,
//     }
//   );
// }

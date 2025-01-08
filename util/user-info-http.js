import axios from "axios";
const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app/";
export async function storeUser(userId, userInfo) {
  const respone = await axios.post(
    BACKEND_URL + `/userInfo/${userId}`,
    userData
  );
}

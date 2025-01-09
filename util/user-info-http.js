import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app/";

export async function storeUser(userId, userInfo) {
  try {
    // Gửi yêu cầu POST tới Firebase Realtime Database
    const response = await axios.post(
      `${BACKEND_URL}/userInfo/${userId}.json`,
      userInfo
    );

    // Trả về ID của dữ liệu đã lưu (nếu có)
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Could not store user data.");
  }
}

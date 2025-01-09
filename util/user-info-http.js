import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app/";

export async function storeUser(userId, userInfo) {
  try {
    // Gửi yêu cầu PUT tới Firebase Realtime Database, sử dụng userId làm ID
    const response = await axios.put(
      `${BACKEND_URL}/userInfo/${userId}.json`, // userId sẽ làm khóa chính trong database
      userInfo
    );

    // Trả về ID của dữ liệu đã lưu (trong trường hợp này là userId)
    return response.data; // Thường Firebase trả về `name`, nhưng với PUT, `name` chính là userId
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Could not store user data.");
  }
}

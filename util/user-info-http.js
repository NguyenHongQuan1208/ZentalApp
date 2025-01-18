import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

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

export async function updateUser(userId, updatedInfo) {
  try {
    // Gửi yêu cầu PATCH tới Firebase Realtime Database, sử dụng userId làm ID
    const response = await axios.patch(
      `${BACKEND_URL}/userInfo/${userId}.json`, // userId sẽ làm khóa chính trong database
      updatedInfo
    );

    // Trả về phản hồi từ Firebase
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error("Could not update user data.");
  }
}

export async function getUser(userId) {
  try {
    // Gửi yêu cầu GET tới Firebase Realtime Database để lấy thông tin người dùng
    const response = await axios.get(`${BACKEND_URL}/userInfo/${userId}.json`);

    // Kiểm tra nếu không có dữ liệu, sẽ trả về null
    if (!response.data) {
      throw new Error("User not found.");
    }

    // Trả về thông tin người dùng
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Could not fetch user data.");
  }
}

// Kiểm tra xem userId đã tồn tại trong Firebase Realtime Database chưa
export async function checkUserIdExists(uid) {
  try {
    // Gửi yêu cầu GET tới Firebase Realtime Database để kiểm tra sự tồn tại của uid
    const response = await axios.get(`${BACKEND_URL}/userInfo/${uid}.json`);

    // Kiểm tra nếu có dữ liệu trả về, có nghĩa là uid đã tồn tại
    if (response.data) {
      return true; // Người dùng đã tồn tại
    } else {
      return false; // Người dùng chưa tồn tại
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Could not check user existence.");
  }
}

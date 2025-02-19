import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Lưu thông tin chat list cho người dùng
export async function storeChatList(userId, chatInfo) {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/chatList/${userId}.json`, // userId sẽ làm khóa chính trong database
      chatInfo
    );
    return response.data; // Trả về phản hồi từ Firebase
  } catch (error) {
    console.error("Error storing chat list data:", error);
    throw new Error("Could not store chat list data.");
  }
}

// Lấy tất cả các cuộc trò chuyện của người dùng
export async function getAllChatLists(userId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/chatList/${userId}.json`);
    if (!response.data) {
      return []; // Không có cuộc trò chuyện nào
    }
    return Object.keys(response.data).map((key) => ({
      otherUserId: key,
      ...response.data[key],
    }));
  } catch (error) {
    console.error("Error fetching chat list data:", error);
    throw new Error("Could not fetch chat list data.");
  }
}

// Cập nhật thông tin cuộc trò chuyện cho người dùng
export async function updateChatList(userId, otherUserId, updatedInfo) {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/chatList/${userId}/${otherUserId}.json`, // Cập nhật thông tin cho cuộc trò chuyện với otherUserId
      updatedInfo
    );
    return response.data; // Trả về phản hồi từ Firebase
  } catch (error) {
    console.error("Error updating chat list data:", error);
    throw new Error("Could not update chat list data.");
  }
}

// Lấy thông tin cuộc trò chuyện của một người dùng cụ thể
export async function getChatList(userId, otherUserId) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatList/${userId}/${otherUserId}.json`
    );
    if (!response.data) {
      throw new Error("Chat not found.");
    }
    return response.data; // Trả về thông tin cuộc trò chuyện
  } catch (error) {
    console.error("Error fetching chat list data:", error);
    throw new Error("Could not fetch chat list data.");
  }
}

// Kiểm tra xem cuộc trò chuyện với otherUserId đã tồn tại trong chat list hay chưa
export async function checkChatExists(userId, otherUserId) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatList/${userId}/${otherUserId}.json`
    );
    return response.data ? true : false; // Trả về true nếu cuộc trò chuyện tồn tại, ngược lại là false
  } catch (error) {
    console.error("Error checking chat existence:", error);
    throw new Error("Could not check chat existence.");
  }
}

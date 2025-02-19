import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

export const createChatList = async (currentUserId, otherUserId) => {
  const roomId = generateRoomId(); // Generate a unique room ID

  const chatData = {
    lastMsg: "",
    lastMsgTime: "",
    unreadCount: 0,
    roomId: roomId,
  };

  try {
    await axios.put(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      chatData
    );
  } catch (error) {
    console.error(
      `Error creating chat list for user ID: ${otherUserId}`,
      error
    );
  }
};

// Function to generate a unique room ID using timestamp and random number
const generateRoomId = () => {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to create a unique ID
};

export const checkChatExists = async (currentUserId, otherUserId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`
    );

    // Kiểm tra xem dữ liệu có tồn tại không
    return response.data !== null; // Nếu không có dữ liệu, trả về false
  } catch (error) {
    console.error("Error checking chat existence:", error);
    return false; // Nếu có lỗi, coi như cuộc trò chuyện không tồn tại
  }
};

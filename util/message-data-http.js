import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Hàm gửi tin nhắn
export const sendMessage = async (roomId, msgData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/messages/${roomId}.json`,
      msgData
    );

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message: " + error.message);
  }
};

// Hàm lấy tất cả tin nhắn dựa trên roomId
export const getAllChat = async (roomId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/messages/${roomId}.json`);

    // Kiểm tra nếu có dữ liệu
    if (response.data) {
      // Chuyển đổi dữ liệu từ object sang array
      const messages = Object.keys(response.data).map((key) => ({
        id: key,
        from: response.data[key].from,
        to: response.data[key].to,
        message: response.data[key].message,
        sendTime: response.data[key].sendTime,
        msgType: response.data[key].msgType,
      }));
      return messages;
    }

    return []; // Trả về mảng rỗng nếu không có tin nhắn
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages: " + error.message);
  }
};

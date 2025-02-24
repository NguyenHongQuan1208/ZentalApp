import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

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

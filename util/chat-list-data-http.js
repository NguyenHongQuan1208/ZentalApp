import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Function to create a chat list and return the room ID
export const createChatList = async (currentUserId, otherUserId, roomId) => {
  // Generate a unique room ID if not provided
  const generatedRoomId = roomId || generateRoomId();

  const chatData = {
    lastMsg: "",
    lastMsgTime: "",
    unreadCount: 0,
    roomId: generatedRoomId,
  };

  try {
    // Create chat list for the current user
    await axios.put(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      chatData
    );

    // Create chat list for the other user with the same room ID
    await axios.put(
      `${BACKEND_URL}/chatlist/${otherUserId}/${currentUserId}.json`,
      {
        ...chatData, // Use the same chat data
        roomId: generatedRoomId, // Ensure the same roomId is used
      }
    );

    return generatedRoomId; // Return the generated or provided room ID
  } catch (error) {
    console.error(
      `Error creating chat list for user ID: ${otherUserId}`,
      error
    );
    throw new Error("Failed to create chat list"); // Throw an error to handle it in the calling function
  }
};

// Function to generate a unique room ID using timestamp and random number
const generateRoomId = () => {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to create a unique ID
};

export const updateChatList = async (
  currentUserId,
  otherUserId,
  chatlistData
) => {
  try {
    // Cập nhật chat list cho người dùng hiện tại
    await axios.patch(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      chatlistData
    );

    // Cập nhật chat list cho người dùng khác
    await axios.patch(
      `${BACKEND_URL}/chatlist/${otherUserId}/${currentUserId}.json`,
      chatlistData
    );
  } catch (error) {
    console.error(
      `Error updating chat list for user ID: ${otherUserId}`,
      error
    );
    throw new Error("Failed to update chat list"); // Ném lỗi để xử lý ở hàm gọi
  }
};

// Function to check if a chat exists
export const checkChatExists = async (currentUserId, otherUserId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`
    );

    // Check if data exists
    return response.data !== null; // If no data, return false
  } catch (error) {
    console.error("Error checking chat existence:", error);
    return false; // If there's an error, consider the chat as not existing
  }
};

export const getRoomId = async (currentUserId, otherUserId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`
    );
    return response.data.roomId; // Assuming the roomId is stored in the data
  } catch (error) {
    console.error("Error fetching room ID:", error);
    throw new Error("Failed to fetch room ID");
  }
};

// Function to get the unread count based on currentUserId and otherUserId
export const getUnreadCount = async (currentUserId, otherUserId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`
    );

    // Check if data exists and return the unreadCount
    if (response.data) {
      return response.data.unreadCount; // Return the unread count
    } else {
      return 0; // If no data exists, return 0
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw new Error("Failed to fetch unread count");
  }
};

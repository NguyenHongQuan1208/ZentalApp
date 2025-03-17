import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Function to create a chat list and return the room ID
export const createChatList = async (currentUserId, otherUserId, roomId) => {
  // Generate a unique room ID if not provided
  const generatedRoomId = roomId || generateRoomId();

  const chatDataForCurrentUser = {
    lastMsg: "",
    lastMsgTime: "",
    unreadCount: 0,
    userActive: true, // Người tạo chat sẽ active
    roomId: generatedRoomId,
  };

  const chatDataForOtherUser = {
    lastMsg: "",
    lastMsgTime: "",
    unreadCount: 0,
    userActive: false, // Người còn lại sẽ inactive
    roomId: generatedRoomId,
  };

  try {
    // Gửi dữ liệu cho currentUser
    await axios.put(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      chatDataForCurrentUser
    );

    // Gửi dữ liệu cho otherUser
    await axios.put(
      `${BACKEND_URL}/chatlist/${otherUserId}/${currentUserId}.json`,
      chatDataForOtherUser
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

export const getChatListData = async (currentUserId, otherUserId) => {
  try {
    // Fetch the chat list data for the current user and the other user
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`
    );

    // Return the chat data if it exists, otherwise return null
    return response.data ? response.data : null;
  } catch (error) {
    console.error("Error fetching chat list data:", error);
    throw new Error("Failed to fetch chat list data"); // Throw an error to handle it in the calling function
  }
};

export const getChatUsers = async (currentUserId) => {
  try {
    // Fetch all chat entries for the current user
    const response = await axios.get(
      `${BACKEND_URL}/chatlist/${currentUserId}.json`
    );

    const chatEntries = response.data;

    if (!chatEntries) {
      return []; // No chat entries found
    }

    // Extract user IDs where lastMsg is not empty
    const chattedUserIds = Object.keys(chatEntries).filter((otherUserId) => {
      return (
        chatEntries[otherUserId].lastMsg &&
        chatEntries[otherUserId].lastMsg.trim() !== ""
      );
    });

    return chattedUserIds; // Return the list of user IDs you have chatted with
  } catch (error) {
    console.error("Error fetching chat users:", error);
    throw new Error("Failed to fetch chat users"); // Handle error appropriately
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
    // Update chat list for the current user
    await axios.patch(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      chatlistData
    );

    // Update chat list for the other user
    await axios.patch(
      `${BACKEND_URL}/chatlist/${otherUserId}/${currentUserId}.json`,
      chatlistData
    );
  } catch (error) {
    console.error(
      `Error updating chat list for user ID: ${otherUserId}`,
      error
    );
    throw new Error("Failed to update chat list"); // Throw an error to handle it in the calling function
  }
};

export const updateUserActiveStatus = async (
  currentUserId,
  otherUserId,
  isActive // This parameter determines the active status (true or false)
) => {
  try {
    // Create the data to update for the current user
    const currentUserDataUpdate = {
      userActive: isActive, // Set userActive to the value of isActive
    };

    // Update current user's active status
    await axios.patch(
      `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`,
      currentUserDataUpdate
    );
  } catch (error) {
    console.error(
      `Error updating user active status for user ID: ${currentUserId}`,
      error
    );
    throw new Error("Failed to update user active status"); // Throw an error to handle it in the calling function
  }
};

export const resetUnreadCount = async (currentUserId, otherUserId) => {
  const chatListRef = `${BACKEND_URL}/chatlist/${currentUserId}/${otherUserId}.json`;

  try {
    // Reset unread count for the current user
    await axios.patch(chatListRef, { unreadCount: 0 });
  } catch (error) {
    console.error("Error resetting unread count:", error);
    throw new Error("Failed to reset unread count"); // Throw an error to handle it in the calling function
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

// Function to increment the unread count for a chat
export const incrementUnreadCount = async (currentUserId, otherUserId) => {
  try {
    const chatListRef = `${BACKEND_URL}/chatlist/${otherUserId}/${currentUserId}.json`;

    // Fetch the current chat list entry for the other user
    const response = await axios.get(chatListRef);
    const chatData = response.data;

    if (chatData) {
      // Increment the unread count
      const newUnreadCount = (chatData.unreadCount || 0) + 1;

      // Update the chat list with the new unread count
      await axios.put(chatListRef, {
        ...chatData,
        unreadCount: newUnreadCount,
      });
    } else {
      // If no entry exists, create a new one
      const newChatListEntry = {
        lastMsg: "",
        lastMsgTime: new Date().toISOString(),
        unreadCount: 1, // First message, so unread count starts at 1
        roomId: "", // You can set this to an appropriate value if needed
      };

      await axios.put(chatListRef, newChatListEntry);
    }
  } catch (error) {
    console.error("Error updating unread count:", error);
  }
};

export const getChatList = (currentUserId, callback) => {
  const db = getDatabase();
  const chatListRef = ref(db, `chatlist/${currentUserId}`);

  // Ensure callback is a function before calling
  if (typeof callback !== "function") {
    console.error("Callback is not a function");
    return;
  }

  onValue(
    chatListRef,
    (snapshot) => {
      const chatEntries = snapshot.val();
      if (!chatEntries) {
        callback([]); // No chat entries found
        return;
      }

      // Transforming chat entries into a usable format
      const formattedChatList = Object.keys(chatEntries).map((otherUserId) => ({
        userId: otherUserId,
        ...chatEntries[otherUserId],
      }));

      callback(formattedChatList); // Return the formatted chat list
    },
    (error) => {
      console.error("Error fetching chat list:", error);
      callback([]); // Return an empty array on error
    }
  );
};

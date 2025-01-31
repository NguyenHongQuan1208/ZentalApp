import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

export async function getLikesByPostId(postId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/likes/${postId}.json`);
    if (!response.data) return [];

    return Object.entries(response.data).map(([userId, data]) => ({
      userId,
      ...data,
    }));
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw new Error("Could not fetch likes.");
  }
}

export async function getLikesByUserId(userId) {
  try {
    // Lấy tất cả likes và lọc theo userId
    const response = await axios.get(`${BACKEND_URL}/likes.json`);
    if (!response.data) return [];

    const userLikes = [];

    // Duyệt qua từng post
    Object.entries(response.data).forEach(([postId, postLikes]) => {
      // Kiểm tra xem user có like post này không
      if (postLikes && postLikes[userId]) {
        userLikes.push({
          postId,
          ...postLikes[userId],
        });
      }
    });

    return userLikes;
  } catch (error) {
    console.error("Error fetching user likes:", error);
    throw new Error("Could not fetch user likes.");
  }
}

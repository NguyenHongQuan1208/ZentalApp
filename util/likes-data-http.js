import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Lưu trữ like trong bảng riêng
export async function likePost(postId, userId) {
  try {
    // Thêm vào bảng likes
    await axios.put(`${BACKEND_URL}/likes/${postId}/${userId}.json`, {
      userId,
      postId,
      createdAt: new Date().toISOString(),
    });

    // Cập nhật số lượng likes trong bảng posts
    const likesCount = await getLikeCount(postId);
    await axios.patch(`${BACKEND_URL}/posts/${postId}.json`, {
      likesCount: likesCount,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Could not like post.");
  }
}

export async function unlikePost(postId, userId) {
  try {
    // Xóa khỏi bảng likes
    await axios.delete(`${BACKEND_URL}/likes/${postId}/${userId}.json`);

    // Cập nhật số lượng likes trong bảng posts
    const likesCount = await getLikeCount(postId);
    await axios.patch(`${BACKEND_URL}/posts/${postId}.json`, {
      likesCount: likesCount,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    throw new Error("Could not unlike post.");
  }
}

export async function checkIfLiked(postId, userId) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/likes/${postId}/${userId}.json`
    );
    return response.data !== null;
  } catch (error) {
    console.error("Error checking like status:", error);
    throw new Error("Could not check like status.");
  }
}

export async function getLikeCount(postId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/likes/${postId}.json`);
    if (!response.data) return 0;
    return Object.keys(response.data).length;
  } catch (error) {
    console.error("Error getting like count:", error);
    throw new Error("Could not get like count.");
  }
}

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

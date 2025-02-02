import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Lấy danh sách bình luận của một bài viết
export async function getCommentsByPostId(postId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/comments/${postId}.json`);
    if (!response.data) return [];
    return Object.entries(response.data).map(([commentId, data]) => ({
      commentId,
      ...data,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Could not fetch comments.");
  }
}

// Thêm bình luận
export async function addComment(postId, userId, content) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/comments/${postId}.json`,
      {
        postId,
        userId,
        content,
        createdAt: new Date().toISOString(),
      }
    );
    return response.data.name; // Trả về commentId được tạo bởi Firebase
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not add comment.");
  }
}

// Xóa bình luận
export async function deleteComment(postId, commentId) {
  try {
    await axios.delete(`${BACKEND_URL}/comments/${postId}/${commentId}.json`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Could not delete comment.");
  }
}

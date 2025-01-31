import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Thêm comment vào bảng riêng
export async function addComment(commentData) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/comments.json`,
      commentData
    );
    const commentId = response.data.name; // Firebase trả về ID tự động
    return commentId;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not add comment.");
  }
}

// Lấy tất cả comments của một post
export async function getCommentsByPostId(postId) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/comments.json?orderBy="postId"&equalTo="${postId}"`
    );

    if (!response.data) return [];

    // Chuyển đổi dữ liệu từ Firebase sang mảng
    const comments = Object.keys(response.data).map((key) => ({
      id: key,
      ...response.data[key],
    }));

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Could not fetch comments.");
  }
}

// Xóa comment
export async function deleteComment(commentId) {
  try {
    await axios.delete(`${BACKEND_URL}/comments/${commentId}.json`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Could not delete comment.");
  }
}

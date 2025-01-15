import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Thêm bài đăng mới vào `postsData`
export async function addPost(postData) {
  try {
    // Gửi yêu cầu POST để thêm bài đăng mới
    const response = await axios.put(`${BACKEND_URL}/posts.json`, postData);

    // Trả về ID bài đăng mới
    return response.data.name; // Firebase trả về `name` là ID bài đăng
  } catch (error) {
    console.error("Error adding post:", error);
    throw new Error("Could not add post.");
  }
}

// Lấy tất cả bài đăng
export async function getAllPosts() {
  try {
    // Gửi yêu cầu GET để lấy tất cả bài đăng
    const response = await axios.get(`${BACKEND_URL}/posts.json`);

    // Kiểm tra nếu không có bài đăng
    if (!response.data) {
      return [];
    }

    // Chuyển đổi dữ liệu từ Firebase thành mảng
    const posts = Object.keys(response.data).map((key) => ({
      id: key, // Firebase ID
      ...response.data[key], // Nội dung bài đăng
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts.");
  }
}

// Lấy bài đăng cụ thể theo ID
export async function getPostById(postId) {
  try {
    const response = await axios.get(`${BACKEND_URL}/posts/${postId}.json`);

    if (!response.data) {
      throw new Error("Post not found.");
    }

    return { id: postId, ...response.data };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Could not fetch post.");
  }
}

// Cập nhật bài đăng
export async function updatePost(postId, updatedData) {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/posts/${postId}.json`,
      updatedData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Could not update post.");
  }
}

// Xóa bài đăng
export async function deletePost(postId) {
  try {
    await axios.delete(`${BACKEND_URL}/posts/${postId}.json`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Could not delete post.");
  }
}

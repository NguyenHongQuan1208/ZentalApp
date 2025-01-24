import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Thêm bài đăng mới vào `postsData`
export async function addPost(postData) {
  try {
    // Gửi yêu cầu POST để thêm bài đăng mới
    const response = await axios.post(`${BACKEND_URL}/posts.json`, postData);

    const id = response.data.name;
    // Trả về ID bài đăng mới
    return id; // Firebase trả về `name` là ID bài đăng
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

export async function likePost(postId, userId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/posts/${postId}/likes/${userId}.json`,
      {
        method: "PUT", // Hoặc "PATCH"
        body: JSON.stringify(true), // Thêm user ID vào danh sách likes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to like post.");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Could not like post.");
  }
}

export async function unlikePost(postId, userId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/posts/${postId}/likes/${userId}.json`,
      {
        method: "DELETE", // Xóa user ID khỏi danh sách likes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unlike post.");
    }
  } catch (error) {
    console.error("Error unliking post:", error);
    throw new Error("Could not unlike post.");
  }
}

export async function checkIfLiked(postId, userId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/posts/${postId}/likes/${userId}.json`
    );

    if (!response.ok) {
      throw new Error("Failed to check like status.");
    }

    const data = await response.json();
    return data !== null; // Trả về true nếu user đã like, ngược lại trả về false
  } catch (error) {
    console.error("Error checking like status:", error);
    throw new Error("Could not check like status.");
  }
}
export async function getLikesForPost(postId) {
  try {
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/likes.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch likes.");
    }

    const data = await response.json();

    if (!data) {
      return []; // Trả về mảng rỗng nếu không có lượt like nào
    }

    // Chuyển đổi danh sách likes thành mảng các user ID
    const likes = Object.keys(data);
    return likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw new Error("Could not fetch likes.");
  }
}

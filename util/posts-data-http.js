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

// Hàm cập nhật trạng thái công khai của bài đăng
export async function changePublicStatus(postId, newStatus) {
  try {
    // Gửi yêu cầu PATCH để cập nhật publicStatus
    const response = await axios.patch(
      `${BACKEND_URL}/posts/${postId}.json`,
      { publicStatus: newStatus } // Cập nhật trường publicStatus
    );

    return response.data; // Trả về dữ liệu đã cập nhật
  } catch (error) {
    console.error("Error updating public status:", error);
    throw new Error("Could not update public status.");
  }
}
export async function countPostsByUser(userId) {
  try {
    // Lấy tất cả bài đăng
    const response = await axios.get(`${BACKEND_URL}/posts.json`);

    if (!response.data) {
      return {}; // Không có bài đăng nào
    }

    // Khởi tạo đối tượng đếm cho mỗi section
    const sections = ["s1", "s2", "s3", "s4", "s5", "s6"];
    const counts = sections.reduce((acc, section) => {
      acc[section] = 0;
      return acc;
    }, {});

    // Lọc và đếm bài đăng theo userId và sectionId
    Object.values(response.data).forEach((post) => {
      if (post.uid === userId && sections.includes(post.sectionId)) {
        counts[post.sectionId]++;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error counting posts:", error);
    throw new Error("Could not count posts.");
  }
}
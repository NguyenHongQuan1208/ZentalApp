import axios from "axios";

const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Hàm báo cáo bài đăng
export async function reportPost(postId, reportData) {
  try {
    // Thêm postId vào reportData
    const dataWithPostId = {
      ...reportData,
      postId: postId, // Include postId in the report data
    };

    // Gửi yêu cầu POST để báo cáo bài đăng
    const response = await axios.post(
      `${BACKEND_URL}/reports.json`, // Use POST to create a new report
      dataWithPostId
    );

    // Trả về ID của báo cáo (Firebase trả về `name` là ID của báo cáo)
    return response.data.name; // Firebase returns the generated ID
  } catch (error) {
    console.error("Error reporting post:", error);
    throw new Error("Could not report post.");
  }
}

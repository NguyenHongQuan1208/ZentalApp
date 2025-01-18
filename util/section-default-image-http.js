import axios from "axios";

// URL của Firebase Realtime Database
const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Hàm lấy ảnh theo sectionId
export async function fetchImageBySectionId(sectionId) {
  try {
    // Truy vấn dữ liệu từ Firebase Realtime Database với axios
    const response = await axios.get(`${BACKEND_URL}/sectionDefaultImage.json`);

    if (response.data) {
      // Duyệt qua các ảnh và tìm ảnh có sectionId khớp
      const image = Object.values(response.data).find(
        (item) => item.sectionId === sectionId
      );

      if (image) {
        return image.imageUri; // Trả về URI của ảnh
      } else {
        console.log(`No image found for sectionId: ${sectionId}`);
        return null;
      }
    } else {
      console.log("No images available in the database.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching image by sectionId:", error.message || error);
    return null;
  }
}

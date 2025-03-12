import { database } from "./firebase-config";
import { ref, set, remove, get } from "firebase/database";

// Hàm theo dõi người dùng
export const followUser = async (followerId, followingId) => {
  try {
    // Cập nhật danh sách người theo dõi
    await set(
      ref(database, `follows/${followerId}/following/${followingId}`),
      true
    );

    // Cập nhật danh sách followers cho người được theo dõi
    await set(
      ref(database, `follows/${followingId}/followers/${followerId}`),
      true
    );
  } catch (error) {
    console.error("Error following user: ", error);
  }
};

// Hàm hủy theo dõi người dùng
export const unfollowUser = async (followerId, followingId) => {
  try {
    // Xóa người dùng khỏi danh sách đang theo dõi
    await remove(
      ref(database, `follows/${followerId}/following/${followingId}`)
    );

    // Xóa người dùng khỏi danh sách người theo dõi cho người được theo dõi
    await remove(
      ref(database, `follows/${followingId}/followers/${followerId}`)
    );
  } catch (error) {
    console.error("Error unfollowing user: ", error);
  }
};

export const checkIfFollowing = async (followerId, followingId) => {
  try {
    // Gửi yêu cầu GET để kiểm tra xem người dùng có đang theo dõi hay không
    const snapshot = await get(
      ref(database, `follows/${followerId}/following/${followingId}`)
    );

    // Nếu phản hồi không phải là null, có nghĩa là người dùng đang theo dõi
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking follow status: ", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

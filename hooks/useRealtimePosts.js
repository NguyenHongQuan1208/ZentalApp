import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../util/firebase-config"; // Đường dẫn tới cấu hình Firebase

function useRealtimePosts(userId, taskSections) {
  const [updatedSections, setUpdatedSections] = useState(taskSections);

  useEffect(() => {
    if (!userId || !taskSections) return;

    // Tham chiếu tới `posts` trong Firebase
    const postsRef = ref(database, "posts");

    // Lắng nghe thay đổi dữ liệu thời gian thực
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const postsData = snapshot.val();
      if (!postsData) {
        setUpdatedSections(
          taskSections.map((section) => ({
            ...section,
            hasDraft: false, // Không có post thì `hasDraft` là false
          }))
        );
        return;
      }

      // Cập nhật `hasDraft` cho từng section
      const updatedData = taskSections.map((section) => {
        const hasDraft = Object.values(postsData).some(
          (post) =>
            post.uid === userId &&
            post.sectionId === section.id &&
            post.status === 0
        );

        return { ...section, hasDraft };
      });
      //   console.log("Updated sections:", updatedData);
      setUpdatedSections(updatedData);
    });

    // Hủy lắng nghe khi component unmount
    return () => {
      unsubscribe();
    };
  }, [userId, taskSections]);

  return updatedSections;
}

export default useRealtimePosts;

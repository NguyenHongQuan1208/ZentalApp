import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { database } from "../util/firebase-config";

function useRealtimeUser(userId, onUserDataChanged) {
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(database, `userInfo/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        onUserDataChanged(userData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, onUserDataChanged]);
}

export default useRealtimeUser;

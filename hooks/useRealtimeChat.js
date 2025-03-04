import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { database } from "../util/firebase-config";

function useRealtimeChat(roomId, onChatDataChanged) {
  useEffect(() => {
    if (!roomId) return;

    const chatRef = ref(database, `messages/${roomId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        // Convert chatData object to an array of messages
        const messagesArray = Object.keys(chatData).map((key) => ({
          id: key,
          ...chatData[key],
        }));
        onChatDataChanged(messagesArray);
      } else {
        onChatDataChanged([]); // Clear messages if none exist
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, onChatDataChanged]);
}

export default useRealtimeChat;

import { useState, useEffect } from "react";
import { getUser } from "../util/user-info-http";

function useUser(userId) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUser(userId);
        setUser(userData || { username: "Unknown", photoUrl: null });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setUser({ username: "Unknown", photoUrl: null });
      setIsLoading(false);
    }
  }, [userId]);

  return { user, isLoading, error };
}

export default useUser;

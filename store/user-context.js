import React, { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const UserContext = createContext({});

function UserContextProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // Đăng ký sự kiện lắng nghe trạng thái đăng nhập
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore()
            .collection("Users")
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Lỗi khi lấy tên người dùng:", error);
        }
      } else {
        setUserName(""); // Nếu không có người dùng (đăng xuất), xóa tên
      }
      setLoading(false);
    });

    return subscriber; // Dọn dẹp khi component unmount
  }, []);

  function logoutUserName() {
    setUserName("");
  }

  return (
    <UserContext.Provider value={{ userName, loading, logoutUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

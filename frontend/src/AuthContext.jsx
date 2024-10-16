import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userAvatar, setUserAvatar] = useState(
    localStorage.getItem("userAvatar")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
      setUserAvatar(localStorage.getItem("userAvatar"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ userId, setUserId, userAvatar, setUserAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

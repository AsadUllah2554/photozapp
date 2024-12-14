"use client";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const storedTimestamp = localStorage.getItem("userTimestamp");

    if (storedUser && storedTimestamp) {
      const now = new Date().getTime();
      const timestamp = JSON.parse(storedTimestamp);

      // Check if 30 days have passed
      if (now - timestamp > THIRTY_DAYS_IN_MS) {
        // If 30 days have passed, clear the localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("userTimestamp");
        return null;
      }

      return JSON.parse(storedUser);
    }

    return null;
  });
  console.log("user in context" + user);
  useEffect(() => {
    // Update localStorage whenever user state changes
    if (user) {
      const timestamp = new Date().getTime();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userTimestamp", JSON.stringify(timestamp));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userTimestamp");
    }
  }, [user]);
  const logout = () => {
    localStorage.removeItem("user");

    setUser(null);
  };

  const [posts, setPosts] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, posts, setPosts, logout }}>
      {children}
    </UserContext.Provider>
  );
};

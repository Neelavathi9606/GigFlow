import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "./authContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("authenticate", user._id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("newBid", (data) => {
      console.log("New bid received:", data);
      addNotification({
        id: Date.now(),
        type: "newBid",
        message: data.message,
        data: data.bid,
        timestamp: new Date(),
      });
    });

    newSocket.on("bidAccepted", (data) => {
      console.log("Bid accepted:", data);
      addNotification({
        id: Date.now(),
        type: "bidAccepted",
        message: data.message,
        data: data.bid,
        timestamp: new Date(),
      });
    });

    newSocket.on("bidRejected", (data) => {
      console.log("Bid rejected:", data);
      addNotification({
        id: Date.now(),
        type: "bidRejected",
        message: data.message,
        data: data,
        timestamp: new Date(),
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isLoggedIn, user]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;

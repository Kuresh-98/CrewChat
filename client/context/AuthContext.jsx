import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const socketRef = useRef(null);

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        fetchFriendRequests();
      }
    } catch (error) {
      console.log("Auth check failed:", error.message);
    }
  };

  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        // For signup, don't auto-login - just return success so form can switch to login
        if (state === "signup") {
          toast.success(data.message);
          return true;
        }

        // For login, set auth user and redirect
        console.log("Login successful, setting up user session");
        
        // Set token first
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        // Set auth user
        setAuthUser(data.userData);
        fetchFriendRequests();
        
        // Connect socket after a brief delay to ensure state updates propagate
        setTimeout(() => {
          connectSocket(data.userData);
        }, 100);
        
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    
    // Disconnect socket if it exists
    if (socketRef.current) {
      console.log("Disconnecting socket on logout");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    
    toast.success("Logged out successfully");
  };

  // Update profile function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData) {
      console.log("No user data provided");
      return;
    }
    
    // Disconnect old socket if it exists
    if (socketRef.current) {
      console.log("Disconnecting old socket");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("Initiating socket connection for user:", userData._id);

    const newSocket = io(backendUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      query: {
        userId: userData._id,
      },
    });

    // Add all listeners BEFORE storing the socket
    newSocket.on("connect", () => {
      console.log("✓ Socket connected successfully");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("✗ Socket disconnected. Reason:", reason);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("Online users updated:", userIds);
      setOnlineUsers(userIds);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error event:", error);
    });

    // Now store the socket
    socketRef.current = newSocket;
    setSocket(newSocket);
    console.log("Socket instance stored and state updated");
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        console.log("Cleaning up socket on unmount");
        socketRef.current.disconnect();
      }
    };
  }, []);

  const searchUser = async (username) => {
    try {
      const { data } = await axios.get(`/api/auth/search-user?username=${username}`);
      return data;
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      const { data } = await axios.post("/api/auth/friend-request/send", { receiverId });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get("/api/auth/friend-requests");
      if (data.success) {
        setPendingRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch friend requests:", error.message);
    }
  };

  const respondRequest = async (requestId, action) => {
    try {
      const { data } = await axios.post("/api/auth/friend-request/respond", { requestId, action });
      if (data.success) {
        toast.success(data.message);
        await fetchFriendRequests();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    pendingRequests,
    searchUser,
    sendRequest,
    fetchFriendRequests,
    respondRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

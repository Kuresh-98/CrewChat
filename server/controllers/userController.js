import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio, username } = req.body;

  try {
    if (!fullName || !email || !password || !bio || !username) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Check if user already exists with email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username: username.toLowerCase().trim() }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.json({ success: false, message: "Account already exists with this email" });
      }
      if (existingUser.username === username.toLowerCase().trim()) {
        return res.json({ success: false, message: "Username is already taken" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPasswod = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      username: username.toLowerCase().trim(),
      password: hashedPasswod,
      bio,
      friends: [],
    });

    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, message: error.message });
  }
};

// Controller to login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to check if user is authenticated
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Search globally for a user by username
export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const currentUserId = req.user._id;

    if (!username) {
      return res.json({ success: false, message: "Username is required" });
    }

    const targetUser = await User.findOne({ username: username.toLowerCase().trim() }).select("-password");

    if (!targetUser) {
      return res.json({ success: false, message: "User not found" });
    }

    if (targetUser._id.equals(currentUserId)) {
      return res.json({ success: false, message: "You cannot search for yourself" });
    }

    // Determine relationship status
    // 1. Check if already friends
    const isFriend = req.user.friends.includes(targetUser._id);

    // 2. Check if a friend request has been sent or received
    const pendingRequest = await FriendRequest.findOne({
      $or: [
        { senderId: currentUserId, receiverId: targetUser._id, status: "pending" },
        { senderId: targetUser._id, receiverId: currentUserId, status: "pending" }
      ]
    });

    let relationshipStatus = "none"; // "none", "friends", "sent", "received"
    let requestId = null;

    if (isFriend) {
      relationshipStatus = "friends";
    } else if (pendingRequest) {
      requestId = pendingRequest._id;
      relationshipStatus = pendingRequest.senderId.equals(currentUserId) ? "sent" : "received";
    }

    return res.json({
      success: true,
      user: targetUser,
      relationshipStatus,
      requestId
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.json({ success: false, message: "Receiver ID is required" });
    }

    if (senderId.equals(receiverId)) {
      return res.json({ success: false, message: "You cannot add yourself" });
    }

    // Check if already friends
    if (req.user.friends.includes(receiverId)) {
      return res.json({ success: false, message: "You are already friends" });
    }

    // Check if there is already a request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.json({ success: false, message: "Friend request is already pending" });
      }
      if (existingRequest.status === "accepted") {
        return res.json({ success: false, message: "You are already friends" });
      }
    }

    // Create request
    const newRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending"
    });

    return res.json({ success: true, message: "Friend request sent successfully", request: newRequest });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get pending friend requests received by current user
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiverId: userId,
      status: "pending"
    }).populate("senderId", "fullName username profilePic bio");

    return res.json({ success: true, requests });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Accept or decline friend request
export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'decline'
    const userId = req.user._id;

    if (!requestId || !action) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.json({ success: false, message: "Friend request not found" });
    }

    // Ensure the current user is the receiver of the request
    if (!request.receiverId.equals(userId)) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    if (request.status !== "pending") {
      return res.json({ success: false, message: "Request already processed" });
    }

    if (action === "accept") {
      // 1. Update request status
      request.status = "accepted";
      await request.save();

      // 2. Add both users to each other's friends lists
      await User.findByIdAndUpdate(request.senderId, { $addToSet: { friends: request.receiverId } });
      await User.findByIdAndUpdate(request.receiverId, { $addToSet: { friends: request.senderId } });

      // Clean up the request document (delete it so it's clean and allows sending requests again if unfriended)
      await FriendRequest.findByIdAndDelete(requestId);

      return res.json({ success: true, message: "Friend request accepted" });
    } else if (action === "decline") {
      // Delete the request
      await FriendRequest.findByIdAndDelete(requestId);
      return res.json({ success: true, message: "Friend request declined" });
    } else {
      return res.json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

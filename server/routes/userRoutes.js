import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
  searchUserByUsername,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

// Friend system endpoints
userRouter.get("/search-user", protectRoute, searchUserByUsername);
userRouter.post("/friend-request/send", protectRoute, sendFriendRequest);
userRouter.get("/friend-requests", protectRoute, getFriendRequests);
userRouter.post("/friend-request/respond", protectRoute, respondToFriendRequest);

export default userRouter;

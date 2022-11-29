import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  authUser,
  deleteUsers,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUser,
  updateUserProfile
} from "../controllers/userController.js";


const router = express();

router.post("/login", authUser);
router
  .route("/")
  .post(registerUser)
  .get(protect, admin, getUsers)

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUsers)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router;
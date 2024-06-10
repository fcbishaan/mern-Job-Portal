
import express from 'express';
import { register, login, logout, getUser, updateUserProfile, getAllUsers, deleteUser, verifyUser } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/Auth.js';
import { isAdmin } from '../middlewares/Admin.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/profile", isAuthenticated, updateUserProfile);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);
router.put("/verify/:id", isAuthenticated, isAdmin, verifyUser);
  
export default router;

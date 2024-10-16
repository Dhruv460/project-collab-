import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile,searchUsers,emailVerification } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js'; // Import multer configuration

const router = express.Router();

router.post('/register', upload.single('profileImage'), registerUser); // Use multer middleware for image upload
router.post('/login', loginUser);
router.get('/search', searchUsers);
router.get('/:id', getUserProfile);
router.put('/:id', upload.single('profileImage'), updateUserProfile); // Use multer middleware for image upload
router.get("/:id/verify/:token/", emailVerification);
export default router;

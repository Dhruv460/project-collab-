import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { handleFollowRequest } from '../controllers/projectControllers.js';
const router = express.Router();
router.post('/:id/handle', protect, (req, res) => handleFollowRequest(req, res, req.io));
// router.post('/:id/handle', handleFollowRequest);
export default router;


import express from 'express';
import { getUserHistory, toggleFavorite, deleteHistoryItem } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/history', getUserHistory);
router.patch('/history/:id/favorite', toggleFavorite);
router.delete('/history/:id', deleteHistoryItem);

export default router;

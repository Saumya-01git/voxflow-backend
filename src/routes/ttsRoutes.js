import express from 'express';
import { synthesize } from '../controllers/ttsController.js';
import { validateTTSRequest } from '../middleware/validator.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/tts
 * Converts text into speech with optional user authentication
 * (Associates history with user account when signed in)
 */
router.post('/', optionalAuth, validateTTSRequest, synthesize);

export default router;

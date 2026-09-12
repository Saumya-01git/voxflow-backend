import express from 'express';
import { synthesize } from '../controllers/ttsController.js';
import { validateTTSRequest } from '../middleware/validator.js';

const router = express.Router();

/**
 * POST /api/tts
 * Converts text into speech with strict request validation
 */
router.post('/', validateTTSRequest, synthesize);

export default router;

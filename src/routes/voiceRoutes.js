import express from 'express';
import { getVoices } from '../controllers/voiceController.js';

const router = express.Router();

/**
 * GET /api/voices
 * Returns all available languages & voice personas
 */
router.get('/', getVoices);

export default router;

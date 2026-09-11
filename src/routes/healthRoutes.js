import express from 'express';

const router = express.Router();

/**
 * Health Check API
 * GET /api/health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'VoxFlow TTS Engine',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

export default router;

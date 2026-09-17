import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/healthRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow audio files to be loaded by frontend
}));

// 2. CORS Configuration (Section 15 of PDF)
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Body Parsing & Logging
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 4. Static Audio Delivery (Section 5 & 8 of PDF)
const audioStoragePath = path.join(__dirname, '../storage/audio');
app.use('/audio', express.static(audioStoragePath));

// 5. Route Mounting
app.use('/api/health', healthRoutes);
app.use('/api/voices', voiceRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Root greeting & status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'VoxFlow Text-to-Speech API Server is operational.',
    documentation: '/api/health'
  });
});

// 6. 404 Not Found Handler (Section 14 of PDF)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found.`
  });
});

// 7. Global Error Handler (Section 14 & 15 of PDF)
app.use((err, req, res, next) => {
  logger.error('Unhandled server error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`VoxFlow Server is listening on http://localhost:${PORT}`);
  logger.info(`Health check accessible at http://localhost:${PORT}/api/health`);
});

export default app;

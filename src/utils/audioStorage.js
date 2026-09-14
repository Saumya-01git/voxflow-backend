import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.join(__dirname, '../../storage/audio');

// Ensure storage directory exists on startup
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * Save synthesized audio buffer to local storage cache
 * 
 * @param {Buffer} audioBuffer - Binary audio buffer
 * @param {string} voice - Voice persona identifier
 * @returns {Promise<{ filename: string, audioUrl: string, filePath: string }>}
 */
export async function saveAudioFile(audioBuffer, voice = 'voice') {
  const timestamp = Date.now();
  const sanitizedVoice = voice.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `voxflow_${sanitizedVoice}_${timestamp}.mp3`;
  const filePath = path.join(STORAGE_DIR, filename);

  await fs.promises.writeFile(filePath, audioBuffer);
  logger.info(`Audio cached successfully: ${filename} (${audioBuffer.length} bytes)`);

  return {
    filename,
    audioUrl: `/audio/${filename}`,
    filePath
  };
}

/**
 * Routine to clean up temporary audio files older than maxAgeMs (Default 1 hour)
 * Adheres to Section 15 of PDF ("Avoid storing generated audio permanently")
 */
export async function cleanupOldAudio(maxAgeMs = 60 * 60 * 1000) {
  try {
    const files = await fs.promises.readdir(STORAGE_DIR);
    const now = Date.now();

    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = path.join(STORAGE_DIR, file);
      const stats = await fs.promises.stat(filePath);

      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.promises.unlink(filePath);
        logger.info(`Cleaned up expired audio cache: ${file}`);
      }
    }
  } catch (err) {
    logger.warn('Audio cleanup warning:', err.message);
  }
}

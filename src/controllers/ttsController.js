import { logger } from '../utils/logger.js';
import { synthesizeAudio } from '../services/ttsService.js';
import { saveAudioFile } from '../utils/audioStorage.js';
import { readDB, writeDB } from '../utils/db.js';

/**
 * Controller: Handle Speech Synthesis Request
 * POST /api/tts
 * 
 * Flow (Section 5, 8, 11, 16 of PDF):
 * 1. Receive validated text & voice configuration
 * 2. Synthesize audio buffer via TTS provider
 * 3. Store audio file temporarily in storage/audio
 * 4. If user is authenticated, record to user's personalized history vault
 * 5. Return audioUrl and metadata to frontend
 */
export async function synthesize(req, res, next) {
  try {
    const text = req.sanitizedText;
    const { language, voice, speed = 1.0, pitch = 0 } = req.body;

    logger.info(`Processing synthesis: [${language}] [${voice}] - ${text.length} chars (User: ${req.user?.email || 'Guest'})`);

    // 1. Synthesize audio with TTS provider
    const { audioBuffer, format, duration } = await synthesizeAudio({
      text,
      language,
      voice,
      speed: Number(speed),
      pitch: Number(pitch)
    });

    // 2. Cache audio to storage and generate delivery URL
    const { filename, audioUrl } = await saveAudioFile(audioBuffer, voice);

    let historyId = null;

    // 3. If authenticated, record to personal history vault (Section 16)
    if (req.user) {
      try {
        const db = await readDB();
        historyId = `hist_${Date.now()}`;
        const historyEntry = {
          id: historyId,
          userId: req.user.id,
          text,
          language,
          voice,
          audioUrl,
          filename,
          duration,
          speed: Number(speed),
          pitch: Number(pitch),
          isFavorite: false,
          createdAt: new Date().toISOString()
        };
        db.history.push(historyEntry);
        await writeDB(db);
        logger.info(`Saved personalized history record for ${req.user.email}`);
      } catch (dbErr) {
        logger.warn('Failed to record history to DB:', dbErr.message);
      }
    }

    // 4. Return standardized API response contract
    res.status(200).json({
      success: true,
      audioUrl,
      filename,
      duration,
      format,
      characterCount: text.length,
      wordCount: text.split(/\s+/).length,
      language,
      voice,
      speed: Number(speed),
      pitch: Number(pitch),
      historyId,
      authenticated: Boolean(req.user),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Synthesis controller error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Text-to-speech synthesis failed.'
    });
  }
}

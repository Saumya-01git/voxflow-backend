import { logger } from '../utils/logger.js';
import { synthesizeAudio } from '../services/ttsService.js';
import { saveAudioFile } from '../utils/audioStorage.js';

/**
 * Controller: Handle Speech Synthesis Request
 * POST /api/tts
 * 
 * Flow (Section 5, 8, 11 of PDF):
 * 1. Receive validated text & voice configuration
 * 2. Synthesize audio buffer via TTS provider
 * 3. Store audio file temporarily in storage/audio
 * 4. Return audioUrl and metadata to frontend
 */
export async function synthesize(req, res, next) {
  try {
    const text = req.sanitizedText;
    const { language, voice, speed = 1.0, pitch = 0 } = req.body;

    logger.info(`Processing synthesis: [${language}] [${voice}] - ${text.length} chars`);

    // 1. Synthesize audio with TTS provider (Day 10)
    const { audioBuffer, format, duration } = await synthesizeAudio({
      text,
      language,
      voice,
      speed: Number(speed),
      pitch: Number(pitch)
    });

    // 2. Cache audio to storage and generate delivery URL (Day 11)
    const { filename, audioUrl } = await saveAudioFile(audioBuffer, voice);

    // 3. Return standardized API response contract (Section 8 of PDF)
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

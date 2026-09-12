import { logger } from '../utils/logger.js';

/**
 * Controller: Handle Speech Synthesis Request
 * POST /api/tts
 */
export async function synthesize(req, res, next) {
  try {
    const text = req.sanitizedText;
    const { language, voice, speed = 1.0, pitch = 0 } = req.body;

    logger.info(`Received TTS synthesis request for [${language}] [${voice}] - Length: ${text.length} chars`);

    const words = text.split(/\s+/).length;
    const estimatedDuration = Math.max(1, Math.round(words / (2.5 * (speed || 1.0))));

    // Return standardized API response contract matching Section 8 of PDF
    res.status(200).json({
      success: true,
      message: 'Speech synthesis request processed successfully.',
      audioUrl: `/audio/sample_${voice}.mp3`,
      text,
      language,
      voice,
      characterCount: text.length,
      wordCount: words,
      duration: estimatedDuration,
      speed: Number(speed),
      pitch: Number(pitch),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

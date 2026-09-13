import { logger } from '../utils/logger.js';
import { synthesizeAudio } from '../services/ttsService.js';

/**
 * Controller: Handle Speech Synthesis Request
 * POST /api/tts
 */
export async function synthesize(req, res, next) {
  try {
    const text = req.sanitizedText;
    const { language, voice, speed = 1.0, pitch = 0 } = req.body;

    logger.info(`Received TTS synthesis request: [${language}] [${voice}] - Length: ${text.length} chars`);

    // Communicate with the TTS provider (Day 10)
    const { audioBuffer, format, duration } = await synthesizeAudio({
      text,
      language,
      voice,
      speed: Number(speed),
      pitch: Number(pitch)
    });

    logger.info(`Synthesis successful: Generated ${audioBuffer.length} bytes of ${format} audio (~${duration}s)`);

    // Standardized response acknowledging provider integration
    res.status(200).json({
      success: true,
      message: 'Speech successfully synthesized by TTS provider.',
      audioUrl: `/audio/sample_${voice}.mp3`,
      audioBytes: audioBuffer.length,
      format,
      text,
      language,
      voice,
      characterCount: text.length,
      duration,
      speed: Number(speed),
      pitch: Number(pitch),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Synthesis controller error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'TTS synthesis provider failed.'
    });
  }
}

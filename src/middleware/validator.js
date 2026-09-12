import { SUPPORTED_LANGUAGES, SUPPORTED_VOICES } from '../data/voices.js';

/**
 * Validation Middleware for POST /api/tts
 * Meets all requirements from Section 13 of PDF specification
 */
export function validateTTSRequest(req, res, next) {
  // 1. Validate Content-Type
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Content-Type header. Expected application/json.'
    });
  }

  const { text, language, voice, speed, pitch } = req.body;

  // 2. Validate Text presence & non-empty
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Text is required and cannot be empty.'
    });
  }

  const trimmedText = text.trim();

  // 3. Validate Text Length boundary (Max 2000 chars)
  const MAX_CHAR_LIMIT = 2000;
  if (trimmedText.length > MAX_CHAR_LIMIT) {
    return res.status(400).json({
      success: false,
      error: `Text length exceeds maximum allowed limit of ${MAX_CHAR_LIMIT} characters (received ${trimmedText.length}).`
    });
  }

  // 4. Validate Language code
  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Language code is required (e.g., en-US, hi-IN, es-ES).'
    });
  }

  const isValidLanguage = SUPPORTED_LANGUAGES.some((lang) => lang.code === language);
  if (!isValidLanguage) {
    return res.status(400).json({
      success: false,
      error: `Unsupported language: '${language}'. Please choose a supported language.`,
      supportedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code)
    });
  }

  // 5. Validate Voice persona & verify it matches selected language
  if (!voice || typeof voice !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Voice persona ID is required.'
    });
  }

  const matchedVoice = SUPPORTED_VOICES.find((v) => v.id === voice);
  if (!matchedVoice) {
    return res.status(400).json({
      success: false,
      error: `Voice persona '${voice}' is not recognized.`
    });
  }

  if (matchedVoice.language !== language) {
    return res.status(400).json({
      success: false,
      error: `Voice persona '${voice}' belongs to language '${matchedVoice.language}', not selected language '${language}'.`
    });
  }

  // 6. Validate Speed boundary (0.5 to 2.0)
  if (speed !== undefined) {
    const numSpeed = Number(speed);
    if (isNaN(numSpeed) || numSpeed < 0.5 || numSpeed > 2.0) {
      return res.status(400).json({
        success: false,
        error: 'Speaking speed must be a number between 0.5 and 2.0.'
      });
    }
  }

  // 7. Validate Pitch boundary (-50 to +50)
  if (pitch !== undefined) {
    const numPitch = Number(pitch);
    if (isNaN(numPitch) || numPitch < -50 || numPitch > 50) {
      return res.status(400).json({
        success: false,
        error: 'Voice pitch must be an integer between -50 and 50.'
      });
    }
  }

  // Sanitized text attached to request
  req.sanitizedText = trimmedText;
  next();
}

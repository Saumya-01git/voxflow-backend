import { SUPPORTED_LANGUAGES, SUPPORTED_VOICES } from '../data/voices.js';

/**
 * Controller: Get all supported voices & languages
 * GET /api/voices
 */
export function getVoices(req, res) {
  const { language } = req.query;

  let voices = SUPPORTED_VOICES;
  if (language) {
    voices = SUPPORTED_VOICES.filter((v) => v.language === language);
  }

  res.status(200).json({
    success: true,
    count: voices.length,
    languages: SUPPORTED_LANGUAGES,
    voices
  });
}

import googleTTS from 'google-tts-api';
import { logger } from '../utils/logger.js';

// Language code normalizer for TTS engine
const LANG_MAP = {
  'en-US': 'en',
  'en-GB': 'en',
  'hi-IN': 'hi',
  'gu-IN': 'gu',
  'mr-IN': 'mr',
  'es-ES': 'es',
  'fr-FR': 'fr',
  'de-DE': 'de'
};

/**
 * Synthesize speech from text using the integrated TTS provider
 * Handles single/multi-sentence synthesis with seamless buffer concatenation
 * 
 * @param {Object} params { text, language, voice, speed, pitch }
 * @returns {Promise<{ audioBuffer: Buffer, duration: number, format: string }>}
 */
export async function synthesizeAudio({ text, language, voice, speed = 1.0, pitch = 0 }) {
  const ttsLang = LANG_MAP[language] || 'en';
  const isSlow = speed < 0.85;

  logger.tts(`Synthesizing speech: [lang: ${ttsLang}] [voice: ${voice}] [speed: ${speed}x]`);

  try {
    let combinedBuffer;

    if (text.length <= 200) {
      // Direct single-request synthesis for short text
      const base64Audio = await googleTTS.getAudioBase64(text, {
        lang: ttsLang,
        slow: isSlow,
        host: 'https://translate.google.com',
        timeout: 10000
      });
      combinedBuffer = Buffer.from(base64Audio, 'base64');
    } else {
      // Chunked synthesis for longer text blocks up to 2000 characters
      const results = await googleTTS.getAllAudioBase64(text, {
        lang: ttsLang,
        slow: isSlow,
        host: 'https://translate.google.com',
        timeout: 15000,
        splitPunct: '.,!?:;।'
      });

      const bufferChunks = results.map((item) => Buffer.from(item.base64, 'base64'));
      combinedBuffer = Buffer.concat(bufferChunks);
    }

    const words = text.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(1, Math.round(words / (2.5 * speed)));

    return {
      audioBuffer: combinedBuffer,
      format: 'mp3',
      duration: estimatedDuration
    };
  } catch (error) {
    logger.error(`TTS provider failed for [${ttsLang}]:`, error.message);
    throw new Error(`Speech synthesis provider error: ${error.message}`);
  }
}

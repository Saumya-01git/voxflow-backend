import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import googleTTS from 'google-tts-api';
import { logger } from '../utils/logger.js';

// Fallback Language code normalizer for Google TTS
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
 * Synthesize speech from text using Microsoft Neural TTS voices
 * Generates truly distinct human voices (Jenny, Guy, Aria, Swara, Madhur, Elvira, etc.)
 * with automatic fallback to Google TTS.
 * 
 * @param {Object} params { text, language, voice, speed, pitch }
 * @returns {Promise<{ audioBuffer: Buffer, duration: number, format: string }>}
 */
export async function synthesizeAudio({ text, language, voice, speed = 1.0, pitch = 0 }) {
  logger.tts(`Synthesizing speech for persona: [voice: ${voice}] [lang: ${language}] [speed: ${speed}x]`);

  // 1. Primary Engine: MsEdgeTTS for truly distinct Male/Female neural voice personas
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Format rate and pitch adjustments for neural engine
    const ratePercentage = speed !== 1.0 ? `${Math.round((speed - 1) * 100)}%` : '+0%';
    const pitchPercentage = pitch !== 0 ? `${pitch > 0 ? '+' : ''}${pitch}%` : '+0%';

    const streamResult = tts.toStream(text, {
      rate: ratePercentage,
      pitch: pitchPercentage
    });

    const stream = streamResult.readable || streamResult.audioStream || streamResult;
    const chunks = [];

    const audioBuffer = await new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });

    if (audioBuffer && audioBuffer.length > 0) {
      logger.info(`Generated distinct neural audio: ${voice} (${audioBuffer.length} bytes)`);
      const words = text.trim().split(/\s+/).length;
      return {
        audioBuffer,
        format: 'mp3',
        duration: Math.max(1, Math.round(words / (2.5 * speed)))
      };
    }
  } catch (edgeError) {
    logger.warn(`Neural TTS engine error for ${voice}, falling back to Google TTS:`, edgeError.message);
  }

  // 2. Secondary Fallback Engine: Google TTS
  const ttsLang = LANG_MAP[language] || 'en';
  const isSlow = speed < 0.85;

  try {
    let combinedBuffer;

    if (text.length <= 200) {
      const base64Audio = await googleTTS.getAudioBase64(text, {
        lang: ttsLang,
        slow: isSlow,
        host: 'https://translate.google.com',
        timeout: 10000
      });
      combinedBuffer = Buffer.from(base64Audio, 'base64');
    } else {
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
    return {
      audioBuffer: combinedBuffer,
      format: 'mp3',
      duration: Math.max(1, Math.round(words / (2.5 * speed)))
    };
  } catch (error) {
    logger.error(`Both TTS engines failed:`, error.message);
    throw new Error(`Speech synthesis provider error: ${error.message}`);
  }
}

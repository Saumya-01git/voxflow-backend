/**
 * Simple standardized logger utility
 */
export const logger = {
  info: (msg, ...args) => console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, ...args),
  tts: (msg, ...args) => console.log(`[TTS-ENGINE] [${new Date().toISOString()}] ${msg}`, ...args)
};

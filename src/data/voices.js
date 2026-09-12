export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', native: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'Hindi (India)', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (India)', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (India)', native: 'मराठी', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Spain)', native: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (France)', native: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Germany)', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'en-GB', name: 'English (UK)', native: 'British English', flag: '🇬🇧' }
];

export const SUPPORTED_VOICES = [
  // English (US)
  { id: 'en-US-JennyNeural', name: 'Jenny', language: 'en-US', gender: 'Female', description: 'Friendly, warm & conversational' },
  { id: 'en-US-GuyNeural', name: 'Guy', language: 'en-US', gender: 'Male', description: 'Deep, clear & professional' },
  { id: 'en-US-AriaNeural', name: 'Aria', language: 'en-US', gender: 'Female', description: 'Expressive, journalistic & confident' },

  // Hindi (India)
  { id: 'hi-IN-SwaraNeural', name: 'Swara', language: 'hi-IN', gender: 'Female', description: 'Sweet, natural & melodious Hindi' },
  { id: 'hi-IN-MadhurNeural', name: 'Madhur', language: 'hi-IN', gender: 'Male', description: 'Articulate, energetic Hindi' },

  // Gujarati (India)
  { id: 'gu-IN-DhwaniNeural', name: 'Dhwani', language: 'gu-IN', gender: 'Female', description: 'Authentic & clear Gujarati' },
  { id: 'gu-IN-NiranjanNeural', name: 'Niranjan', language: 'gu-IN', gender: 'Male', description: 'Warm & formal Gujarati' },

  // Marathi (India)
  { id: 'mr-IN-AarohiNeural', name: 'Aarohi', language: 'mr-IN', gender: 'Female', description: 'Lyrical, native Marathi cadence' },
  { id: 'mr-IN-ManoharNeural', name: 'Manohar', language: 'mr-IN', gender: 'Male', description: 'Crisp & steady Marathi' },

  // Spanish (Spain)
  { id: 'es-ES-ElviraNeural', name: 'Elvira', language: 'es-ES', gender: 'Female', description: 'Standard Castilian Spanish' },
  { id: 'es-ES-AlvaroNeural', name: 'Alvaro', language: 'es-ES', gender: 'Male', description: 'Rich, natural Castilian Spanish' },

  // French (France)
  { id: 'fr-FR-DeniseNeural', name: 'Denise', language: 'fr-FR', gender: 'Female', description: 'Refined Parisian French' },
  { id: 'fr-FR-HenriNeural', name: 'Henri', language: 'fr-FR', gender: 'Male', description: 'Deep, articulate French' },

  // German (Germany)
  { id: 'de-DE-KatjaNeural', name: 'Katja', language: 'de-DE', gender: 'Female', description: 'Crisp & natural Standard German' },
  { id: 'de-DE-ConradNeural', name: 'Conrad', language: 'de-DE', gender: 'Male', description: 'Authoritative, clear German' },

  // English (UK)
  { id: 'en-GB-SoniaNeural', name: 'Sonia', language: 'en-GB', gender: 'Female', description: 'Warm British RP accent' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', language: 'en-GB', gender: 'Male', description: 'Modern, engaging British voice' }
];

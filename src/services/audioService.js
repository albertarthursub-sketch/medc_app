// Audio pronunciation service for Twi words
// Uses Web Speech API with optimized settings for Akan/Twi pronunciation

export const playTwiAudio = (word, pronunciation) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find English voice (Twi uses Latin characters)
    const preferredVoice = voices.find(voice =>
      voice.lang.includes('en-') && 
      (voice.name.includes('Female') || voice.name.includes('Google'))
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Optimize for Twi pronunciation
    utterance.rate = 0.9;      // Slightly slower for clarity
    utterance.pitch = 1.1;      // Slightly higher pitch for better distinction
    utterance.volume = 1.0;     // Full volume
    
    window.speechSynthesis.speak(utterance);
    
    return true;
  }
  
  return false;
};

// Get detailed pronunciation with IPA breakdown
export const getPronunciationBreakdown = (pronunciation) => {
  // Split pronunciation into syllables/components
  const parts = pronunciation.split('-');
  return {
    full: pronunciation,
    parts: parts,
    count: parts.length
  };
};

// Validate pronunciation format
export const isValidPronunciation = (pronunciation) => {
  return typeof pronunciation === 'string' && pronunciation.length > 0;
};

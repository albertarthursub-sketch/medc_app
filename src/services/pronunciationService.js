// Pronunciation Service
// Provides high-quality Twi pronunciation using improved browser TTS

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Play word using Web Speech API with proper voice selection
export const playWord = async (twiWord, pronunciation) => {
  try {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(twiWord);
      
      // Load voices
      let voices = window.speechSynthesis.getVoices();
      
      // If voices not loaded yet, wait for them
      if (voices.length === 0) {
        await new Promise(resolve => {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve();
          };
        });
      }
      
      // Prioritize African voices for authentic Twi pronunciation
      let selectedVoice = voices.find(v => {
        const lang = v.lang.toLowerCase();
        return lang.includes('zu') ||     // Zulu (South Africa)
               lang.includes('af-za') ||  // Afrikaans South Africa
               lang.includes('en-za') ||  // South African English
               lang.includes('en-gb');    // British English (neutral)
      });
      
      // Fallback to any voice with good quality
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
      }
      
      // Set pronunciation parameters
      utterance.rate = 0.75;      // Slower for Twi clarity
      utterance.pitch = 1.0;      // Normal pitch
      utterance.volume = 1.0;     // Full volume
      
      // Speak
      window.speechSynthesis.speak(utterance);
      
      return true;
    } else {
      console.warn('Speech Synthesis not supported');
      return false;
    }
  } catch (error) {
    console.error('Error playing word:', error);
    return false;
  }
};

// Cache pronunciations locally
export const cachePronunciation = (twiWord, audioContent) => {
  try {
    const cache = JSON.parse(localStorage.getItem('pronunciationCache') || '{}');
    cache[twiWord] = audioContent;
    localStorage.setItem('pronunciationCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching pronunciation:', error);
  }
};

// Get cached pronunciation
export const getCachedPronunciation = (twiWord) => {
  try {
    const cache = JSON.parse(localStorage.getItem('pronunciationCache') || '{}');
    return cache[twiWord] || null;
  } catch (error) {
    console.error('Error getting cached pronunciation:', error);
    return null;
  }
};

// Clear pronunciation cache
export const clearPronunciationCache = () => {
  localStorage.removeItem('pronunciationCache');
};

export default {
  playWord,
  cachePronunciation,
  getCachedPronunciation,
  clearPronunciationCache,
};

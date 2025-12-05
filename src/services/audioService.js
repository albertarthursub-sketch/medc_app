// Audio Service
// Provides Twi pronunciation using Web Speech API (native browser TTS)
// No external API dependencies - works completely offline

// Check if browser supports Web Speech API
const supportsWebSpeechAPI = () => {
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
  const speechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
  return !!(SpeechSynthesisUtterance && speechSynthesis);
};

// Get best available voice for Twi
const getOptimalVoice = () => {
  if (!supportsWebSpeechAPI()) return null;
  
  let voices = window.speechSynthesis?.getVoices?.() || [];
  
  // If voices not loaded yet, return null and let the main function retry
  if (voices.length === 0) {
    return null;
  }
  
  // Preference order for Twi pronunciation:
  // 1. African locale voices (close to West African)
  // 2. Male voices (often clearer for African languages)
  // 3. Default voice as fallback
  
  const preferredVoices = [
    // African locales
    ...voices.filter(v => v.lang.includes('ak')), // Akan (closest to Twi)
    ...voices.filter(v => v.lang.includes('zu')), // Zulu (African)
    ...voices.filter(v => v.lang.includes('xh')), // Xhosa (African)
    ...voices.filter(v => v.lang.includes('fr-FR')), // French (West African compatibility)
    ...voices.filter(v => v.lang.includes('en-GB')), // British English (clear pronunciation)
    ...voices.filter(v => v.lang.includes('en-US')), // US English
  ];
  
  return preferredVoices.length > 0 ? preferredVoices[0] : (voices.length > 0 ? voices[0] : null);
};

// Play Twi word using Web Speech API
const playTwiWithWebSpeech = async (twiWord) => {
  return new Promise((resolve) => {
    try {
      if (!supportsWebSpeechAPI()) {
        console.warn('❌ Web Speech API not supported in this browser');
        resolve(false);
        return;
      }
      
      // Cancel any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new (window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance)(twiWord);
      
      // Optimize for Twi pronunciation
      utterance.rate = 0.8; // Slower for clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0; // Max volume
      utterance.lang = 'twi'; // Ensure Twi language
      
      // Try to use optimal voice
      const voice = getOptimalVoice();
      if (voice && voice.name) {
        utterance.voice = voice;
        console.log(`🎤 Using voice: ${voice.name}`);
      } else {
        console.log('🎤 Using default system voice');
      }
      
      // Set a timeout to resolve after speech completes
      let hasResolved = false;
      const timeoutId = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          console.log('✅ Speech completed (timeout)');
          resolve(true);
        }
      }, 3000); // 3 second timeout
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🔊 Speech started');
      };
      
      utterance.onend = () => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeoutId);
          console.log('✅ Speech ended successfully');
          resolve(true);
        }
      };
      
      utterance.onerror = (error) => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeoutId);
          console.error('❌ Speech error:', error.error);
          resolve(false);
        }
      };
      
      // Speak the word
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('❌ Error with Web Speech API:', error);
      resolve(false);
    }
  });
};

// Cache audio preference (not URLs anymore, just metadata)
export const cacheAudioPreference = (twiWord, success) => {
  try {
    const cache = JSON.parse(localStorage.getItem('audioPreference') || '{}');
    cache[twiWord] = {
      lastAttempt: Date.now(),
      success: success,
    };
    localStorage.setItem('audioPreference', JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching audio preference:', error);
  }
};

// Clear audio cache
export const clearAudioCache = () => {
  localStorage.removeItem('audioPreference');
  localStorage.removeItem('audioCache');
};

// Main function: Play Twi word using Web Speech API
export const playTwiWord = async (twiWord) => {
  try {
    console.log('🔊 Playing Twi word:', twiWord);
    
    if (!supportsWebSpeechAPI()) {
      console.warn('⚠️ Web Speech API not supported. Cannot play audio.');
      return false;
    }
    
    // Ensure voices are loaded
    if (window.speechSynthesis && !window.speechSynthesis.getVoices().length) {
      await new Promise(resolve => {
        const handleVoicesChanged = () => {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve();
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        setTimeout(resolve, 500);
      });
    }
    
    const success = await playTwiWithWebSpeech(twiWord);
    cacheAudioPreference(twiWord, success);
    
    console.log(`🎵 Play result: ${success}`);
    return success;
  } catch (error) {
    console.error('❌ Error playing Twi word:', error);
    return false;
  }
};

// Ensure voices are loaded (some browsers load voices asynchronously)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('🎤 Available voices updated');
  };
}

export default {
  playTwiWord,
  clearAudioCache,
  supportsWebSpeechAPI,
  getOptimalVoice,
};

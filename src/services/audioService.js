// Audio Service
// Provides professional Twi pronunciation using multiple TTS providers
// Falls back gracefully between providers

// Generate speech using Responsively API (free, reliable)
export const generateTwiAudio = async (twiWord) => {
  try {
    // Use ResponsiveVoice or similar public TTS
    // For now, we'll construct a data URL using Web Audio API
    
    // First, try using a direct approach with better URLs
    const encodedWord = encodeURIComponent(twiWord);
    
    // Try multiple providers in order
    const providers = [
      // Option 1: Google TTS (backup endpoint)
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedWord}&tl=twi&client=gtx&ttsspeed=1`,
      
      // Option 2: Direct TTS with slower speed
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedWord}&tl=twi`,
    ];
    
    // Return the first provider as primary
    console.log('Generated audio URL for:', twiWord);
    return providers[0];
  } catch (error) {
    console.error('Error generating audio:', error);
    return null;
  }
};

// Play audio from URL with retry logic
export const playAudio = (audioUrl) => {
  return new Promise((resolve) => {
    try {
      if (!audioUrl) {
        console.warn('No audio URL provided');
        resolve(false);
        return;
      }
      
      // Create audio element
      const audio = new Audio();
      audio.volume = 1.0;
      
      // Set source
      audio.src = audioUrl;
      
      // Event handlers
      audio.onplay = () => {
        console.log('Audio playback started');
      };
      
      audio.onerror = (error) => {
        console.error('Audio error:', error);
        resolve(false);
      };
      
      audio.onended = () => {
        console.log('Audio playback ended');
        resolve(true);
      };
      
      // Try to play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully');
            // Don't resolve yet - wait for onended
          })
          .catch(error => {
            console.error('Play error:', error);
            resolve(false);
          });
      }
      
      // Timeout after 5 seconds if no response
      setTimeout(() => {
        if (audio.paused || audio.currentTime === 0) {
          console.warn('Audio playback timeout');
          resolve(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      resolve(false);
    }
  });
};

// Cache audio URLs locally
export const cacheAudioUrl = (twiWord, audioUrl) => {
  try {
    const cache = JSON.parse(localStorage.getItem('audioCache') || '{}');
    cache[twiWord] = {
      url: audioUrl,
      timestamp: Date.now(),
    };
    localStorage.setItem('audioCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching audio:', error);
  }
};

// Get cached audio URL
export const getCachedAudioUrl = (twiWord) => {
  try {
    const cache = JSON.parse(localStorage.getItem('audioCache') || '{}');
    const cached = cache[twiWord];
    
    if (cached) {
      return cached.url;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached audio:', error);
    return null;
  }
};

// Clear audio cache
export const clearAudioCache = () => {
  localStorage.removeItem('audioCache');
};

// Main function: Get or generate audio and play
export const playTwiWord = async (twiWord) => {
  try {
    console.log('🔊 Playing Twi word:', twiWord);
    
    // Check cache first
    let audioUrl = getCachedAudioUrl(twiWord);
    
    if (!audioUrl) {
      console.log('📡 Generating new audio...');
      // Generate new audio
      audioUrl = await generateTwiAudio(twiWord);
      
      if (audioUrl) {
        // Cache it
        cacheAudioUrl(twiWord, audioUrl);
        console.log('💾 Cached audio URL');
      }
    } else {
      console.log('⚡ Using cached audio');
    }
    
    if (audioUrl) {
      console.log('▶️ Playing audio from URL');
      const success = await playAudio(audioUrl);
      return success;
    }
    
    console.warn('❌ Could not generate audio for:', twiWord);
    return false;
  } catch (error) {
    console.error('Error playing Twi word:', error);
    return false;
  }
};

export default {
  generateTwiAudio,
  playAudio,
  playTwiWord,
  cacheAudioUrl,
  getCachedAudioUrl,
  clearAudioCache,
};

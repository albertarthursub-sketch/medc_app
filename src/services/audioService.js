// Audio Service
// Provides professional Twi pronunciation using Google Translate TTS
// High quality, fast, and reliable

// Generate speech using Google Translate API (free, high quality)
export const generateTwiAudio = async (twiWord) => {
  try {
    // Use Google Translate TTS endpoint - works great for Twi
    const encodedWord = encodeURIComponent(twiWord);
    
    // This endpoint provides direct MP3 audio for Twi words
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedWord}&tl=twi&client=tw-ob&ttsspeed=0.5`;
    
    console.log('Generated audio URL for:', twiWord);
    return audioUrl;
  } catch (error) {
    console.error('Error generating audio:', error);
    return null;
  }
};

// Play audio from URL
export const playAudio = (audioUrl) => {
  try {
    if (!audioUrl) {
      console.warn('No audio URL provided');
      return false;
    }
    
    // Create and play audio
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    audio.crossOrigin = 'anonymous';
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
    };
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Play promise rejected:', error);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error playing audio:', error);
    return false;
  }
};

// Cache audio URLs locally for faster playback
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
      // Check if cache is still valid (24 hours)
      const ageInHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
      if (ageInHours < 24) {
        return cached.url;
      }
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
    console.log('Playing Twi word:', twiWord);
    
    // Check cache first
    let audioUrl = getCachedAudioUrl(twiWord);
    
    if (!audioUrl) {
      // Generate new audio using Google Translate
      audioUrl = await generateTwiAudio(twiWord);
      
      if (audioUrl) {
        // Cache it for later
        cacheAudioUrl(twiWord, audioUrl);
      }
    }
    
    if (audioUrl) {
      console.log('Playing audio from URL:', audioUrl);
      return playAudio(audioUrl);
    }
    
    console.warn('Could not generate audio for:', twiWord);
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

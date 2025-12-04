// Pronunciation Service
// Provides high-quality Twi pronunciation using Google Text-to-Speech API

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Convert Twi text to speech using Google Cloud TTS
export const getTwiPronunciation = async (twiWord, language = 'twi-GH') => {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('Google API key not configured for TTS');
      return null;
    }

    // Use Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            text: twiWord,
          },
          voice: {
            languageCode: language, // Twi language code
            name: 'af-ZA-Standard-A', // African voice (closest to Twi)
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: 0,
            speakingRate: 0.9, // Slightly slower for clarity
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('TTS error:', error);
      return null;
    }

    const data = await response.json();
    // audioContent is base64 encoded MP3
    return data.audioContent;
  } catch (error) {
    console.error('Error generating pronunciation:', error);
    return null;
  }
};

// Play pronunciation audio
export const playPronunciation = async (twiWord) => {
  try {
    const audioContent = await getTwiPronunciation(twiWord);
    
    if (!audioContent) {
      console.warn('Could not generate pronunciation for:', twiWord);
      return false;
    }

    // Convert base64 to blob
    const binaryString = atob(audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    
    // Create object URL and play
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Audio playback error:', err));
    
    // Clean up URL after playback
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
    
    return true;
  } catch (error) {
    console.error('Error playing pronunciation:', error);
    return false;
  }
};

// Fallback: Use browser Web Speech API as backup
export const playPronunciationFallback = (twiWord, pronunciation) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance with Twi pronunciation guide
    const utterance = new SpeechSynthesisUtterance(twiWord);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find African/Ghanaian voice
    let selectedVoice = voices.find(v => 
      v.lang.startsWith('af') || // Afrikaans (closest)
      v.lang.startsWith('zu') || // Zulu
      v.lang.startsWith('en-ZA') // South African English
    );
    
    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Pronunciation settings
    utterance.rate = 0.8; // Slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    try {
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Fallback TTS error:', error);
      return false;
    }
  }
  
  return false;
};

// Smart pronunciation player - tries TTS first, falls back to Web Speech API
export const playWord = async (twiWord, pronunciation) => {
  try {
    // Try Google TTS first (if API key is configured)
    const ttsSuccess = await playPronunciation(twiWord);
    
    if (ttsSuccess) {
      return true;
    }
    
    // Fallback to Web Speech API
    return playPronunciationFallback(twiWord, pronunciation);
  } catch (error) {
    console.error('Error playing word:', error);
    // Last resort fallback
    return playPronunciationFallback(twiWord, pronunciation);
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
  getTwiPronunciation,
  playPronunciation,
  playPronunciationFallback,
  playWord,
  cachePronunciation,
  getCachedPronunciation,
  clearPronunciationCache,
};

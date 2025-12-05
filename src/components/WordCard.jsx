import { useState } from 'react';
import { playTwiWord } from '../services/audioService';

const WordCard = ({ word, onPlayAudio }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPronunciation = async () => {
    setIsPlaying(true);
    try {
      console.log('🎵 Button clicked for word:', word.word);
      const result = await playTwiWord(word.word);
      console.log('🎵 Play result:', result);
      if (!result) {
        console.warn('⚠️ Audio playback may have failed - check Web Speech API support');
      }
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    } finally {
      // Keep button disabled for a brief moment even after speech completes
      setTimeout(() => {
        setIsPlaying(false);
      }, 200);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Main Word Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
        {/* Word Header */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-2">
              {word.word}
            </h1>
            <div className="h-1 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full"></div>
          </div>
        </div>

        {/* Pronunciation */}
        <div className="mb-6 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Pronunciation</p>
          <p className="text-2xl text-gray-700 font-medium italic">/{word.pronunciation}/</p>
        </div>

        {/* Play Audio Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handlePlayPronunciation}
            disabled={isPlaying}
            title="Click to hear the Twi pronunciation"
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : 'group-hover:animate-pulse'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="font-semibold">{isPlaying ? 'Playing...' : 'Hear it!'}</span>
          </button>
        </div>

        {/* Definition */}
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6">
          <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">English Meaning</p>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">{word.definition}</p>
        </div>

        {/* Example Sentence */}
        {word.example && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">Example in Twi</p>
            <p className="text-xl text-gray-800 italic">{word.example}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;

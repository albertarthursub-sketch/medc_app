import { useState } from 'react';

const WordCard = ({ word, onPlayAudio }) => {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Main Word Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
        {/* Word Header */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-2">
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
            onClick={() => onPlayAudio(word)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg
              className="w-6 h-6 group-hover:animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="font-semibold">Hear it!</span>
          </button>
        </div>

        {/* Definition */}
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 mb-6">
          <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">English Meaning</p>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">{word.definition}</p>
        </div>

        {/* Example Toggle Button */}
        <button
          onClick={() => setShowExample(!showExample)}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-gray-700 font-medium flex items-center justify-center gap-2"
        >
          <span>{showExample ? '🙈 Hide' : '👀 See'} Example</span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${showExample ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Example Section (Expandable) */}
      {showExample && (
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Twi Sentence</p>
              <p className="text-xl md:text-2xl text-gray-800 font-medium mb-4">
                {word.example.twi}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
            <span className="text-2xl">🇬🇧</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">English Translation</p>
              <p className="text-xl md:text-2xl text-gray-600 italic">
                {word.example.english}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCard;

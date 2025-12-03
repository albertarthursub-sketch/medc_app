import { useState } from 'react';
import { searchWords, getAllWords, getWordStats } from '../data/verifiedTwiDictionary';

const WordSearch = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showStats, setShowStats] = useState(true);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchWords(query);
      setSearchResults(results);
      setShowStats(false);
    } else {
      setSearchResults([]);
      setShowStats(true);
    }
  };

  const stats = getWordStats();
  const allWords = getAllWords();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🔍 Word Search</h2>
            <p className="text-sm opacity-90">Explore all {stats.total} Twi words</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-80 transition"
          >
            ✕
          </button>
        </div>

        {/* Search Box */}
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Twi word or English meaning..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg"
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {showStats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-green-600">{stats.easy}</p>
                <p className="text-sm text-green-700 mt-1">Easy Words</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-yellow-600">{stats.intermediate}</p>
                <p className="text-sm text-yellow-700 mt-1">Intermediate</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-red-600">{stats.difficult}</p>
                <p className="text-sm text-red-700 mt-1">Difficult</p>
              </div>

              {/* Show all words */}
              <div className="col-span-3 mt-6">
                <p className="text-gray-600 text-sm uppercase tracking-wider mb-3">All Words</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {allWords.map((word, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{word.word}</p>
                          <p className="text-sm text-gray-600">{word.definition}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          word.category === 'easy' ? 'bg-green-200 text-green-700' :
                          word.category === 'intermediate' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-red-200 text-red-700'
                        }`}>
                          {word.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 italic">/{word.pronunciation}/</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
              {searchResults.map((word, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{word.word}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      word.category === 'easy' ? 'bg-green-200 text-green-700' :
                      word.category === 'intermediate' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-red-200 text-red-700'
                    }`}>
                      {word.category}
                    </span>
                  </div>
                  <p className="text-gray-600 italic text-sm mb-2">/{word.pronunciation}/</p>
                  <p className="text-gray-700 font-medium text-lg">{word.definition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No words found matching "{searchQuery}"</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-3xl text-center text-sm text-gray-600">
          📚 Complete Twi Dictionary with {stats.total} authentic words
        </div>
      </div>
    </div>
  );
};

export default WordSearch;

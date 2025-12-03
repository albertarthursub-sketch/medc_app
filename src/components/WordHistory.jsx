const WordHistory = ({ words, onSelectWord, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">📚 Word Collection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Word List */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4">
          <div className="grid gap-3">
            {words.map((word, index) => (
              <button
                key={word.id}
                onClick={() => {
                  onSelectWord(index);
                  onClose();
                }}
                className="bg-gradient-to-br from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 rounded-2xl p-4 text-left transition-all duration-200 transform hover:scale-[1.02] border-2 border-transparent hover:border-pink-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{word.word}</h3>
                  <span className="text-xs bg-pink-200 text-pink-800 px-3 py-1 rounded-full font-semibold">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1 italic">/{word.pronunciation}/</p>
                <p className="text-lg font-semibold text-gray-700">{word.definition}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordHistory;

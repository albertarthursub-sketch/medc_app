const Navigation = ({ currentIndex, totalWords, onPrevious, onNext, onShowHistory, onGenerateNew, isLoading, onChangeCategory, currentCategory }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-3 py-2">
        {/* Progress Indicator */}
        <div className="text-center mb-2">
          <p className="text-xs text-gray-600">
            Word <span className="font-bold text-pink-500">{currentIndex + 1}</span> of {totalWords}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-gradient-to-r from-pink-500 to-orange-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={onShowHistory}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden sm:inline">All</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex === totalWords - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Second Row of Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onChangeCategory}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full font-medium transition-colors duration-200"
          >
            <span>🎓</span>
            <span className="hidden sm:inline">Level</span>
          </button>

          <button
            onClick={onGenerateNew}
            disabled={isLoading}
            className="flex-1 py-1.5 text-xs bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span>{isLoading ? '⏳' : '✨'}</span>
            <span className="hidden sm:inline">{isLoading ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

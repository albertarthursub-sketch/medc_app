import { useState } from 'react';

const PracticeMode = ({ words, selectedCategory, onClose, onEarnPoints }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [skipped, setSkipped] = useState(0);
  const [correct, setCorrect] = useState(0);

  const categoryWords = words.filter(w => w.category === selectedCategory);

  if (categoryWords.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <p className="text-lg text-gray-700">No words available in this category</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const currentWord = categoryWords[currentWordIndex];

  const handleCheckAnswer = () => {
    const cleanUserAnswer = userAnswer.toLowerCase().trim();
    
    // Handle multiple answers separated by slashes (e.g. "Woman/Girl")
    const possibleAnswers = currentWord.definition
      .split('/')
      .map(answer => answer.toLowerCase().trim())
      .filter(answer => answer.length > 0);

    const isCorrect = possibleAnswers.includes(cleanUserAnswer);

    if (isCorrect) {
      setFeedback('✅ Correct! +10 Ghana Cedis');
      setCorrect(correct + 1);
      onEarnPoints(10);
    } else {
      setFeedback(`❌ Wrong! It means: ${currentWord.definition}`);
    }
    setShowFeedback(true);
  };

  const handleSkip = () => {
    setFeedback(`⏭️ Skipped! It means: ${currentWord.definition}`);
    setSkipped(skipped + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentWordIndex < categoryWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserAnswer('');
      setFeedback('');
      setShowFeedback(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">🎮 Practice Mode</h2>
          <p className="text-sm">Correct: {correct} | Skipped: {skipped}</p>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:opacity-80 transition"
        >
          ✕
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        {/* Word Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 w-full max-w-md">
          <p className="text-center text-gray-500 mb-4">
            Question {currentWordIndex + 1} of {categoryWords.length}
          </p>

          {/* Twi Word */}
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              {currentWord.word}
            </p>
            <p className="text-gray-500 text-sm mt-2">/{currentWord.pronunciation}/</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / categoryWords.length) * 100}%` }}
            ></div>
          </div>

          {/* Input Box */}
          {!showFeedback ? (
            <div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                placeholder="Type the English meaning..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center"
                autoFocus
              />
              <p className="text-center text-gray-500 text-sm mt-2">Press Enter or click Check</p>
            </div>
          ) : (
            <div className={`p-4 rounded-xl text-center font-semibold text-lg ${
              feedback.includes('✅') ? 'bg-green-100 text-green-700' :
              feedback.includes('❌') ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {feedback}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full max-w-md">
          {!showFeedback ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-400 transition"
              >
                ⏭️ Skip
              </button>
              <button
                onClick={handleCheckAnswer}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
              >
                ✓ Check
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
            >
              {currentWordIndex < categoryWords.length - 1 ? '→ Next' : '✓ Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeMode;

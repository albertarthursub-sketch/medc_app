import { useState } from 'react';

const JollofQuiz = ({ onGhanaChoice, onNigeriaChoice }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice) => {
    setSelected(choice);
    setShowResult(true);
    setTimeout(() => {
      if (choice === 'ghana') {
        onGhanaChoice();
      } else {
        onNigeriaChoice();
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">The Ultimate Question 🍲</h1>

        {/* Question */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-8 mt-6">
          <p className="text-xl font-bold text-gray-800">
            Which Jollof Rice is superior?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {/* Ghana Option */}
          <button
            onClick={() => handleChoice('ghana')}
            disabled={showResult}
            className={`w-full p-6 rounded-2xl font-bold text-lg transition transform ${
              selected === 'ghana'
                ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white scale-105 shadow-lg'
                : 'bg-gradient-to-r from-green-100 to-yellow-100 text-gray-800 hover:shadow-md'
            } ${showResult && selected !== 'ghana' ? 'opacity-50' : ''}`}
          >
            🇬🇭 Ghana Jollof
            <p className="text-sm mt-1">The superior choice ✨</p>
          </button>

          {/* Nigeria Option */}
          <button
            onClick={() => handleChoice('nigeria')}
            disabled={showResult}
            className={`w-full p-6 rounded-2xl font-bold text-lg transition transform ${
              selected === 'nigeria'
                ? 'bg-gradient-to-r from-green-700 to-white text-white scale-105 shadow-lg'
                : 'bg-gradient-to-r from-green-100 to-white text-gray-800 hover:shadow-md'
            } ${showResult && selected !== 'nigeria' ? 'opacity-50' : ''}`}
          >
            🇳🇬 Nigerian Jollof
            <p className="text-sm mt-1">Interesting choice... 👀</p>
          </button>
        </div>

        {/* Result Message */}
        {showResult && selected === 'ghana' && (
          <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-4 animate-bounce">
            <p className="text-green-700 font-bold text-lg">
              🎊 Excellent taste! +50 GHS Bonus! 🎊
            </p>
            <p className="text-green-600 text-sm mt-2">You're a true Ghanaian! 🇬🇭</p>
          </div>
        )}

        {showResult && selected === 'nigeria' && (
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4 animate-pulse">
            <p className="text-red-700 font-bold text-lg">
              💔 I am breaking up with you 2pm tomorrow hahaha 💔
            </p>
            <p className="text-red-600 text-sm mt-2">That's what you get for choosing Nigerian Jollof! 😭</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JollofQuiz;

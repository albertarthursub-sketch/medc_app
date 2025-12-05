import { useState, useEffect } from 'react';
import { goofyMessages } from '../data/twiWords';

const WelcomeScreen = ({ onContinue, onShowJollofQuiz }) => {
  const [message, setMessage] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Pick a random goofy message
    const randomMessage = goofyMessages[Math.floor(Math.random() * goofyMessages.length)];
    setMessage(randomMessage);
  }, []);

  const handleContinue = () => {
    setFadeOut(true);
    setTimeout(() => {
      // Show Jollof quiz first, then onContinue after
      onShowJollofQuiz();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Photo Container */}
      <div className="mb-8 relative">
        <div className="w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-300">
          <img
            src="/couple-photo.jpeg"
            alt="Us with our pets"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative hearts */}
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce">💕</div>
        <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce delay-100">🐕</div>
        <div className="absolute -top-4 -left-4 text-3xl animate-bounce delay-200">🐱</div>
      </div>

      {/* Goofy Message */}
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
        <p className="text-xl md:text-2xl text-gray-800 text-center font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
      >
        Let's Learn Twi! 🎉
      </button>

      {/* Small credit */}
      <p className="mt-6 text-gray-500 text-sm">Made with ❤️ for the best language learner</p>
    </div>
  );
};

export default WelcomeScreen;

import { useState, useEffect } from 'react';

const RewardScreen = ({ cedis, onContinueToJollof }) => {
  const [celebration, setCelebration] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCelebration(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-red-100 to-green-100 flex items-center justify-center z-50">
      {/* Confetti Emojis Background */}
      {celebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `bounce ${1 + Math.random()}s infinite`,
                animationDelay: `${Math.random()}s`,
              }}
            >
              🇬🇭
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4 z-10">
        {/* Ghana Flag Emojis */}
        <div className="text-5xl mb-4 flex justify-center gap-4">
          🇬🇭 🇬🇭 🇬🇭
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 mb-2">
          Albert owes 100<br />Ghana cedis! 🎉
        </h1>

        {/* Celebration Message */}
        <p className="text-lg text-gray-700 mt-6 mb-4 font-medium">
          Incredible! You've earned <span className="text-2xl font-bold text-green-600">{cedis} GHS</span>
        </p>

        <p className="text-gray-600 mb-8">
          You're a true Twi master! Now let's celebrate with something important... 🍲
        </p>

        {/* Jollof Divider */}
        <div className="border-t-2 border-dashed border-gray-300 my-6"></div>

        {/* Jollof Teaser */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            But wait! Before we celebrate, there's one crucial question...
          </p>
          <p className="text-2xl mt-2">🍲 🆚 🍲</p>
        </div>

        {/* Button */}
        <button
          onClick={onContinueToJollof}
          className="w-full py-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white rounded-full font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
        >
          Answer the Jollof Question! 🇬🇭
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default RewardScreen;

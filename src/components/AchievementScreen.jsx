import { useState, useEffect } from 'react';
import { getBadgeByWordCount } from '../services/userService';

const AchievementScreen = ({ 
  userName, 
  pointsEarned, 
  wordsPracticed, 
  totalWordsPracticed, 
  totalPointsEarned,
  newBadgeUnlocked,
  onContinue 
}) => {
  const [celebration, setCelebration] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const currentBadge = getBadgeByWordCount(totalWordsPracticed);
  const previousBadge = newBadgeUnlocked ? 'upgrade' : null;

  useEffect(() => {
    const timer = setTimeout(() => setCelebration(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setFadeOut(true);
    setTimeout(() => {
      onContinue();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center z-50 transition-opacity duration-300 overflow-hidden ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Confetti Background */}
      {celebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `bounce ${1 + Math.random() * 0.5}s infinite`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 z-10 transform transition-all duration-300 ${fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Practice Complete!
          </h1>
          <p className="text-xl text-gray-700 font-semibold">Great job, {userName}! 🎯</p>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 space-y-4">
          {/* Points Earned */}
          <div className="flex items-center justify-between border-b-2 border-purple-200 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <span className="font-semibold text-gray-700">Points This Session</span>
            </div>
            <span className="text-2xl font-bold text-green-600">+{pointsEarned}</span>
          </div>

          {/* Words Practiced */}
          <div className="flex items-center justify-between border-b-2 border-purple-200 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <span className="font-semibold text-gray-700">Words Practiced Today</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{wordsPracticed}</span>
          </div>

          {/* Total Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏁</span>
              <span className="font-semibold text-gray-700">Total Progress</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-orange-600">{totalPointsEarned} GHS</p>
            </div>
          </div>
        </div>

        {/* Badge Section */}
        <div className="border-t-2 border-dashed border-gray-300 pt-6 mb-6">
          <p className="text-center text-sm font-semibold text-gray-600 mb-4">YOUR CURRENT BADGE</p>
          
          <div className="flex flex-col items-center">
            <div className={`bg-gradient-to-br ${currentBadge.color} p-6 rounded-full mb-4 shadow-xl transform hover:scale-110 transition-transform duration-300`}>
              <span className="text-6xl">{currentBadge.icon}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{currentBadge.name}</h3>
            <p className="text-center text-sm text-gray-600 mb-3">{currentBadge.description}</p>
            
            {/* Progress Indicator */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`bg-gradient-to-r ${currentBadge.color} h-3 rounded-full transition-all duration-500`}
                style={{
                  width: `${Math.min((totalWordsPracticed / currentBadge.maxThreshold) * 100, 100)}%`
                }}
              ></div>
            </div>
            
            <p className="text-xs text-gray-500">
              {totalWordsPracticed} / {currentBadge.maxThreshold === Infinity ? '∞' : currentBadge.maxThreshold} words
            </p>
          </div>

          {/* Badge Unlock Message */}
          {newBadgeUnlocked && (
            <div className="mt-4 bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 text-center animate-pulse">
              <p className="text-sm font-bold text-yellow-800">
                🎊 New Badge Unlocked! You're making amazing progress!
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Continue Learning 🚀
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-40px) rotate(180deg); 
            opacity: 0.7; 
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementScreen;

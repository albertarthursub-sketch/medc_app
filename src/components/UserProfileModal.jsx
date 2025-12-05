import { useState } from 'react';
import { createUserProfile, generateUserId } from '../services/userService';

const UserProfileModal = ({ onUserCreated }) => {
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    // Create unique user ID
    const userId = generateUserId();
    
    // Create user profile
    const profile = createUserProfile(userId, userName.trim());
    
    // Trigger fade out animation
    setFadeOut(true);
    
    // Call callback after animation
    setTimeout(() => {
      onUserCreated(profile);
    }, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${fadeOut ? 'scale-95' : 'scale-100'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-2">
            Welcome to Twi Quest!
          </h2>
          <p className="text-gray-600">Let's set up your learning profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {/* Motivation Text */}
          <div className="bg-white rounded-2xl p-4 border-2 border-pink-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-bold text-pink-600">💡 Tip:</span> Your profile will track all your achievements, badges, and points!
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-70"
          >
            {isSubmitting ? '✓ Creating Profile...' : 'Start Learning! 🚀'}
          </button>
        </form>

        {/* Features */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-3">You'll unlock:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white rounded-lg p-2 text-center">🥈 <span className="font-semibold">Silver Badge</span></div>
            <div className="bg-white rounded-lg p-2 text-center">🥉 <span className="font-semibold">Bronze Badge</span></div>
            <div className="bg-white rounded-lg p-2 text-center">🏆 <span className="font-semibold">Gold Badge</span></div>
            <div className="bg-white rounded-lg p-2 text-center">👑 <span className="font-semibold">Legend Badge</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;

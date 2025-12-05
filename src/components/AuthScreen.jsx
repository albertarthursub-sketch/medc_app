import { useState } from 'react';
import { registerUser, loginUser } from '../services/firebaseService';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;

      if (isLogin) {
        // Login
        if (!email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        user = await loginUser(email, password);
      } else {
        // Register
        if (!email || !password || !displayName) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        user = await registerUser(email, password, displayName);
      }

      // Trigger fade out
      setFadeOut(true);

      // Call success callback after animation
      setTimeout(() => {
        onAuthSuccess(user);
      }, 300);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100 flex items-center justify-center z-50 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${fadeOut ? 'scale-95' : 'scale-100'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-2">
            {isLogin ? 'Welcome Back!' : 'Join Twi Quest!'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to continue your learning journey'
              : 'Create an account to start learning Twi'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (Registration only) */}
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg transition-colors disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-lg transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-70"
          >
            {loading ? '✓ Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setDisplayName('');
              }}
              disabled={loading}
              className="text-pink-600 font-bold hover:text-orange-600 transition-colors disabled:opacity-70"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-4 border-2 border-pink-200">
          <p className="text-xs text-gray-700 text-center">
            <span className="font-bold">🔒 Secure:</span> Your data is encrypted and stored safely in the cloud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

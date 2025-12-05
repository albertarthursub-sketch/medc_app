import { useState } from 'react';
import { registerUser, signInWithGoogle } from '../services/firebaseService';

const SignUpScreen = ({ onAuthSuccess, onSwitchToLogin }) => {
  const [displayName, setDisplayName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const useTestCredentials = () => {
    setDisplayName('Test User');
    setEmail('test@example.com');
    setPassword('test123456');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!displayName || !email || !password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const user = await registerUser(email, password, displayName);

      onAuthSuccess(user);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      onAuthSuccess(user);
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 414,
      minHeight: '100vh',
      margin: '0 auto',
      position: 'relative',
      background: 'white',
      fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Status Bar */}
      <div style={{ height: 51, padding: '20px 23px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>9:41</div>
        <div style={{ width: 18, height: 7.33, background: 'black', borderRadius: 1.33 }} />
      </div>

      {/* Header */}
      <div style={{ padding: '40px 31px 0 29px' }}>
        <h1 style={{ color: 'black', fontSize: 25, fontWeight: '600', marginBottom: 8 }}>
          Create an account
        </h1>
        <p style={{ color: '#999EA1', fontSize: 14, fontWeight: '600', marginBottom: 45 }}>
          Connect with your friends today!
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          margin: '0 27px 20px',
          padding: '12px',
          background: '#FEE2E2',
          border: '1px solid #EF4444',
          borderRadius: 10,
          color: '#DC2626',
          fontSize: 14,
          fontWeight: '600'
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '0 27px' }}>
        {/* Display Name */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            color: '#4E0189',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
            style={{
              width: '100%',
              height: 41,
              padding: '0 13px',
              background: 'white',
              border: '1px solid #C6C6C6',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: '600',
              color: '#1F1F1F',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4E0189'}
            onBlur={(e) => e.target.style.borderColor = '#C6C6C6'}
          />
        </div>

        {/* Email Address */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            color: '#4E0189',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            style={{
              width: '100%',
              height: 41,
              padding: '0 13px',
              background: 'white',
              border: '1px solid #C6C6C6',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: '600',
              color: '#1F1F1F',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4E0189'}
            onBlur={(e) => e.target.style.borderColor = '#C6C6C6'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 18 }}>
          <label style={{
            display: 'block',
            color: '#4E0189',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please Enter Your Password"
              disabled={loading}
              style={{
                width: '100%',
                height: 41,
                padding: '0 45px 0 13px',
                background: 'white',
                border: '1px solid #C6C6C6',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: '600',
                color: '#1F1F1F',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4E0189'}
              onBlur={(e) => e.target.style.borderColor = '#C6C6C6'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 13,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: 17
        }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: 20,
                height: 20,
                marginRight: 7,
                cursor: 'pointer',
                accentColor: '#000C14'
              }}
            />
            <span style={{ color: '#000C14', fontSize: 14, fontWeight: '600' }}>
              Remember Me
            </span>
          </label>
        </div>

        {/* Test Credentials Button */}
        <button
          type="button"
          onClick={useTestCredentials}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#E8F5E9',
            border: '1px solid #4CAF50',
            borderRadius: 8,
            color: '#2E7D32',
            fontSize: 13,
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: 17,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#C8E6C9';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#E8F5E9';
          }}
        >
          ✓ Use Test Credentials (Test User)
        </button>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: 45,
            background: '#4E0189',
            borderRadius: 10,
            border: 'none',
            color: 'white',
            fontSize: 17,
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 24
          }}
        >
          {loading ? 'Processing...' : 'Sign Up'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          gap: 16
        }}>
          <div style={{ flex: 1, height: 1, background: 'black' }} />
          <span style={{ color: '#999EA1', fontSize: 14, fontWeight: '600' }}>Or With</span>
          <div style={{ flex: 1, height: 1, background: 'black' }} />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            height: 45,
            background: 'white',
            border: '1px solid #CDD1E0',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            marginBottom: 30
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span style={{ color: '#242A31', fontSize: 14, fontWeight: '600' }}>Continue with Google</span>
        </button>
      </form>

      {/* Already have account */}
      <div style={{
        textAlign: 'center',
        padding: '0 27px 30px'
      }}>
        <span style={{ color: '#999EA1', fontSize: 14, fontWeight: '600' }}>
          Already have an account ?
        </span>
        {' '}
        <button
          onClick={onSwitchToLogin}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#4E0189',
            fontSize: 14,
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUpScreen;

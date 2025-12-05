import { useState } from 'react';
import { loginUser, signInWithGoogle } from '../services/firebaseService';

const LoginScreen = ({ onAuthSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const user = await loginUser(email, password);
      onAuthSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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

  const handleGitHubSignIn = async () => {
    setError('GitHub sign-in is not configured yet');
  };

  const handleGitLabSignIn = async () => {
    setError('GitLab sign-in is not configured yet');
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
          Hi, Welcome Back! 👋
        </h1>
        <p style={{ color: '#999EA1', fontSize: 14, fontWeight: '600', marginBottom: 45 }}>
          Hello again, you've been missed!
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
        {/* Email */}
        <div style={{ marginBottom: 12 }}>
          <label style={{
            display: 'block',
            color: '#4E0189',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8
          }}>
            Email
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
        <div style={{ marginBottom: 17 }}>
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

        {/* Remember Me & Forgot Password */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 27
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
          <button
            type="button"
            onClick={() => alert('Password reset functionality coming soon!')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FB344F',
              fontSize: 14,
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Forgot Password
          </button>
        </div>

        {/* Login Button */}
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
          {loading ? 'Processing...' : 'Login'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          gap: 16
        }}>
          <div style={{ flex: 1, height: 0.5, background: 'black' }} />
          <span style={{ color: '#999EA1', fontSize: 14, fontWeight: '600' }}>Or With</span>
          <div style={{ flex: 1, height: 0.5, background: 'black' }} />
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: 'flex', gap: 13, marginBottom: 50 }}>
          {/* GitHub Button */}
          <button
            type="button"
            onClick={handleGitHubSignIn}
            disabled={loading}
            style={{
              flex: 1,
              height: 45,
              background: 'white',
              border: '1px solid #CDD1E0',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer'
            }}
          >
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
              <path d="M11.5 0C5.15 0 0 5.15 0 11.5C0 16.58 3.29 20.87 7.86 22.38C8.44 22.49 8.65 22.13 8.65 21.82C8.65 21.54 8.64 20.76 8.64 19.93C5.44 20.62 4.77 18.52 4.77 18.52C4.25 17.21 3.49 16.85 3.49 16.85C2.43 16.15 3.57 16.16 3.57 16.16C4.73 16.24 5.34 17.35 5.34 17.35C6.39 19.13 8.09 18.61 8.67 18.31C8.77 17.56 9.08 17.04 9.42 16.75C6.87 16.45 4.19 15.45 4.19 11.01C4.19 9.74 4.64 8.71 5.36 7.9C5.25 7.61 4.84 6.42 5.46 4.82C5.46 4.82 6.45 4.51 8.63 6.01C9.58 5.75 10.59 5.62 11.6 5.62C12.61 5.62 13.62 5.75 14.57 6.01C16.75 4.51 17.74 4.82 17.74 4.82C18.36 6.42 17.95 7.61 17.84 7.9C18.56 8.71 19.01 9.74 19.01 11.01C19.01 15.46 16.32 16.45 13.77 16.74C14.19 17.1 14.56 17.81 14.56 18.91C14.56 20.5 14.55 21.77 14.55 22.12C14.55 22.43 14.76 22.79 15.35 22.68C19.92 21.17 23 16.88 23 11.8C23 5.15 17.85 0 11.5 0Z" fill="black"/>
            </svg>
            <span style={{ color: '#242A31', fontSize: 14, fontWeight: '600' }}>GitHub</span>
          </button>

          {/* GitLab Button */}
          <button
            type="button"
            onClick={handleGitLabSignIn}
            disabled={loading}
            style={{
              flex: 1,
              height: 45,
              background: 'white',
              border: '1px solid #CDD1E0',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer'
            }}
          >
            <svg width="24" height="23" viewBox="0 0 24 23" fill="none">
              <path d="M23.96 11.93L23.95 11.91L20.77 2.89C20.73 2.78 20.67 2.69 20.59 2.61C20.51 2.53 20.41 2.47 20.3 2.44C20.19 2.41 20.08 2.4 19.96 2.42C19.85 2.44 19.74 2.48 19.64 2.55C19.54 2.62 19.45 2.71 19.39 2.81C19.33 2.91 19.29 3.03 19.28 3.15L17.41 10.85H6.59L4.72 3.15C4.71 3.03 4.67 2.91 4.61 2.81C4.55 2.71 4.46 2.62 4.36 2.55C4.26 2.48 4.15 2.44 4.04 2.42C3.92 2.4 3.81 2.41 3.7 2.44C3.59 2.47 3.49 2.53 3.41 2.61C3.33 2.69 3.27 2.78 3.23 2.89L0.05 11.91L0.04 11.93C-0.22 12.64 -0.01 13.43 0.48 13.94L11.52 22.73C11.62 22.81 11.75 22.86 11.88 22.88C12.01 22.9 12.15 22.88 12.27 22.84C12.39 22.8 12.5 22.73 12.58 22.63C12.66 22.53 12.71 22.41 12.74 22.29L23.52 13.94C24.01 13.43 24.22 12.64 23.96 11.93Z" fill="#E24329"/>
              <path d="M11.52 22.73L17.41 10.85H6.59L11.52 22.73Z" fill="#FC6D26"/>
            </svg>
            <span style={{ color: '#242A31', fontSize: 14, fontWeight: '600' }}>GitLab</span>
          </button>
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

      {/* Don't have account */}
      <div style={{
        textAlign: 'center',
        padding: '0 27px 30px'
      }}>
        <span style={{ color: '#999EA1', fontSize: 14, fontWeight: '600' }}>
          Don't have an account ?
        </span>
        {' '}
        <button
          onClick={onSwitchToSignUp}
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
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;

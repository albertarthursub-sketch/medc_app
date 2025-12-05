import { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginScreen
          onAuthSuccess={onAuthSuccess}
          onSwitchToSignUp={() => setIsLogin(false)}
        />
      ) : (
        <SignUpScreen
          onAuthSuccess={onAuthSuccess}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthContainer;

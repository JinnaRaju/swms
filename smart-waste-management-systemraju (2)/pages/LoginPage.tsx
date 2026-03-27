import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon, KeyIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

const LoginPage: React.FC = () => {
  type View = 'login' | 'forgot' | 'otp' | 'reset';
  const [view, setView] = useState<View>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  
  const clearFormState = () => {
    setError('');
    setMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    if (email && password) {
      login();
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    // Mock sending OTP
    setMessage('An OTP has been sent to your email (Hint: 123456).');
    setView('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    // Mock OTP verification
    if (otp === '123456') {
      setMessage('OTP verified successfully. Please set a new password.');
      setView('reset');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Mock password reset and login
    login();
    navigate('/dashboard');
  };
  
  const backToLogin = () => {
      clearFormState();
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setView('login');
  }
  
  const renderBackButton = () => (
    <div className="text-center mt-4">
      <button
        type="button"
        onClick={backToLogin}
        className="text-sm font-medium text-green-200 hover:text-white inline-flex items-center gap-1 bg-transparent border-none"
      >
        <ArrowUturnLeftIcon className="w-4 h-4" />
        Back to Login
      </button>
    </div>
  );

  const buttonClasses = "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-105";
  const inputClasses = "w-full pl-10 pr-3 py-3 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1624389178323-26a97f745778?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl">
        
        {view === 'login' && (
          <>
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white">♻️</h1>
              <h2 className="mt-2 text-3xl font-bold text-white">Welcome!</h2>
              <p className="mt-2 text-sm text-gray-200">Sign in to help keep our city clean.</p>
            </div>
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="email-address" name="email" type="email" autoComplete="email" required className={inputClasses} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClasses} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-300 text-center">{error}</p>}
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <button type="button" onClick={() => { setView('forgot'); clearFormState(); }} className="font-medium text-green-200 hover:text-white bg-transparent border-none p-0">
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button type="submit" className={buttonClasses}>Sign in</button>
              </div>
            </form>
            <p className="text-sm text-center text-gray-200">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-200 hover:text-white">Sign up</Link>
            </p>
          </>
        )}

        {view === 'forgot' && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
              <p className="mt-2 text-sm text-gray-200">Enter your email to receive a verification code.</p>
            </div>
            <form className="space-y-6" onSubmit={handleForgotSubmit}>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="email-forgot" name="email" type="email" autoComplete="email" required className={inputClasses} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-300 text-center">{error}</p>}
              <div>
                <button type="submit" className={buttonClasses}>Send OTP</button>
              </div>
            </form>
            {renderBackButton()}
          </>
        )}

        {view === 'otp' && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Enter OTP</h2>
              <p className="mt-2 text-sm text-gray-200">Check your email for the One-Time Password.</p>
            </div>
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div className="relative">
                <KeyIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="otp" name="otp" type="text" required className={inputClasses} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              {message && <p className="text-sm text-green-200 text-center">{message}</p>}
              {error && <p className="text-sm text-red-300 text-center">{error}</p>}
              <div>
                <button type="submit" className={buttonClasses}>Verify OTP</button>
              </div>
            </form>
            {renderBackButton()}
          </>
        )}

        {view === 'reset' && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-200">Create a new, strong password.</p>
            </div>
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="new-password" name="newPassword" type="password" required className={inputClasses} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-200 absolute top-1/2 left-3 -translate-y-1/2" />
                <input id="confirm-password" name="confirmPassword" type="password" required className={inputClasses} placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {message && <p className="text-sm text-green-200 text-center">{message}</p>}
              {error && <p className="text-sm text-red-300 text-center">{error}</p>}
              <div>
                <button type="submit" className={buttonClasses}>Reset Password & Login</button>
              </div>
            </form>
            {renderBackButton()}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
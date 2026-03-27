import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

const SignUpPage: React.FC = () => {
  type View = 'details' | 'otp';
  const [view, setView] = useState<View>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const clearFormState = () => {
    setError('');
    setMessage('');
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    const { firstName, lastName, email, password, phone } = formData;
    if (firstName && lastName && email && password && phone) {
      // Mock sending OTP
      setMessage('An OTP has been sent to your phone (Hint: 654321).');
      setView('otp');
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const handleVerifyAndSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    clearFormState();
    if (otp === '654321') {
      // Mock signup logic after OTP verification
      login(formData); // Directly log in the user with their details after signup
      navigate('/dashboard');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };
  
  const backToDetails = () => {
      clearFormState();
      setView('details');
  }

  const inputClasses = "w-full px-3 py-3 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition";
  const buttonClasses = "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-105";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516937978286-064aa3485b83?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl">
        {view === 'details' && (
          <>
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white">♻️</h1>
              <h2 className="mt-2 text-3xl font-bold text-white">Create an Account</h2>
              <p className="mt-2 text-sm text-gray-200">Join our community to report and resolve waste issues.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSendOtp}>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" type="text" required placeholder="First Name" onChange={handleChange} value={formData.firstName} className={inputClasses} />
                <input name="lastName" type="text" required placeholder="Last Name" onChange={handleChange} value={formData.lastName} className={inputClasses} />
              </div>
              <input name="dob" type="date" required placeholder="Date of Birth" onChange={handleChange} value={formData.dob} className={`${inputClasses} text-gray-200`} />
              <input name="phone" type="tel" required placeholder="Phone Number" onChange={handleChange} value={formData.phone} className={inputClasses} />
              <input name="email" type="email" required placeholder="Email Address" onChange={handleChange} value={formData.email} className={inputClasses} />
              <input name="password" type="password" required placeholder="Password" onChange={handleChange} value={formData.password} className={inputClasses} />

              {error && <p className="text-sm text-red-300 text-center">{error}</p>}

              <div>
                <button type="submit" className={`${buttonClasses} mt-2`}>
                  Send OTP
                </button>
              </div>
            </form>
            <p className="text-sm text-center text-gray-200">
              Already have an account?
              <Link to="/" className="font-medium text-green-200 hover:text-white">
                login
              </Link>
            </p>
          </>
        )}
        
        {view === 'otp' && (
          <>
            <div className="text-center">
                <h2 className="mt-2 text-3xl font-bold text-white">Verify Your Phone</h2>
                <p className="mt-2 text-sm text-gray-200">Enter the 6-digit code sent to {formData.phone}.</p>
            </div>
             <form className="mt-8 space-y-6" onSubmit={handleVerifyAndSignUp}>
               <input 
                 name="otp" 
                 type="text" 
                 maxLength={6}
                 required 
                 placeholder="Enter OTP" 
                 onChange={(e) => { setOtp(e.target.value); clearFormState(); }} 
                 value={otp} 
                 className={`${inputClasses} text-center tracking-[1rem]`} 
                />

                {message && <p className="text-sm text-green-200 text-center">{message}</p>}
                {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                <div>
                    <button type="submit" className={buttonClasses}>
                      Verify & Sign Up
                    </button>
                </div>
             </form>
             <div className="text-center mt-4">
              <button
                type="button"
                onClick={backToDetails}
                className="text-sm font-medium text-green-200 hover:text-white inline-flex items-center gap-1 bg-transparent border-none"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
                Back to Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
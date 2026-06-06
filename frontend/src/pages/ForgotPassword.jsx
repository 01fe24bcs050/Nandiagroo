import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setMessage(data.message);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage(data.message);
      setStep('success');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 to-emerald-100"
    >
      <div className="card-premium p-8 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center text-textSecondary hover:text-golden transition-colors mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span className="text-sm">Back to Shop</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-darkGreen bg-opacity-10 mb-4">
            {step === 'email' && <Mail size={24} className="text-darkGreen" />}
            {step === 'otp' && <KeyRound size={24} className="text-darkGreen" />}
            {step === 'success' && <Lock size={24} className="text-darkGreen" />}
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">
            {step === 'email' && 'Forgot Password?'}
            {step === 'otp' && 'Reset Password'}
            {step === 'success' && 'Password Reset!'}
          </h1>
          <p className="text-textSecondary text-sm mt-2">
            {step === 'email' && 'Enter your email to receive an OTP'}
            {step === 'otp' && 'Enter the OTP sent to your email and your new password'}
            {step === 'success' && 'Your password has been reset successfully'}
          </p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        {message && step !== 'success' && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-golden text-darkGreen font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP + New Password Form */}
        {step === 'otp' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20 tracking-widest text-center text-lg font-semibold"
                placeholder="000000"
              />
              <p className="text-xs text-textSecondary mt-1 text-center">
                OTP sent to <span className="text-darkGreen font-medium">{email}</span>
              </p>
            </div>

            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-darkGreen"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2 bg-golden text-darkGreen font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-sm text-golden font-semibold hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-green-500 bg-opacity-10 rounded-lg">
              <p className="text-green-700 font-medium">{message}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 bg-darkGreen text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

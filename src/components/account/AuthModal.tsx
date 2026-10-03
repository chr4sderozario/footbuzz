/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'OTP' | 'RESET'>('LOGIN');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'SIGNUP' && !otpSent) {
      setOtpSent(true);
      setMode('OTP');
      return;
    }
    login(email || 'football.fan@footbuzz.app', name || email.split('@')[0]);
  };

  const handleGoogleLogin = () => {
    login('john.supporter@gmail.com', 'John Supporter');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xl text-slate-900 relative">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 font-display text-xl font-black text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009270]" />
            <span>Foot<span className="text-[#009270]">Buzz</span></span>
          </div>
          <p className="text-xs text-slate-500">
            {mode === 'LOGIN' && 'Sign in to access your personalized football command centre.'}
            {mode === 'SIGNUP' && 'Create an account to follow clubs, track players, and receive live match notifications.'}
            {mode === 'OTP' && 'Enter the 6-digit verification code sent to your email.'}
            {mode === 'RESET' && 'Reset your FootBuzz account password.'}
          </p>
        </div>

        {/* 1-Click Google Sign In */}
        {mode !== 'OTP' && (
          <div className="pt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-2">
                Or with email
              </div>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
                />
              </div>
            </div>
          )}

          {mode !== 'OTP' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
                />
              </div>
            </div>
          )}

          {mode !== 'OTP' && mode !== 'RESET' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => setMode('RESET')}
                    className="text-[11px] text-[#009270] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#009270]"
                />
              </div>
            </div>
          )}

          {/* OTP Input Form */}
          {mode === 'OTP' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest text-center text-slate-900 focus:outline-hidden focus:border-[#009270]"
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Demo code: Enter any 6 digits to verify instantly.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>
              {mode === 'LOGIN' && 'Sign In'}
              {mode === 'SIGNUP' && 'Send Verification Code'}
              {mode === 'OTP' && 'Verify & Complete Signup'}
              {mode === 'RESET' && 'Send Password Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Switch mode links */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'LOGIN' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('SIGNUP')} className="text-[#009270] font-bold hover:underline">
                Create Free Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('LOGIN')} className="text-[#009270] font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

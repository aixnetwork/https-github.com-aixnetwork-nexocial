
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ResetPassword: React.FC = () => {
  const { resetPassword } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Nexocial</span>
          </div>
        </div>

        <div className="bg-[#131825]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Password Reset</h2>
              <p className="text-slate-400 text-sm">Your password has been updated. You can now sign in with your new password.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 mt-2"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose a New Password</h2>
                <p className="text-sm text-slate-400">Must be at least 8 characters with one uppercase letter and one number.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 pr-10 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                    placeholder="New Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />

                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-xl px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={() => navigate('/')} className="text-sm text-indigo-400 hover:text-indigo-300 bg-transparent border-0 cursor-pointer">
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

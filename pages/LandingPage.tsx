
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Menu, X, Check, ChevronDown, ArrowRight, Star, Flame, RefreshCw, Target, Calculator, ArrowUpRight, Shield, User, Sun, Moon, TrendingUp, Heart, Activity, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

const LandingPage: React.FC = () => {
  const { register, login, verify2fa, forgotPassword, theme, toggleTheme } = useApp();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || undefined;
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [twoFactorUserId, setTwoFactorUserId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'login' || mode === 'register') {
      // Small delay to ensure page is ready
      setTimeout(() => {
        scrollToAuth(mode as 'login' | 'register');
      }, 100);
    }
  }, [searchParams]);

  // ROI Calculator State
  const [roiHourlyRate, setRoiHourlyRate] = useState(45);
  const [roiHoursPerWeek, setRoiHoursPerWeek] = useState(5);
  const monthlyManualCost = roiHourlyRate * roiHoursPerWeek * 4;
  const monthlyAICost = 19;
  const monthlySavings = Math.max(0, monthlyManualCost - monthlyAICost);
  const yearlySavings = monthlySavings * 12;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'register' && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const result = await login(email, password);
        if (result?.requiresTwoFactor) {
          setTwoFactorUserId(result.userId);
        }
      } else {
        await register(name, email, password, company || 'My Company', referralCode);
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setAuthLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: unknown) {
      setForgotError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorUserId) return;
    setOtpError('');
    setAuthLoading(true);
    try {
      await verify2fa(twoFactorUserId, otpCode);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'user') => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const email = type === 'admin' ? 'admin@nexocial.ai' : 'matt@nexocial.ai';
      const password = type === 'admin' ? 'Admin@123' : 'Matt@1234';
      await login(email, password);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Demo login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToAuth = (mode: 'login' | 'register' = 'register') => {
    setAuthMode(mode);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden transition-colors duration-300">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Zap className="text-white w-6 h-6 fill-current" />
                </div>
                <div className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">Nexocial</div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
                <Link to="/features" className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">Features</Link>
                <Link to="/comparison" className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">Comparison</Link>
                <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">Pricing</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button onClick={() => scrollToAuth('login')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">Log In</button>
                <button 
                  onClick={() => scrollToAuth('register')}
                  className="bg-indigo-600 dark:bg-white text-white dark:text-black hover:bg-indigo-700 dark:hover:bg-slate-200 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <button 
                  onClick={toggleTheme}
                  className="p-2 text-slate-500 dark:text-slate-400"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </div>

        {isMobileMenuOpen && (
           <div className="md:hidden bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-white/10 px-4 pt-2 pb-6 shadow-2xl absolute w-full left-0 top-20 z-[60]">
              <Link to="/features" className="block w-full text-left text-slate-600 dark:text-slate-400 font-medium py-3 hover:text-indigo-600 dark:hover:text-white border-b border-slate-100 dark:border-white/5">Features</Link>
              <Link to="/comparison" className="block w-full text-left text-slate-600 dark:text-slate-400 font-medium py-3 hover:text-indigo-600 dark:hover:text-white border-b border-slate-100 dark:border-white/5">Comparison</Link>
              <Link to="/pricing" className="block w-full text-left text-slate-600 dark:text-slate-400 font-medium py-3 hover:text-indigo-600 dark:hover:text-white border-b border-slate-100 dark:border-white/5">Pricing</Link>
              <button onClick={() => scrollToAuth('login')} className="block w-full text-left text-slate-600 dark:text-slate-400 font-medium py-3 hover:text-indigo-600 dark:hover:text-white">Log In</button>
              <button onClick={() => scrollToAuth('register')} className="block w-full bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold mt-4 shadow-md">Start Free Trial</button>
           </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
         <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
                    New: TrendHunter™ AI Technology
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05]">
                    The All-in-One AI <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-gradient-x">Social Growth Engine.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 font-display font-light">
                    Stop managing tools and start building a brand. <strong>Nexocial</strong> is the only AI that finds trends, creates viral content, and engages your audience—all in one place.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <button onClick={() => scrollToAuth('register')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/20 text-lg">
                        Start Free Trial
                    </button>
                    <Link to="/features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white font-bold px-8 py-4 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-lg">
                        See Features
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:ml-auto">
                <div className="bg-white dark:bg-[#131825]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative group transform transition-all duration-300 hover:border-indigo-500/30">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition duration-500 -z-10"></div>
                    <div className="relative">
                        {forgotMode ? (
                          <>
                            <div className="text-center mb-8">
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {forgotSent ? "Check your inbox for a reset link." : "Enter your email and we'll send a reset link."}
                              </p>
                            </div>
                            {forgotSent ? (
                              <div className="text-center space-y-4">
                                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto">
                                  <Check className="w-7 h-7 text-green-400" />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Email sent to <strong className="text-slate-900 dark:text-white">{forgotEmail}</strong></p>
                              </div>
                            ) : (
                              <form onSubmit={handleForgotPassword} className="space-y-4">
                                <input
                                  type="email"
                                  required
                                  className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none"
                                  placeholder="Email Address"
                                  value={forgotEmail}
                                  onChange={e => setForgotEmail(e.target.value)}
                                />
                                {forgotError && (
                                  <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{forgotError}</p>
                                )}
                                <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
                                  {authLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                              </form>
                            )}
                            <div className="mt-6 text-center text-sm">
                              <button onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); setForgotError(''); }} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold bg-transparent border-0 cursor-pointer">
                                ← Back to login
                              </button>
                            </div>
                          </>
                        ) : twoFactorUserId ? (
                          <>
                            <div className="text-center mb-8">
                              <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-7 h-7 text-indigo-400" />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Two-Factor Auth</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Enter the 6-digit code sent to your email.</p>
                            </div>
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center text-3xl font-mono tracking-[0.5em] text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                                placeholder="------"
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              />
                              {otpError && (
                                <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{otpError}</p>
                              )}
                              <button type="submit" disabled={authLoading || otpCode.length !== 6} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
                                {authLoading ? 'Verifying...' : 'Verify & Sign In'}
                              </button>
                            </form>
                            <div className="mt-6 text-center text-sm">
                              <button onClick={() => { setTwoFactorUserId(null); setOtpCode(''); setOtpError(''); }} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold bg-transparent border-0 cursor-pointer">
                                ← Back to login
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-center mb-8">
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                {authMode === 'register' ? 'Start your free trial' : 'Welcome back'}
                              </h3>
                            </div>
                            <form onSubmit={handleAuth} className="space-y-4">
                              {authMode === 'register' && (
                                <>
                                  <input type="text" required className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                  <input type="text" required className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
                                </>
                              )}
                              <input type="email" required className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                              <div>
                                <input type="password" required className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                                {authMode === 'login' && (
                                  <div className="text-right mt-1">
                                    <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(email); }} className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline bg-transparent border-0 cursor-pointer">
                                      Forgot password?
                                    </button>
                                  </div>
                                )}
                              </div>
                              {authMode === 'register' && (
                                <input type="password" required className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                              )}
                              {authError && (
                                <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2 whitespace-pre-line">{authError}</p>
                              )}
                              <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
                                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                              </button>
                            </form>
                            <div className="mt-6 text-center text-sm">
                              <span className="text-slate-500 dark:text-slate-400">{authMode === 'login' ? "New here?" : "Already have an account?"}</span>
                              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(null); }} className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold bg-transparent border-0 cursor-pointer">
                                {authMode === 'login' ? 'Create Account' : 'Sign In'}
                              </button>
                            </div>
                          </>
                        )}

                        {/* Quick Demo Section */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                            <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Try the Live Demo</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleDemoLogin('user')}
                                    className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all"
                                >
                                    <User className="w-3 h-3" /> User Demo
                                </button>
                                <button 
                                    onClick={() => handleDemoLogin('admin')}
                                    className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-purple-500/50 transition-all"
                                >
                                    <Shield className="w-3 h-3" /> Super Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Replace Your Social Stack Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#05080f] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">Replace your social stack.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto font-display font-light">
                Stop paying for 5+ separate subscriptions. Nexocial consolidates your entire social media workflow into a single, AI-powered dashboard.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[
                    { tool: "Jasper / Copy.ai", replacement: "AI Content Engine", icon: "✍️" },
                    { tool: "Canva / Midjourney", replacement: "AI Visual Studio", icon: "🎨" },
                    { tool: "Hootsuite / Buffer", replacement: "Viral Scheduler", icon: "📅" },
                    { tool: "Sprout / Community", replacement: "Auto-Engagement", icon: "💬" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#131825] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="text-3xl mb-4">{item.icon}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 line-through">{item.tool}</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-heading">{item.replacement}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-[#0B0F19] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-slate-900 dark:text-white">The Full Lifecycle, <span className="text-indigo-600 dark:text-indigo-400 italic">Automated.</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-display font-light">
                From the first spark of an idea to the final engagement, Nexocial handles every step of your social media strategy.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-all group glass">
                    <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-6"><Zap className="w-7 h-7 text-indigo-600" /></div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-slate-900 dark:text-white">1. Discover Trends</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">Our AI scans global social trends in real-time to find what's going viral before it peaks. Never miss a moment again.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-violet-500/30 transition-all group glass">
                    <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6"><Heart className="w-7 h-7 text-violet-500" /></div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-slate-900 dark:text-white">2. Generate Content</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">Generate high-converting social copy and stunning visuals that match your brand's unique voice and aesthetic perfectly.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-all group glass">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6"><Activity className="w-7 h-7 text-emerald-500" /></div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-slate-900 dark:text-white">3. Auto-Engage</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">Schedule across all platforms and let our AI agents handle comments and community engagement while you sleep.</p>
                </div>
            </div>
            <div className="mt-12">
                <Link to="/features" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 dark:hover:text-indigo-300 transition-all group">
                    Explore all 20+ AI features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
      </section>

      {/* One Dashboard Section */}
      <section className="py-24 bg-white dark:bg-[#0B0F19] transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                    <div className="absolute -inset-10 bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-4 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-4 px-4 py-2 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <div className="ml-4 h-4 w-32 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4">
                            <div className="col-span-2 space-y-4">
                                <div className="h-32 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 p-4">
                                    <div className="h-4 w-1/2 bg-indigo-400/40 rounded-full mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                        <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                        <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-white/5 rounded-2xl border border-white/10"></div>
                                    <div className="h-24 bg-white/5 rounded-2xl border border-white/10"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-full bg-white/5 rounded-2xl border border-white/10 p-4">
                                    <div className="h-4 w-full bg-white/10 rounded-full mb-6"></div>
                                    <div className="space-y-4">
                                        {[1,2,3,4,5].map(i => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                                <div className="h-2 flex-grow bg-white/5 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">One Dashboard. <br /><span className="text-indigo-600 dark:text-indigo-400">Total Control.</span></h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Stop switching tabs. Manage your entire social presence—from trend discovery to auto-engagement—in a single, unified command center.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {[
                            "Unified Inbox for all platforms",
                            "Global Content Calendar",
                            "Cross-platform Analytics",
                            "AI Agent Activity Logs"
                        ].map(item => (
                            <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                                <Check className="w-5 h-5 text-emerald-500" /> {item}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => scrollToAuth('register')} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
                        Experience the dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-24 bg-slate-50 dark:bg-[#0B0F19] relative scroll-mt-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-slate-900 dark:text-white">Why Businesses Switch</h2>
            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131825] shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="p-6 md:p-8 text-lg text-slate-400 dark:text-slate-500 font-medium w-1/3 border-b border-slate-100 dark:border-white/5">Feature</th>
                            <th className="p-6 md:p-8 text-xl font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] w-1/3">Hootsuite</th>
                            <th className="p-6 md:p-8 text-xl font-bold text-indigo-600 dark:text-white border-b border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/10 w-1/3">Nexocial</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        <tr>
                            <td className="p-6 md:p-8 text-slate-700 dark:text-slate-300 font-bold">Content Ideation</td>
                            <td className="p-6 md:p-8 text-slate-500 bg-slate-50 dark:bg-white/[0.02]">Manual (You do the work)</td>
                            <td className="p-6 md:p-8 text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/5 font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-500" /> AI-First Strategy</td>
                        </tr>
                        <tr>
                            <td className="p-6 md:p-8 text-slate-700 dark:text-slate-300 font-bold">Virality Prediction</td>
                            <td className="p-6 md:p-8 text-slate-500 bg-slate-50 dark:bg-white/[0.02]">None (Post & Pray)</td>
                            <td className="p-6 md:p-8 text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/5 font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Predictive Heatmaps</td>
                        </tr>
                        <tr>
                            <td className="p-6 md:p-8 text-slate-700 dark:text-slate-300 font-bold">Sentiment Intelligence</td>
                            <td className="p-6 md:p-8 text-slate-500 bg-slate-50 dark:bg-white/[0.02]">Basic Mentions</td>
                            <td className="p-6 md:p-8 text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/5 font-bold flex items-center gap-2"><Heart className="w-4 h-4 text-pink-500" /> Real-time Emotional Analysis</td>
                        </tr>
                        <tr>
                            <td className="p-6 md:p-8 text-slate-700 dark:text-slate-300 font-bold">Pricing Model</td>
                            <td className="p-6 md:p-8 text-slate-500 bg-slate-50 dark:bg-white/[0.02]">$99/mo (1 User)</td>
                            <td className="p-6 md:p-8 text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/5 font-bold">Entry plan ($19)</td>
                        </tr>
                        <tr>
                            <td className="p-6 md:p-8 text-slate-700 dark:text-slate-300 font-bold">Setup Time</td>
                            <td className="p-6 md:p-8 text-slate-500 bg-slate-50 dark:bg-white/[0.02]">Hours of configuration</td>
                            <td className="p-6 md:p-8 text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-900/5 font-bold">Instant (AI Training)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="pricing" className="py-24 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Simple Plans. Powerful Features.</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    No enterprise-level bloat or hidden fees. Compare us to Hootsuite and see why brands are switching.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                {/* Entry Plan */}
                <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 flex flex-col transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Entry</h3>
                    <p className="text-slate-500 mb-6">Perfect for solo creators.</p>
                    <div className="text-5xl font-extrabold mb-8 text-slate-900 dark:text-white">$19<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 5 Social Profiles</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 1 User Seat</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 50 AI Posts / mo</li>
                    </ul>
                    <button onClick={() => scrollToAuth('register')} className="w-full text-indigo-600 dark:text-indigo-300 border border-indigo-600/30 dark:border-indigo-500/30 font-bold py-3 rounded-xl hover:bg-indigo-600/10 dark:hover:bg-indigo-500/10 transition duration-300 mt-auto">
                        Start Free Trial
                    </button>
                </div>

                {/* Catalyst Plan (Featured) */}
                <div className="bg-white dark:bg-[#131825] p-8 rounded-3xl border-2 border-indigo-600 dark:border-indigo-500 shadow-2xl shadow-indigo-500/20 relative flex flex-col transform md:scale-105 z-10">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Most Popular</div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white mt-4">Catalyst</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Accelerate your brand growth.</p>
                    <div className="text-5xl font-extrabold mb-8 text-indigo-600 dark:text-indigo-400">$49<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-900 dark:text-slate-200 font-medium"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> 20 Social Profiles</li>
                        <li className="flex items-center text-slate-900 dark:text-slate-200 font-medium"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> 5 Team Seats</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> Unlimited AI Content</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> Predictive Virality Heatmaps</li>
                    </ul>
                    <button onClick={() => scrollToAuth('register')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-700 transition duration-300 mt-auto transform hover:-translate-y-1">
                        Start Free Trial
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 flex flex-col transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Enterprise</h3>
                    <p className="text-slate-500 mb-6">Dominance at scale.</p>
                    <div className="text-5xl font-extrabold mb-8 text-slate-900 dark:text-white">$199<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> Unlimited Profiles</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> 25 Team Seats</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> Custom Brand Voice</li>
                        <li className="flex items-center text-slate-600 dark:text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-500" /> AI Auto-Engagement</li>
                    </ul>
                    <button onClick={() => scrollToAuth('register')} className="w-full text-indigo-600 dark:text-indigo-300 border border-indigo-600/30 dark:border-indigo-500/30 font-bold py-3 rounded-xl hover:bg-indigo-600/10 dark:hover:bg-indigo-500/10 transition duration-300 mt-auto">
                        Start Free Trial
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-[#131825] dark:to-[#0B0F19] border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3"><Calculator className="w-8 h-8 text-emerald-500 dark:text-emerald-400" /> Social ROI Calculator</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">See how much time and money you save by automating content creation, scheduling, and community engagement.</p>
                        <div className="space-y-8 mt-8">
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2"><span>Your Hourly Value</span><span className="text-indigo-600 dark:text-indigo-400">${roiHourlyRate}/hr</span></div>
                                <input type="range" min="15" max="150" step="5" value={roiHourlyRate} onChange={(e) => setRoiHourlyRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500" />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2"><span>Hours on Social / Week</span><span className="text-indigo-600 dark:text-indigo-400">{roiHoursPerWeek} hrs</span></div>
                                <input type="range" min="1" max="40" step="1" value={roiHoursPerWeek} onChange={(e) => setRoiHoursPerWeek(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-indigo-500/20 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">You save <span className="text-emerald-600 dark:text-emerald-400 font-bold">${Math.round(monthlySavings).toLocaleString()}</span> every month</p>
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 py-2">${Math.round(yearlySavings).toLocaleString()}</div>
                        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Yearly Savings</p>
                        <button onClick={() => scrollToAuth()} className="w-full mt-6 bg-indigo-600 dark:bg-white text-white dark:text-black hover:bg-indigo-700 dark:hover:bg-slate-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">Start Saving Now <ArrowRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-[#05080f] text-slate-900 dark:text-white pt-24 pb-12 border-t border-slate-200 dark:border-white/5 font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why Nexocial</Link></li>
                        <li><Link to="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link></li>
                        <li><Link to="/comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Comparison</Link></li>
                        <li><Link to="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                        <li><a href="mailto:hello@nexocial.ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</a></li>
                        <li><a href="mailto:support@nexocial.ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</a></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Zap className="text-white w-5 h-5 fill-current" /></div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Nexocial</span>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-4 md:mb-0">
                    &copy; 2026 Nexocial, Inc. All rights reserved.
                </p>
                <div className="text-center">
                     <p className="text-xs text-slate-300 dark:text-slate-700 font-medium">Powered by <a href="https://aixnetwork.net" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">AI X Network</a></p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

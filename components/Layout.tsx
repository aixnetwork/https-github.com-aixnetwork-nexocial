
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Home, PenTool, CheckSquare, MessageSquare, Settings, Zap, Calendar, BarChart2, LogOut, Menu, X, Megaphone, Flame, HelpCircle, Trophy, Command, Sun, Moon, Brain } from 'lucide-react';
import ContextualGuide from './ContextualGuide';
import OnboardingAssistant from './OnboardingAssistant';
import FeedbackModal from './FeedbackModal';
import BetaTester from './BetaTester';
import QuickActionPalette from './QuickActionPalette';
import { useApp } from '../context/AppContext';
import clsx from 'clsx';

const Layout: React.FC = () => {
  const { currentUser, authLoading, logout, theme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Keyboard shortcut for Quick Action (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickActionOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Wait for session restore before making auth decisions
  if (authLoading) return null;

  // Route protection
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed
  if (currentUser.onboardingCompleted === false && currentUser.role !== 'SuperAdmin') {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect Super Admin to their dashboard if they try to access standard layout
  if (currentUser.role === 'SuperAdmin') {
     return <Navigate to="/admin" replace />;
  }

  // Renamed for SMB Friendliness - PLAIN ENGLISH
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/trends', icon: Flame, label: 'TrendHunter' },
    { to: '/strategy', icon: Brain, label: 'War Room' },
    { to: '/studio', icon: PenTool, label: 'Content Studio' },
    { to: '/campaigns', icon: Megaphone, label: 'Campaigns' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/monitor', icon: BarChart2, label: 'Performance' },
    { to: '/review', icon: CheckSquare, label: 'Approvals' },
    { to: '/inbox', icon: MessageSquare, label: 'Inbox' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Calculate Level Progress (Mock logic based on points)
  const currentPoints = currentUser.gamification?.points || 0;
  const nextLevelPoints = ((currentUser.gamification?.level || 1) * 100) + 100; // Simple scaling
  const progressPercent = Math.min(100, (currentPoints / nextLevelPoints) * 100);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <QuickActionPalette isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Nexocial</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0F1420] border-r border-slate-200 dark:border-slate-800/50 flex flex-col transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Area */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10 group cursor-pointer hover:scale-105 transition-transform">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">Nexocial</h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-bold mt-1 font-display">Growth Engine</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="hidden lg:flex p-2 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Search / Command Trigger */}
        <div className="px-4 py-4">
            <button 
                onClick={() => setIsQuickActionOpen(true)}
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg px-3 py-2 text-xs flex items-center justify-between transition-all group"
            >
                <span className="flex items-center gap-2"><Command className="w-3 h-3" /> Quick Action...</span>
                <span className="bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-700">⌘K</span>
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-slate-200"
                )}
              >
                <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-500" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="text-sm tracking-wide">{item.label}</span>
                
                {item.label === 'TrendHunter' && (
                    <span className="ml-auto flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                )}
                {/* Active Indicator Line */}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full"></div>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30">
          
          {/* Gamification Bar */}
          <div className="mb-4">
             <div className="flex justify-between items-end mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 font-display">
                    <Trophy className="w-3 h-3 text-yellow-500" /> Lvl {currentUser.gamification?.level || 1} Pilot
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {currentPoints}/{nextLevelPoints} XP
                </span>
             </div>
             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
             </div>
          </div>

          <div className="flex items-center gap-3 px-1 py-1 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-[2px] shadow-md">
               <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white font-heading">
                  {currentUser.name.charAt(0)}
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate font-heading">{currentUser.name}</p>
              </div>
              <p className="text-[11px] text-slate-500 truncate font-display">{currentUser.companyName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center justify-center gap-2 px-2 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/50"
            >
                <HelpCircle className="w-3 h-3" /> Support
            </button>
            <button 
                onClick={logout}
                className="flex items-center justify-center gap-2 px-2 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/50 hover:border-red-200 dark:hover:border-red-900/30"
            >
                <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0B0F19] relative pt-16 lg:pt-0 scroll-smooth transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
        </div>
        <ContextualGuide />
        <OnboardingAssistant />
        <BetaTester />
      </main>
    </div>
  );
};

export default Layout;

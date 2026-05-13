
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  PenTool, 
  CheckSquare, 
  MessageSquare, 
  Settings, 
  Zap, 
  Calendar, 
  BarChart2, 
  Flame, 
  Brain,
  Plus,
  ArrowRight,
  X,
  Command as CommandIcon,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface QuickActionPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACTIONS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: Home, category: 'Navigation', path: '/dashboard' },
  { id: 'studio', label: 'Create New Post', icon: PenTool, category: 'Actions', path: '/studio' },
  { id: 'trends', icon: Flame, label: 'Explore Trends', category: 'Navigation', path: '/trends' },
  { id: 'strategy', icon: Brain, label: 'Strategy War Room', category: 'Navigation', path: '/strategy' },
  { id: 'campaigns', icon: Megaphone, label: 'Manage Campaigns', category: 'Navigation', path: '/campaigns' },
  { id: 'calendar', icon: Calendar, label: 'View Calendar', category: 'Navigation', path: '/calendar' },
  { id: 'monitor', icon: BarChart2, label: 'Performance Metrics', category: 'Navigation', path: '/monitor' },
  { id: 'review', icon: CheckSquare, label: 'Review Approvals', category: 'Navigation', path: '/review' },
  { id: 'inbox', icon: MessageSquare, label: 'Check Inbox', category: 'Navigation', path: '/inbox' },
  { id: 'settings', icon: Settings, label: 'Settings', category: 'Navigation', path: '/settings' },
];

const QuickActionPalette: React.FC<QuickActionPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = ACTIONS.filter(action => 
    action.label.toLowerCase().includes(search.toLowerCase()) ||
    action.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleAction(filteredActions[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  const handleAction = (action: typeof ACTIONS[0]) => {
    navigate(action.path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/80 dark:bg-[#0F1420]/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 px-6 py-6 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="What are we building today?"
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xl font-medium"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700/50 uppercase tracking-widest">
                ESC
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-4 scrollbar-hide">
              {filteredActions.length > 0 ? (
                <div className="space-y-6">
                  {/* Group by category */}
                  {['Actions', 'Navigation'].map(category => {
                    const categoryActions = filteredActions.filter(a => a.category === category);
                    if (categoryActions.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-3 px-4 mb-3">
                          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{category}</h4>
                          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50" />
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {categoryActions.map((action) => {
                            const globalIndex = filteredActions.indexOf(action);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <button
                                key={action.id}
                                onClick={() => handleAction(action)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={clsx(
                                  "w-full flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all duration-200 group relative overflow-hidden",
                                  isSelected 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]" 
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                )}
                              >
                                {isSelected && (
                                  <motion.div 
                                    layoutId="active-bg"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 -z-10"
                                  />
                                )}
                                <div className={clsx(
                                  "p-2.5 rounded-xl transition-all duration-300",
                                  isSelected 
                                    ? "bg-white/20 text-white rotate-12" 
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:scale-110 group-hover:text-indigo-500"
                                )}>
                                  <action.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-bold text-sm tracking-tight">{action.label}</div>
                                  <div className={clsx(
                                    "text-[10px] mt-0.5 font-medium",
                                    isSelected ? "text-indigo-100/80" : "text-slate-400 dark:text-slate-500"
                                  )}>
                                    Quick access to {action.label.toLowerCase()}
                                  </div>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Open</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6"
                  >
                    <Search className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No matches found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">We couldn't find anything matching "{search}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-900 dark:text-slate-200">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-900 dark:text-slate-200">↑↓</kbd>
                  Navigate
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <CommandIcon className="w-3.5 h-3.5" />
                <span>Nexocial Command</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickActionPalette;

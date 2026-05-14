
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap, PenTool, Sparkles, Calendar, CheckCircle, AlertCircle, Eye, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownLeft, Send, User, Activity, Heart, Share2, Loader2, BarChart3, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import clsx from 'clsx';
import { PostStatus } from '../types';

const MetricCard = ({ label, value, subtext, icon: Icon, colorClass, trend, data, linkTo }: any) => (
  <Link to={linkTo || '#'}>
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all group relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={clsx("absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500", colorClass.replace('text-', 'bg-'))}></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={clsx("p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 border border-white/40 dark:border-white/10 shadow-sm", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full border shadow-sm font-mono backdrop-blur-md",
            trend > 0 
              ? "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" 
              : "bg-rose-50/50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
          )}>
            {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2 font-display">{label}</p>
        <h3 className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{value}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
          <Activity className="w-3 h-3 opacity-50" />
          {subtext}
        </p>
      </div>

      {/* Sparkline Background */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20 dark:opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="currentColor" 
              strokeWidth={3} 
              dot={false} 
              className={colorClass}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </Link>
);

const DailyChecklist = ({ unreadMessages, drafts, nextPost }: any) => {
    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2 relative z-10">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                Mission Control
            </h3>
            <div className="space-y-3 flex-1 relative z-10">
                {/* Inbox Item */}
                <Link to="/inbox" className="flex items-center justify-between p-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 hover:border-indigo-500/30 transition-all group cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", unreadMessages > 0 ? "bg-indigo-500 text-white" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400")}>
                            {unreadMessages > 0 ? <MessageSquare className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={clsx("text-sm font-bold font-heading", unreadMessages > 0 ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                                Inbox Status
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-display tracking-wide">
                                {unreadMessages > 0 ? `${unreadMessages} customers waiting` : "All caught up"}
                            </p>
                        </div>
                    </div>
                    {unreadMessages > 0 && <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />}
                </Link>

                {/* Drafts Item */}
                <Link to="/review" className="flex items-center justify-between p-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 hover:border-amber-500/30 transition-all group cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", drafts > 0 ? "bg-amber-500 text-white" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400")}>
                             {drafts > 0 ? <PenTool className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={clsx("text-sm font-bold font-heading", drafts > 0 ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                                Content Queue
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-display tracking-wide">
                                {drafts > 0 ? `${drafts} drafts need review` : "Queue empty"}
                            </p>
                        </div>
                    </div>
                    {drafts > 0 && <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />}
                </Link>

                {/* Schedule Item */}
                <Link to="/calendar" className="flex items-center justify-between p-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 hover:border-purple-500/30 transition-all group cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", !nextPost ? "bg-purple-500 text-white" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400")}>
                             {nextPost ? <CheckCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={clsx("text-sm font-bold font-heading", !nextPost ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                                Next Up
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-display tracking-wide">
                                {!nextPost ? "Nothing scheduled" : "Scheduled for tomorrow"}
                            </p>
                        </div>
                    </div>
                    {!nextPost && <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />}
                </Link>
            </div>
        </div>
    )
}

const QuickCreateWidget = () => {
    const navigate = useNavigate();
    const [thought, setThought] = useState('');

    const handleOpenStudio = () => {
        if (!thought.trim()) return;
        navigate('/studio', { state: { coreMessage: thought } });
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full shadow-2xl shadow-indigo-500/20">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                        <Sparkles className="w-5 h-5 text-white fill-current" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white">Magic Post</h3>
                </div>
                
                <div className="relative group mb-6">
                    <textarea 
                        className="relative w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white placeholder-indigo-100/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 resize-none transition-all text-sm leading-relaxed"
                        rows={4}
                        placeholder="What's happening? (e.g. 'Flash sale this weekend!')"
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                    />
                </div>
            </div>
            
            <button 
                onClick={handleOpenStudio}
                disabled={!thought.trim()}
                className="w-full bg-white text-indigo-600 disabled:bg-white/50 disabled:text-indigo-300 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 relative z-10 font-display"
            >
                <Zap className="w-4 h-4 fill-current" /> Auto-Generate
            </button>
        </div>
    );
};

const BrandSoulVisualizer = ({ brandVoice }: any) => {
    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 h-full relative overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-pink-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-pink-500" />
                    </div>
                    Brand Soul
                </h3>
                <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] font-display">Live Vibe</span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-4 relative z-10">
                {/* Pulsing Core */}
                <div className="relative">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-pink-500 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            rotate: 360,
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-pink-500/30 rounded-full"
                    />
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-pink-500/40 border-4 border-white/20 relative z-10 cursor-pointer"
                    >
                        <Sparkles className="w-12 h-12 text-white fill-current" />
                    </motion.div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/30 dark:bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-white/5">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest font-display">Tone</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white font-heading">{brandVoice?.tone || 'Professional'}</p>
                    </div>
                    <div className="bg-white/30 dark:bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-white/5">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest font-display">Energy</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white font-heading">High Frequency</p>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { posts, messages, currentUser, brandVoice } = useApp();

  const nextPost = posts.find(p => p.status === 'Scheduled' && p.scheduledTime && p.scheduledTime > Date.now());
  const unreadMessages = messages.filter(m => m.status === 'New').length;
  const drafts = posts.filter(p => p.status === PostStatus.DRAFT || p.status === PostStatus.NEEDS_REVIEW).length;
  
  const totalReach = posts.reduce((acc, p) => acc + (p.metrics?.views || 0), 0);
  const totalInteractions = posts.reduce((acc, p) => acc + (p.metrics?.likes || 0) + (p.metrics?.shares || 0), 0);

  // Mock data for sparklines
  const reachData = [
    { value: 400 }, { value: 600 }, { value: 500 }, { value: 800 }, { value: 700 }, { value: 1100 }, { value: 950 }
  ];
  const interactionData = [
    { value: 100 }, { value: 150 }, { value: 120 }, { value: 200 }, { value: 180 }, { value: 250 }, { value: 220 }
  ];
  const growthData = [
    { value: 10 }, { value: 15 }, { value: 25 }, { value: 20 }, { value: 35 }, { value: 45 }, { value: 60 }
  ];

  const llmConfigured = !!(currentUser?.llmSettings as any)?.apiKey;

  return (
    <div className="pb-10 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* LLM API banner */}
      {!llmConfigured && (
        <Link to="/settings" state={{ tab: 'llm api' }} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl px-5 py-3.5 hover:border-amber-400 dark:hover:border-amber-400/50 transition-colors group">
          <Key className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
            <strong>LLM API not configured</strong> — AI content generation is limited. Configure your API key to unlock full features.
          </p>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline whitespace-nowrap">Configure →</span>
        </Link>
      )}

      {/* Header with Date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] font-display">Command Center</span>
              <div className="h-px w-12 bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
            </div>
            <h2 className="text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{currentUser?.name?.split(' ')[0] || 'User'}</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser?.affiliate && (
              <Link to="/settings" className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 px-5 py-3 rounded-2xl hover:shadow-xl transition-all group">
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Earnings</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1">${currentUser.affiliate.earnings.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </Link>
            )}

            <div className="hidden sm:flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 px-5 py-3 rounded-2xl">
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">AI Status</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">Online</p>
                </div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                </div>
            </div>
          </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Total Reach" 
          value={totalReach.toLocaleString()} 
          subtext="Impressions across all channels"
          icon={Eye} 
          colorClass="text-indigo-600 dark:text-indigo-400" 
          trend={12.5}
          data={reachData}
          linkTo="/monitor"
        />
        <MetricCard 
          label="Interactions" 
          value={totalInteractions.toLocaleString()} 
          subtext="Likes, comments, and shares"
          icon={MessageSquare} 
          colorClass="text-blue-600 dark:text-blue-400" 
          trend={8.2}
          data={interactionData}
          linkTo="/monitor"
        />
        <MetricCard 
          label="Engagement Rate" 
          value={`${((totalInteractions / (totalReach || 1)) * 100).toFixed(1)}%`} 
          subtext="Interaction per impression"
          icon={TrendingUp} 
          colorClass="text-emerald-600 dark:text-emerald-400" 
          trend={4.1}
          data={growthData}
          linkTo="/monitor"
        />
      </div>

      {/* Main Focus Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            <QuickCreateWidget />
          </div>
          <div className="lg:col-span-1">
            <DailyChecklist unreadMessages={unreadMessages} drafts={drafts} nextPost={nextPost} />
          </div>
          <div className="lg:col-span-1">
            <BrandSoulVisualizer brandVoice={brandVoice} />
          </div>
      </div>

      {/* AI Engagement Activity Feed */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-xl flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                  </div>
                  Recent AI Engagements
              </h3>
              <Link to="/inbox" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors uppercase tracking-[0.2em] font-display bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {messages.filter(m => m.status === 'Replied').slice(0, 3).map(msg => (
                  <motion.div 
                    key={msg.id} 
                    whileHover={{ y: -4 }}
                    className="flex flex-col gap-4 p-5 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/5 group hover:border-indigo-500/30 transition-all backdrop-blur-sm"
                  >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{msg.sender}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-600 font-display uppercase tracking-wider">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                          </div>
                          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                            <Send className="w-3.5 h-3.5 text-indigo-500" />
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2">"{msg.content}"</p>
                        </div>
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group-hover:bg-indigo-500/20 transition-colors">
                            <div className="absolute top-0 right-0 p-1">
                                <Sparkles className="w-3 h-3 text-indigo-500/30" />
                            </div>
                            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300 leading-relaxed">Nexocial: <span className="font-normal italic">"{msg.suggestedReply}"</span></p>
                        </div>
                      </div>
                  </motion.div>
              ))}
              {messages.filter(m => m.status === 'Replied').length === 0 && (
                  <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-600 text-sm font-medium">No recent AI engagements. Enable Auto-Reply in Settings.</p>
                  </div>
              )}
          </div>
      </div>

      {/* Alert Banner if needed */}
      {unreadMessages > 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-2xl shadow-amber-500/20"
          >
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                 <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xl font-heading font-bold text-white">High Message Volume</h4>
                  <p className="text-white/80 font-medium">You're popular! {unreadMessages} customers are waiting for your attention.</p>
              </div>
              <Link to="/inbox" className="w-full sm:w-auto bg-white text-amber-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 font-display">
                  Clear Inbox
              </Link>
          </motion.div>
      )}
    </div>
  );
};
export default Dashboard;

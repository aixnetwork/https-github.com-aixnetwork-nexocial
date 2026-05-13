
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Heart, Share2, MousePointer2, Search, User, TrendingUp, Info, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { PostStatus } from '../types';

const MonitorPage: React.FC = () => {
  const { posts, mentions, competitors } = useApp();
  const [activeTab, setActiveTab] = useState<'performance' | 'listening' | 'competitors'>('performance');

  const publishedPosts = posts.filter(p => p.status === PostStatus.PUBLISHED);

  const velocityData = [
    { time: '0h', reach: 0, velocity: 0 },
    { time: '2h', reach: 450, velocity: 225 },
    { time: '4h', reach: 1200, velocity: 375 },
    { time: '6h', reach: 2800, velocity: 800 },
    { time: '8h', reach: 3500, velocity: 350 },
    { time: '10h', reach: 4200, velocity: 350 },
    { time: '12h', reach: 4650, velocity: 225 },
  ];

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#64748b' },
    { name: 'Negative', value: 10, color: '#ef4444' },
  ];

  const renderPlatformIcon = (platform: string) => {
    switch(platform) {
        case 'Instagram': return <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />;
        case 'LinkedIn': return <div className="w-2 h-2 rounded-full bg-blue-700 shrink-0" />;
        case 'X': return <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />;
        case 'Facebook': return <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />;
        case 'YouTube': return <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />;
        case 'TikTok': return <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />;
        default: return <div className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />;
    }
  }

  return (
    <div className="space-y-8 h-full flex flex-col pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Monitor <span className="text-indigo-500">Center</span></h2>
          <p className="text-slate-400 font-medium italic">Real-time intelligence and performance tracking.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all">Live</button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Historical</button>
        </div>
      </div>

      {/* Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600/20 via-slate-900/40 to-purple-600/20 backdrop-blur-3xl border-2 border-indigo-500/20 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>
          <div className="relative">
            <div className="p-6 bg-indigo-600 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] shrink-0 relative z-10">
                <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 scale-150"></div>
          </div>
          <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">AI Insight</span>
                <span className="text-slate-500 text-xs font-medium">Updated 2m ago</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Weekly Performance Surge</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium max-w-2xl">
                  Your reach has surged by <span className="text-emerald-400 font-black italic">12.4%</span> this week. 
                  <span className="mx-4 text-slate-700">/</span>
                  <span className="text-indigo-300 font-black italic underline decoration-indigo-500/50 underline-offset-4">Instagram</span> is currently your highest-converting channel.
              </p>
          </div>
          <button className="bg-white text-slate-950 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-black transition-all text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 shrink-0">
            Full Analysis
          </button>
      </motion.div>

      <div className="flex gap-10 border-b border-slate-800/50">
         {[
             { id: 'Performance', label: 'Performance' },
             { id: 'Listening', label: 'Social Listening' },
             { id: 'Competitors', label: 'Market Benchmarks' }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id.toLowerCase() as any)}
             className={clsx(
               "px-2 py-6 font-black text-[10px] uppercase tracking-[0.25em] transition-all relative group",
               activeTab === tab.id.toLowerCase() ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
             )}
           >
             {tab.label}
             {activeTab === tab.id.toLowerCase() ? (
               <motion.div 
                 layoutId="activeTab"
                 className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-t-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
               />
             ) : (
               <div className="absolute bottom-0 left-0 w-0 h-1 bg-slate-800 transition-all group-hover:w-full rounded-t-full" />
             )}
           </button>
         ))}
      </div>

      {/* Tab: Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { label: "Total Reach", val: "4,650", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "+12%" },
                  { label: "Engagements", val: "245", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", trend: "+8%" },
                  { label: "Viral Shares", val: "57", icon: Share2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+24%" },
                  { label: "Conversions", val: "94", icon: MousePointer2, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", trend: "+5%" }
              ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all group shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3.5 ${stat.bg} ${stat.border} border-2 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 uppercase tracking-widest">{stat.trend}</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{stat.val}</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  </motion.div>
              ))}
           </div>

           {/* Viral Velocity Chart */}
           <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none"></div>
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative z-10">
                   <div>
                       <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                           <Activity className="w-8 h-8 text-emerald-400" /> Content Momentum
                       </h3>
                       <p className="text-slate-500 mt-2 font-medium italic">Real-time engagement acceleration across all active channels.</p>
                   </div>
                   <div className="flex items-center gap-4 bg-slate-950/50 p-2 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
                       <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
                           <span className="text-[10px] text-blue-400 uppercase font-black tracking-[0.15em]">Reach</span>
                       </div>
                       <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                           <span className="text-[10px] text-emerald-400 uppercase font-black tracking-[0.15em]">Velocity</span>
                       </div>
                   </div>
               </div>
               <div className="h-[400px] w-full relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={velocityData}>
                           <defs>
                               <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                               <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                           <XAxis 
                             dataKey="time" 
                             stroke="#475569" 
                             fontSize={10} 
                             fontWeight="bold"
                             tickLine={false} 
                             axisLine={false} 
                             dy={20}
                           />
                           <YAxis 
                             stroke="#475569" 
                             fontSize={10} 
                             fontWeight="bold"
                             tickLine={false} 
                             axisLine={false} 
                             dx={-20}
                           />
                           <Tooltip 
                               contentStyle={{ 
                                 backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                 border: '1px solid rgba(255, 255, 255, 0.1)', 
                                 borderRadius: '20px',
                                 backdropFilter: 'blur(16px)',
                                 padding: '16px',
                                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                               }}
                               itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                           />
                           <Area type="monotone" dataKey="reach" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReach)" strokeWidth={4} />
                           <Area type="monotone" dataKey="velocity" stroke="#10b981" fillOpacity={1} fill="url(#colorVelocity)" strokeWidth={4} />
                       </AreaChart>
                   </ResponsiveContainer>
               </div>
           </div>

           <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-white tracking-tight">Live Content Performance</h3>
                <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] bg-indigo-500/5 px-6 py-3 rounded-xl border border-indigo-500/20 transition-all">Export Intelligence</button>
              </div>
              {publishedPosts.length === 0 ? (
                  <div className="text-center py-24 bg-slate-950/50 rounded-[2rem] border-2 border-dashed border-slate-800/50">
                    <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-10 h-10 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active content detected</p>
                  </div>
              ) : (
                  <div className="grid gap-6">
                      {publishedPosts.map((post, i) => (
                          <motion.div 
                            key={post.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-slate-950/50 rounded-[2rem] border border-slate-800/50 flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between group hover:bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-500"
                          >
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-4 mb-4">
                                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                                        {renderPlatformIcon(post.platform)}
                                      </div>
                                      <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] block">{post.platform}</span>
                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </div>
                                  </div>
                                  <p className="text-slate-200 text-lg line-clamp-1 font-bold tracking-tight italic">"{post.content}"</p>
                              </div>
                              
                              {post.metrics && (
                                  <div className="flex items-center gap-10 shrink-0 bg-slate-900/50 px-8 py-5 rounded-2xl border border-slate-800/50 backdrop-blur-xl">
                                      <div className="text-center">
                                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Reach</p>
                                          <p className="text-2xl font-black text-white leading-none">{post.metrics.views.toLocaleString()}</p>
                                      </div>
                                      <div className="text-center border-l border-slate-800/50 pl-10">
                                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Likes</p>
                                          <p className="text-2xl font-black text-emerald-400 leading-none">{post.metrics.likes.toLocaleString()}</p>
                                      </div>
                                      <div className="text-center border-l border-slate-800/50 pl-10">
                                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">Eng. Rate</p>
                                          <p className="text-2xl font-black text-indigo-400 leading-none">{(post.metrics.likes / post.metrics.views * 100).toFixed(1)}%</p>
                                      </div>
                                  </div>
                              )}
                          </motion.div>
                      ))}
                  </div>
              )}
           </div>
        </div>
      )}

      {/* Tab: Listening */}
      {activeTab === 'listening' && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-8 space-y-8">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-white tracking-tight">Global Brand Mentions</h3>
                  <button className="bg-slate-900/50 hover:bg-indigo-600 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-800/50 flex items-center gap-3 transition-all">
                      <Search className="w-4 h-4" /> Configure Keywords
                  </button>
               </div>
               
               <div className="grid gap-6">
                 {mentions.map((mention, i) => (
                     <motion.div 
                        key={mention.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group shadow-2xl relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                      <User className="w-8 h-8 text-slate-500" />
                                  </div>
                                  <div className="absolute -bottom-2 -right-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                                    {renderPlatformIcon(mention.platform)}
                                  </div>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white leading-none mb-2 tracking-tight">{mention.user}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{mention.platform}</p>
                                </div>
                            </div>
                            <span className={clsx(
                                "text-[10px] px-4 py-1.5 rounded-full border-2 font-black uppercase tracking-[0.2em] shadow-lg", 
                                mention.sentiment === 'Positive' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10" : 
                                mention.sentiment === 'Negative' ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10" : 
                                "bg-slate-800/50 border-slate-700 text-slate-400"
                            )}>
                                {mention.sentiment}
                            </span>
                        </div>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed font-medium italic">"{mention.content}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                          <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Detected 2h ago</span>
                          <button className="text-[10px] text-indigo-400 hover:text-white font-black bg-indigo-500/5 border-2 border-indigo-500/20 px-8 py-3 rounded-2xl hover:bg-indigo-600 hover:border-indigo-600 transition-all uppercase tracking-[0.2em] shadow-xl">Engage Intelligence</button>
                        </div>
                     </motion.div>
                 ))}
               </div>
            </div>
            
             <div className="lg:col-span-4 space-y-10">
                <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
                    <h3 className="font-black text-white mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]">
                        <PieChartIcon className="w-5 h-5 text-emerald-400" /> Sentiment Analysis
                    </h3>
                    <div className="h-[280px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={115}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#0f172a', 
                                      border: '1px solid #1e293b', 
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-5xl font-black text-white leading-none tracking-tighter">65%</span>
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-3">Positive</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-800/50">
                        {sentimentData.map(s => (
                            <div key={s.name} className="text-center">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">{s.name}</p>
                                <p className="text-xl font-black text-white">{s.value}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/10 to-slate-950 border-2 border-indigo-500/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="font-black text-white mb-3 flex items-center gap-3 tracking-tight text-lg">
                      <Search className="w-5 h-5 text-indigo-400" /> Active Watchlist
                    </h3>
                    <p className="text-xs text-slate-500 mb-8 font-medium italic">Real-time alerts active for these keywords:</p>
                    <div className="flex flex-wrap gap-3">
                        {['bakery', 'sourdough', 'croissant', 'gluten free', 'Sunny Side', 'pastry chef'].map(k => (
                            <span key={k} className="bg-slate-900/50 border border-slate-800/50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-default shadow-lg">
                                {k}
                            </span>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                      Manage Watchlist
                    </button>
                </div>
             </div>
         </div>
      )}


      {/* Tab: Competitors */}
      {activeTab === 'competitors' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {competitors.map((comp, i) => (
                      <motion.div 
                        key={comp.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl group"
                      >
                          <div className="p-8 border-b border-slate-800/50 bg-slate-950/50 flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                  <div className={`w-16 h-16 rounded-2xl ${comp.avatarColor} flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:rotate-6 transition-transform duration-500`}>{comp.name[0]}</div>
                                  <div>
                                      <h4 className="font-black text-xl text-white tracking-tight">{comp.name}</h4>
                                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{comp.handle}</p>
                                  </div>
                              </div>
                              <button className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors">
                                <Activity className="w-5 h-5" />
                              </button>
                          </div>
                          <div className="p-10">
                              <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Latest Intelligence</p>
                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">24h ago</span>
                              </div>
                              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800/50 mb-6 relative group-hover:border-indigo-500/30 transition-colors">
                                  <p className="text-slate-200 text-lg italic font-medium leading-relaxed">"{comp.latestPost.content}"</p>
                                  <div className="absolute -bottom-4 right-8 bg-indigo-600 px-4 py-2 rounded-xl border-2 border-slate-950 flex items-center gap-2 shadow-2xl">
                                      <Heart className="w-4 h-4 text-white fill-white" />
                                      <span className="text-xs font-black text-white">{comp.latestPost.likes.toLocaleString()}</span>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-10">
                                <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50 text-center">
                                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Avg. Reach</p>
                                  <p className="text-xl font-black text-white">12.4K</p>
                                </div>
                                <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50 text-center">
                                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Growth</p>
                                  <p className="text-xl font-black text-emerald-400">+4.2%</p>
                                </div>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default MonitorPage;

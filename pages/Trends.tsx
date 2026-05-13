
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_TRENDS, MOCK_VIRAL_FORMATS } from '../constants';
import { Trend, ViralFormat } from '../types';
import { reverseEngineerStrategy } from '../services/geminiService';
import { Flame, ArrowUpRight, Sparkles, Video, Instagram, Twitter, Linkedin, Copy, Play, Search, Ghost, Loader2, ShieldAlert, Zap } from 'lucide-react';
import clsx from 'clsx';

const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tech' | 'Finance' | 'Pop Culture'>('All');
  const [spyUrl, setSpyUrl] = useState('');
  const [isSpying, setIsSpying] = useState(false);
  const [spyResult, setSpyResult] = useState<{ analysis: string; counterStrategy: string } | null>(null);

  const handleSpy = async () => {
    if (!spyUrl) return;
    setIsSpying(true);
    try {
        const result = await reverseEngineerStrategy(spyUrl);
        setSpyResult(result);
    } catch (e) {
        console.error(e);
    } finally {
        setIsSpying(false);
    }
  };

  const filteredTrends = activeCategory === 'All' 
    ? MOCK_TRENDS 
    : MOCK_TRENDS.filter(t => t.category === activeCategory);

  const handleUseTrend = (trend: Trend) => {
      const hook = trend.aiHookSuggestion || `Hot Take on ${trend.topic}`;
      navigate('/studio', { 
          state: { 
              coreMessage: `${hook}\n\n(Context: ${trend.description})`,
              platforms: trend.platforms,
              format: 'Post'
          }
      });
  };

  const handleUseFormat = (format: ViralFormat) => {
    navigate('/studio', { 
        state: { 
            coreMessage: `[Format: ${format.name}]\n${format.example}`,
            platforms: ['Instagram', 'TikTok'],
            format: format.format
        }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3 font-heading tracking-tight">
                <Flame className="w-10 h-10 text-orange-500 animate-pulse" /> TrendHunter
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-display text-lg">
                Stop guessing. See what's viral right now and let AI write the hook for you.
            </p>
         </div>
      </div>

      {/* Competitor Spy Tool (WOW Feature) */}
      <div className="glass border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl group">
          {/* Hardware-style grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] dark:opacity-[0.07]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
          
          <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div className="flex items-center gap-6">
                      <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-500/40 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                          <Ghost className="w-8 h-8 text-white" />
                      </div>
                      <div>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2 font-heading tracking-tight">Competitor Strategy Spy</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-base font-display">AI-powered reverse engineering of market rivals.</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/80 px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] font-display">Neural Engine Active</span>
                  </div>
              </div>

              <div className="max-w-3xl">
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed font-sans">
                      Paste a competitor's post URL or describe their campaign. Nexocial will <span className="text-indigo-600 dark:text-indigo-400 font-bold">deconstruct their psychological triggers</span> and suggest a superior counter-move.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative group/input">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="https://instagram.com/p/..." 
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-3xl pl-16 pr-8 py-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all text-lg placeholder:text-slate-400 font-sans"
                            value={spyUrl}
                            onChange={e => setSpyUrl(e.target.value)}
                          />
                      </div>
                      <button 
                        onClick={handleSpy}
                        disabled={isSpying || !spyUrl}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white px-12 py-5 rounded-3xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl shadow-indigo-500/30 group/btn active:scale-95 font-heading"
                      >
                          {isSpying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                          <span className="uppercase tracking-[0.2em] text-xs">Spy & Counter</span>
                      </button>
                  </div>
              </div>

              {spyResult && (
                  <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="glass border border-slate-200 dark:border-white/10 p-10 rounded-[2rem] relative group/card">
                          <div className="absolute top-6 right-8 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] font-display">Analysis Report</div>
                          <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-orange-500/10 rounded-2xl">
                                <ShieldAlert className="w-6 h-6 text-orange-500" />
                              </div>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] font-display">The Deconstruction</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-sans">{spyResult.analysis}</p>
                      </div>
                      <div className="bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-500/20 p-10 rounded-[2rem] relative">
                          <div className="absolute top-6 right-8 text-[10px] font-black text-indigo-600/50 dark:text-indigo-400/50 uppercase tracking-[0.2em] font-display">AI Recommendation</div>
                          <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-indigo-600/10 rounded-2xl">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                              </div>
                              <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] font-display">The Counter-Move</h4>
                          </div>
                          <p className="text-slate-900 dark:text-slate-100 text-xl leading-relaxed mb-10 font-heading font-medium italic">"{spyResult.counterStrategy}"</p>
                          <button 
                            onClick={() => navigate('/studio', { state: { coreMessage: `Counter-Strategy to competitor: ${spyResult.counterStrategy}` } })}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-[0.2em] text-xs font-heading"
                          >
                              Execute Counter-Content <ArrowUpRight className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* Quick Categories */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {['All', 'Tech', 'Finance', 'Pop Culture'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={clsx(
                    "px-10 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap font-display",
                    activeCategory === cat 
                    ? "bg-orange-600 border-orange-500 text-white shadow-2xl shadow-orange-500/30 scale-105" 
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                  {cat}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Column: Trending Topics */}
          <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 font-heading tracking-tight">
                    <ArrowUpRight className="w-8 h-8 text-emerald-500" /> Rising Market Trends
                </h3>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] font-display">Updated 5m ago</span>
              </div>
              
              <div className="grid gap-8">
                  {filteredTrends.map(trend => (
                      <div key={trend.id} className="glass border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 hover:border-orange-500/30 transition-all group relative overflow-hidden shadow-xl">
                          {/* Background Glow */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                              <div className="flex-1">
                                  <div className="flex items-center gap-4 mb-6">
                                      <span className={clsx(
                                          "text-[10px] font-black uppercase px-4 py-1.5 rounded-full border tracking-[0.2em] font-display",
                                          trend.volume === 'Exploding' ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" :
                                          trend.volume === 'High' ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" :
                                          "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                      )}>
                                          {trend.volume} Velocity
                                      </span>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] font-display">{trend.category}</span>
                                  </div>
                                  <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-orange-500 transition-colors font-heading tracking-tight leading-none">{trend.topic}</h4>
                                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed font-sans">{trend.description}</p>
                                  
                                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/50 mb-10 relative group/hook">
                                      <div className="absolute -top-3 left-6 bg-white dark:bg-slate-950 px-3 flex items-center gap-2">
                                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] font-display">AI Hook Strategy</span>
                                      </div>
                                      <p className="text-slate-900 dark:text-slate-200 text-xl italic leading-relaxed font-heading font-medium">"{trend.aiHookSuggestion}"</p>
                                  </div>

                                  <button 
                                    onClick={() => handleUseTrend(trend)}
                                    className="w-full md:w-auto bg-slate-900 dark:bg-slate-900 hover:bg-orange-600 hover:text-white border border-slate-800 hover:border-orange-500 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs shadow-2xl group-hover:shadow-orange-500/20 active:scale-95 font-heading"
                                  >
                                      <Flame className="w-6 h-6" /> Newsjack This Trend
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Side Column: Viral Formats */}
          <div className="lg:col-span-4 space-y-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 font-heading tracking-tight">
                  <Video className="w-8 h-8 text-indigo-500" /> Viral Blueprints
              </h3>
              
              <div className="grid gap-8">
                  {MOCK_VIRAL_FORMATS.map(fmt => (
                      <div key={fmt.id} className="glass border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all shadow-xl group">
                          <div className="flex justify-between items-start mb-6">
                              <h4 className="font-black text-slate-900 dark:text-white text-xl leading-none font-heading tracking-tight">{fmt.name}</h4>
                              <span className={clsx(
                                  "text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border font-display",
                                  fmt.difficulty === 'Easy' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : 
                                  fmt.difficulty === 'Medium' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400" : 
                                  "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                              )}>
                                  {fmt.difficulty}
                              </span>
                          </div>
                          <p className="text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-sans">{fmt.description}</p>
                          <div className="bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl mb-8">
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono leading-relaxed">Example: {fmt.example}</p>
                          </div>
                          <button 
                            onClick={() => handleUseFormat(fmt)}
                            className="w-full py-4 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-black rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] transition-all font-display"
                          >
                              <Play className="w-4 h-4" /> Load Blueprint
                          </button>
                      </div>
                  ))}
              </div>

              {/* Competitor Spy (Mini) */}
              <div className="glass rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  <h3 className="font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] font-display">
                    <Ghost className="w-5 h-5 text-indigo-500" /> Rival Watchlist
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-10 font-display">Monitoring 12 key competitors in real-time.</p>
                  <div className="space-y-5">
                      <div className="flex items-center gap-5 p-4 bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer group/item shadow-sm">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-indigo-500/30 font-heading">S</div>
                          <div className="flex-1 min-w-0">
                              <p className="text-base font-black text-slate-900 dark:text-white truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors font-heading tracking-tight">SocialSuite</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest font-display">New post: "AI Safety"</p>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover/item:text-indigo-500 transition-colors" />
                      </div>
                      <button className="w-full py-4 text-[10px] font-black text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-[0.2em] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all font-display">
                        + Add Competitor
                      </button>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default Trends;


import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Bot, Calendar, ArrowRight, Sparkles, CheckCircle, Clock, Plus, Loader2, Globe, FileText, ScanSearch, Users } from 'lucide-react';
import { CampaignPostTemplate, ContentFormat, Platform, SocialPost } from '../types';
import clsx from 'clsx';

const Campaigns: React.FC = () => {
  const { generateCampaignPlan, generateContent, addPost, campaigns, addCampaign } = useApp();
  
  // Workflow State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  
  // Step 1: Training
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sampleContent, setSampleContent] = useState('');

  // Step 2: Input (Campaign Setup)
  const [campaignName, setCampaignName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(7);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Instagram', 'X']);
  const [targetAudience, setTargetAudience] = useState('');

  // Step 3: Plan
  const [generatedPlan, setGeneratedPlan] = useState<CampaignPostTemplate[]>([]);

  // Step 4: Content
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);

  const handleTrainAgent = async () => {
      if (!websiteUrl && !sampleContent) {
          if (!confirm("Skip training? The agent will use generic best practices.")) return;
      }
      setIsTraining(true);
      // Simulate scanning/learning delay
      setTimeout(() => {
          setIsTraining(false);
          setStep(2);
      }, 2000);
  };

  const handleCreatePlan = async () => {
    if (!campaignName || !goal || !startDate) return alert("Please fill in all fields");
    setLoading(true);
    try {
        const plan = await generateCampaignPlan(
            goal, 
            duration, 
            selectedPlatforms,
            { website: websiteUrl, sampleContent: sampleContent }, // Pass training data
            targetAudience // Pass audience
        );
        setGeneratedPlan(plan);
        setStep(3);
    } catch (e) {
        alert("Failed to generate plan");
    } finally {
        setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
        const allPosts: SocialPost[] = [];
        
        // Loop through plan items and generate content
        for (const item of generatedPlan) {
            const contextGoal = `${goal} - Post Intent: ${item.intent}`;
            const posts = await generateContent(contextGoal, { 
                platforms: [item.platform], 
                format: item.format as ContentFormat 
            });
            
            if (posts.length > 0) {
                const post = posts[0];
                // Calculate scheduled time based on start date + offset
                const start = new Date(startDate).getTime();
                const scheduleTime = start + (item.dayOffset * 86400000) + (9 * 3600000); // 9 AM
                
                allPosts.push({
                    ...post,
                    status: 'Scheduled',
                    scheduledTime: scheduleTime
                });
            }
        }
        setGeneratedPosts(allPosts);
        setStep(4);
    } catch (e) {
        alert("Error generating content");
    } finally {
        setLoading(false);
    }
  };

  const handleFinalize = () => {
    // Save campaign wrapper
    const newCampaign = {
        id: `camp-${Date.now()}`,
        name: campaignName,
        goal,
        startDate: new Date(startDate).getTime(),
        status: 'Active' as const,
        posts: generatedPosts.map(p => p.id)
    };
    addCampaign(newCampaign);

    // Save individual posts
    generatedPosts.forEach(post => addPost(post));
    
    setStep(5);
  };

  const resetWizard = () => {
    setStep(1);
    setCampaignName('');
    setGoal('');
    setWebsiteUrl('');
    setSampleContent('');
    setGeneratedPlan([]);
    setGeneratedPosts([]);
    setTargetAudience('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
        <div className="mb-6 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 font-heading tracking-tight">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
                        <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    Nexocial Campaign Manager
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-display">Plan and schedule entire marketing campaigns with one AI Agent.</p>
            </div>
            {step === 5 && (
                <button onClick={resetWizard} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all font-display">
                    + New Campaign
                </button>
            )}
        </div>

        {/* Wizard Container */}
        <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl glass">
            
            {/* Left: AI Agent Persona */}
            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white font-heading tracking-tight">Nexocial AI</h3>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] font-display">Strategy Engine v2.5</p>
                    </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Message bubbles */}
                    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">Hello! Before we plan your campaign, I can analyze your brand. Please share your website or best posts so I can learn your style.</p>
                    </div>

                    {isTraining && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl rounded-tl-none border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-3 animate-pulse">
                            <ScanSearch className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-spin" />
                            <p className="text-sm text-indigo-700 dark:text-indigo-200 font-medium font-display">Analyzing brand voice & patterns...</p>
                        </div>
                    )}
                    
                    {step >= 2 && (
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-left-2">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">Analysis complete! I understand your brand vibe. Now, tell me about this specific campaign.</p>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-left-2">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">I've generated a strategic schedule based on your goal <strong>"{goal}"</strong>. Take a look!</p>
                        </div>
                    )}

                    {step >= 4 && (
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-left-2">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">I've drafted the content for each post. Review them before we schedule.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Interactive Steps */}
            <div className="w-full md:w-2/3 p-10 overflow-y-auto bg-white dark:bg-slate-950">
                
                {/* Step 1: Agent Training */}
                {step === 1 && (
                    <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Train Your Agent</h3>
                            <p className="text-sm text-slate-500 font-display">Give your AI agent the context it needs to succeed.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-display">
                                    <Globe className="w-4 h-4 text-indigo-500" /> Website URL
                                </label>
                                <input 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-sans"
                                    placeholder="https://yourbusiness.com"
                                    value={websiteUrl}
                                    onChange={e => setWebsiteUrl(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 mt-2 font-display">The agent will visit your site to understand your products and tone.</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-display">
                                    <FileText className="w-4 h-4 text-indigo-500" /> High-Performing Content Examples
                                </label>
                                <textarea 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-40 resize-none transition-all font-sans"
                                    placeholder="Paste 2-3 of your best performing social posts here... This helps the AI learn what works for your audience."
                                    value={sampleContent}
                                    onChange={e => setSampleContent(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleTrainAgent}
                            disabled={isTraining}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 font-heading"
                        >
                            {isTraining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Analyze & Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Campaign Setup */}
                {step === 2 && (
                    <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Campaign Basics</h3>
                            <p className="text-sm text-slate-500 font-display">Define the core parameters of your marketing push.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 font-display">Campaign Name</label>
                                <input 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-sans"
                                    placeholder="e.g. Summer Sale 2026"
                                    value={campaignName}
                                    onChange={e => setCampaignName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 font-display">
                                    <Users className="w-4 h-4 text-indigo-500" /> Target Audience
                                </label>
                                <input 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-sans"
                                    placeholder="e.g. Gen Z Gamers, Corporate HR Managers"
                                    value={targetAudience}
                                    onChange={e => setTargetAudience(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 font-display">Primary Goal</label>
                                <textarea 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-32 resize-none transition-all font-sans"
                                    placeholder="e.g. Drive traffic to our new online store for the Black Friday sale. We want urgency."
                                    value={goal}
                                    onChange={e => setGoal(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 font-display">Start Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-sans"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 font-display">Duration</label>
                                    <select 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-sans appearance-none"
                                        value={duration}
                                        onChange={e => setDuration(Number(e.target.value))}
                                    >
                                        <option value={3}>3 Days (Mini)</option>
                                        <option value={7}>7 Days (Standard)</option>
                                        <option value={14}>14 Days (Extended)</option>
                                        <option value={30}>30 Days (Month)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setStep(1)} className="px-8 py-4 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition-all font-display">Back</button>
                            <button 
                                onClick={handleCreatePlan}
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 font-heading"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                Create Strategy
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Strategy Review */}
                {step === 3 && (
                    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest font-display">
                                <Sparkles className="w-3 h-3" /> Strategy Generated
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">Campaign Blueprint</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-display max-w-md mx-auto">I've architected a multi-channel sequence designed for maximum conversion and brand resonance.</p>
                        </div>

                        <div className="grid gap-4 relative">
                            {/* Vertical line for timeline feel */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            
                            {generatedPlan.map((item, idx) => (
                                <div key={idx} className="relative pl-0 sm:pl-14 group">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-600 z-10 hidden sm:block shadow-sm group-hover:scale-125 transition-transform" />
                                    
                                    <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                                            <span className="text-[9px] font-black uppercase font-display opacity-60">Day</span>
                                            <span className="text-xl font-black font-heading leading-none">{item.dayOffset + 1}</span>
                                        </div>
                                        
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.intent}</h4>
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-display">
                                                    {item.format}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">Strategic post focused on {item.intent.toLowerCase()} via {item.platform}.</p>
                                        </div>

                                        <div className="flex items-center gap-4 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-6">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-display">{item.platform}</div>
                                                <div className="text-[9px] text-slate-400 font-medium font-display">Optimal Time: 9:00 AM</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => setStep(2)} className="px-8 py-4 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition-all font-display border border-transparent hover:border-slate-200 dark:hover:border-slate-800">Back to Setup</button>
                            <button 
                                onClick={handleGenerateContent}
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 font-heading"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                                Generate All Content ({generatedPlan.length} Posts)
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Content Review */}
                {step === 4 && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest font-display">
                                <CheckCircle className="w-3 h-3" /> Content Ready
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">Review Your Posts</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-display max-w-md mx-auto">Nexocial AI has drafted high-impact copy tailored to your brand voice.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {generatedPosts.map((post, idx) => (
                                <div key={post.id} className="glass rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group">
                                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black font-heading shadow-md shadow-indigo-500/20">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-display">{post.platform}</div>
                                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-sans uppercase tracking-tighter">
                                                    {new Date(post.scheduledTime || 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • 09:00 AM
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-display mb-1">Voice Match</div>
                                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                                    style={{ width: `${post.voiceScore}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="relative">
                                            <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-500/20 rounded-full" />
                                            <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap italic">"{post.content}"</p>
                                        </div>
                                        
                                        {post.communityLink && (
                                            <div className="mt-auto pt-6">
                                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4 group/context hover:bg-indigo-500/10 transition-colors">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover/context:scale-110 transition-transform">
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-display mb-0.5">AI Context Injection</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono opacity-70">{post.communityLink}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest font-display transition-colors">Edit Draft</button>
                                        <button className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest font-display transition-colors">Regenerate</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => setStep(3)} className="px-8 py-4 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition-all font-display border border-transparent hover:border-slate-200 dark:hover:border-slate-800">Back to Blueprint</button>
                            <button 
                                onClick={handleFinalize}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25 active:scale-[0.98] font-heading"
                            >
                                <Calendar className="w-5 h-5" />
                                Deploy Full Campaign
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 max-w-lg mx-auto py-10">
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                            <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-6 hover:rotate-0 transition-transform duration-700 group">
                                <CheckCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        
                        <div className="space-y-4 mb-12">
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-none">Campaign Live!</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-display leading-relaxed">
                                Strategy <strong className="text-indigo-600 dark:text-indigo-400 font-bold">"{campaignName}"</strong> has been deployed. Nexocial AI is now managing your presence across {selectedPlatforms.join(' & ')}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <button onClick={resetWizard} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all font-display border border-slate-200 dark:border-slate-800 shadow-sm">
                                New Campaign
                            </button>
                            <a href="#/calendar" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/30 font-display">
                                View Calendar <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="mt-16 p-6 glass rounded-3xl border border-slate-200 dark:border-white/5 w-full flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display mb-1">Next Action</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white font-heading">First post goes live in 14 hours</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default Campaigns;

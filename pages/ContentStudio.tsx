
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SocialPost, PostStatus, ContentFormat, Platform } from '../types';
import { Sparkles, AlertTriangle, Copy, Loader2, Calendar, X, Instagram, Facebook, Linkedin, Twitter, Youtube, RefreshCw, Image as ImageIcon, Save, Wand2, Pin, MapPin, Ghost, Hash, Video, AtSign, FileText, Smartphone, Film, MonitorPlay, GalleryHorizontal, ListTree, Layers, Lightbulb, Heart, MessageCircle, Share2, MoreHorizontal, ArrowRight, Laptop, Battery, Wifi, Signal, CheckCircle2, TrendingUp, Users, Bookmark, Zap, Clock, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

const PLATFORMS: { id: Platform; label: string; icon: any; color: string; bg: string }[] = [
  { id: 'Facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500' },
  { id: 'Instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500' },
  { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-700' },
  { id: 'X', label: 'X', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500' },
  { id: 'TikTok', label: 'TikTok', icon: Video, color: 'text-teal-400', bg: 'bg-teal-400' },
  { id: 'YouTube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600' },
  { id: 'Pinterest', label: 'Pinterest', icon: Pin, color: 'text-red-500', bg: 'bg-red-500' },
  { id: 'Google Business', label: 'Google Business', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500' },
  { id: 'Snapchat', label: 'Snapchat', icon: Ghost, color: 'text-yellow-400', bg: 'bg-yellow-400' },
  { id: 'Reddit', label: 'Reddit', icon: Hash, color: 'text-orange-500', bg: 'bg-orange-500' },
  { id: 'Threads', label: 'Threads', icon: AtSign, color: 'text-slate-200', bg: 'bg-slate-200' },
];

const FORMATS: { id: ContentFormat; label: string; icon: any; desc: string }[] = [
  { id: 'Post', label: 'Standard Post', icon: FileText, desc: 'Text & Image' },
  { id: 'Story', label: 'Story', icon: Smartphone, desc: 'Vertical Update' },
  { id: 'Reel', label: 'Reel / Short', icon: Film, desc: 'Short Video Script' },
  { id: 'Video', label: 'Video Script', icon: MonitorPlay, desc: 'Long Form' },
  { id: 'Carousel', label: 'Carousel', icon: GalleryHorizontal, desc: 'Multi-slide' },
  { id: 'Thread', label: 'Thread', icon: ListTree, desc: 'X/Threads' },
];

const CATEGORIZED_IDEAS = {
    "Promote": ["🎉 Product Launch", "⚡ Flash Sale", "🎁 Giveaway"],
    "Educate": ["💡 Expert Tip", "📚 How-To Guide", "🧠 Industry Insight"],
    "Engage": ["❓ Question", "🗳️ Poll", "👋 Behind the Scenes"]
};

// AI Thinking Animation Component
const AIThinkingOverlay = ({ isVisible }: { isVisible: boolean }) => {
    const [thought, setThought] = useState("Analyzing Brand Voice...");
    
    useEffect(() => {
        if (!isVisible) return;
        const thoughts = [
            "Analyzing Brand Voice...",
            "Scanning Trending Hashtags...",
            "Optimizing for Virality...",
            "Generating Visual Concepts...",
            "Formatting for Platform...",
            "Polishing Tone..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            setThought(thoughts[i % thoughts.length]);
            i++;
        }, 1200);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-indigo-500/30"
                >
                    <div className="relative">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 rounded-full bg-indigo-500/20 absolute inset-0 -translate-x-4 -translate-y-4"
                        ></motion.div>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/30 absolute inset-0"
                        ></motion.div>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] relative z-10">
                            <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="mt-10 text-center space-y-3">
                        <motion.h3 
                            key={thought}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold text-white tracking-tight"
                        >
                            {thought}
                        </motion.h3>
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.div 
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-indigo-300/60 font-mono uppercase tracking-[0.2em]">Neural Engine Active</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Device Frame Component
const DeviceFrame = ({ children, mode }: { children?: React.ReactNode, mode: 'Mobile' | 'Desktop' }) => {
    if (mode === 'Mobile') {
        return (
            <motion.div 
                layout
                className="mx-auto w-[320px] rounded-[3rem] border-[12px] border-slate-900 bg-slate-950 shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-slate-800"
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-20 flex items-center justify-center gap-3">
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full opacity-40"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800 opacity-40"></div>
                </div>
                {/* Status Bar */}
                <div className="h-12 w-full bg-slate-950 flex items-center justify-between px-8 pt-4 text-[11px] font-bold text-slate-400 z-10 relative">
                    <span>9:41</span>
                    <div className="flex gap-2 items-center">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3.5 h-3.5" />
                        <Battery className="w-4 h-4" />
                    </div>
                </div>
                {/* Screen Content */}
                <div className="bg-slate-950 min-h-[550px] text-slate-200 overflow-y-auto scrollbar-hide relative">
                    {children}
                </div>
                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800 rounded-full z-20"></div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            layout
            className="w-full rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
        >
            {/* Browser Header */}
            <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-3">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                </div>
                <div className="flex-1 mx-6 h-6 bg-slate-900/50 rounded-md flex items-center px-3 text-[11px] text-slate-500 font-mono">
                    <span className="opacity-50">https://</span>social.network/feed
                </div>
            </div>
            <div className="p-8 min-h-[300px] bg-slate-950/50">
                {children}
            </div>
        </motion.div>
    );
};

const ContentStudio: React.FC = () => {
  const { generateContent, repurposePost, generateImage, addPost, restrictedTerms, currentUser } = useApp();
  const location = useLocation();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [coreMessage, setCoreMessage] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);

  // Generation Settings
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Instagram', 'LinkedIn', 'Twitter', 'Facebook']);
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('Post');

  // Preview Settings
  const [previewMode, setPreviewMode] = useState<'Mobile' | 'Desktop'>('Mobile');

  // Selection & Scheduling State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [postsToSchedule, setPostsToSchedule] = useState<SocialPost[]>([]);
  const [includeCommunityLink, setIncludeCommunityLink] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');

  // Repurpose State
  const [repurposeTargetId, setRepurposeTargetId] = useState<string | null>(null);
  const [repurposePlatform, setRepurposePlatform] = useState<Platform>('Instagram');
  const [repurposeFormat, setRepurposeFormat] = useState<ContentFormat>('Story');
  const [repurposeIncludeCommunityLink, setRepurposeIncludeCommunityLink] = useState(true);
  const [isRepurposing, setIsRepurposing] = useState(false);

  // Image Gen State
  const [generatingImageForId, setGeneratingImageForId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [viralityAnalysis, setViralityAnalysis] = useState<Record<string, { score: number, highlights: { text: string, impact: 'high' | 'medium' | 'low' }[] }>>({});
  const [isAnalyzingVirality, setIsAnalyzingVirality] = useState<string | null>(null);

  // Initialize repurpose settings when modal opens
  useEffect(() => {
    if (repurposeTargetId) {
      const originalPost = generatedPosts.find(p => p.id === repurposeTargetId);
      if (originalPost) {
        // Find a different platform if possible, or default to Instagram
        const otherPlatforms = PLATFORMS.filter(p => p.id !== originalPost.platform);
        const nextPlatform = otherPlatforms.length > 0 ? otherPlatforms[0].id : originalPost.platform;
        setRepurposePlatform(nextPlatform);
        
        const recFormats = getRecommendedFormats(nextPlatform);
        setRepurposeFormat(recFormats[0] || 'Post');
      }
    }
  }, [repurposeTargetId]);

  // Handle incoming data
  useEffect(() => {
    if (location.state) {
      const { coreMessage, platforms, format } = location.state as any;
      if (coreMessage) setCoreMessage(coreMessage);
      if (platforms) setSelectedPlatforms(platforms);
      if (format) setSelectedFormat(format);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === PLATFORMS.length) {
        setSelectedPlatforms([]);
    } else {
        setSelectedPlatforms(PLATFORMS.map(p => p.id));
    }
  };

  const handleUpdatePost = (id: string, field: keyof SocialPost, value: any) => {
    setGeneratedPosts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleEnhancePrompt = () => {
      if(!coreMessage) return;
      setCoreMessage(prev => prev + " (Make it engaging, professional, and viral-worthy)");
  };

  const handleGenerate = async () => {
    if (!coreMessage.trim()) return;
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform (e.g. Facebook).");
      return;
    }
    setIsGenerating(true);
    setSelectedIds([]);
    try {
      const posts = await generateContent(coreMessage, { platforms: selectedPlatforms, format: selectedFormat, visualPrompt, includeCommunityLink });
      setGeneratedPosts(posts);
      
      // Auto-scroll to results on mobile/desktop
      setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      
    } catch (e) {
      console.error(e);
      alert("Failed to generate. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (post: SocialPost) => {
    if (!post.visualPrompt) return;
    setGeneratingImageForId(post.id);
    try {
        const imageUrl = await generateImage(post.visualPrompt);
        if (imageUrl) {
            setGeneratedPosts(prev => prev.map(p => 
                p.id === post.id ? { ...p, imageUrl } : p
            ));
        } else {
            alert("Failed to generate image. Try again.");
        }
    } catch (e) {
        console.error(e);
        alert("Error generating image.");
    } finally {
        setGeneratingImageForId(null);
    }
  };

  const handlePredictVirality = async (post: SocialPost) => {
    setIsAnalyzingVirality(post.id);
    // Simulate AI analysis
    setTimeout(() => {
        const score = Math.floor(Math.random() * 40) + 60; // 60-100
        const words = post.content.split(' ');
        const highlights = words.slice(0, 5).map(w => ({
            text: w,
            impact: Math.random() > 0.5 ? 'high' : 'medium' as any
        }));
        
        setViralityAnalysis(prev => ({
            ...prev,
            [post.id]: { score, highlights }
        }));
        setIsAnalyzingVirality(null);
    }, 1500);
  };

  const handleRepurpose = async (originalPost: SocialPost) => {
    setIsRepurposing(true);
    try {
       const newPost = await repurposePost(originalPost, repurposePlatform, repurposeFormat, repurposeIncludeCommunityLink);
       setGeneratedPosts(prev => [newPost, ...prev]);
       setRepurposeTargetId(null); 
    } catch (e) {
       alert("Failed to repurpose.");
    } finally {
       setIsRepurposing(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === generatedPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(generatedPosts.map(p => p.id));
    }
  };

  const openScheduleModal = (posts: SocialPost[]) => {
      setPostsToSchedule(posts);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = tomorrow.getFullYear();
      const month = pad(tomorrow.getMonth() + 1);
      const day = pad(tomorrow.getDate());
      const hour = pad(tomorrow.getHours());
      const minute = pad(tomorrow.getMinutes());
      setScheduleDate(`${year}-${month}-${day}T${hour}:${minute}`);
  };

  const handleSingleAction = (post: SocialPost) => {
    if (post.flaggedKeywords.length > 0) {
      addPost(post);
      setGeneratedPosts(prev => prev.filter(p => p.id !== post.id));
      setSelectedIds(prev => prev.filter(id => id !== post.id));
      alert("Saved to Approvals. This post has some quality flags.");
    } else {
      openScheduleModal([post]);
    }
  };

  const handleSaveDraft = (post: SocialPost) => {
    addPost({ ...post, status: PostStatus.DRAFT });
    setGeneratedPosts(prev => prev.filter(p => p.id !== post.id));
    setSelectedIds(prev => prev.filter(id => id !== post.id));
    setShowSuccess("Post saved to drafts!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleBulkSchedule = () => {
    const selected = generatedPosts.filter(p => selectedIds.includes(p.id));
    if (selected.length === 0) return;
    openScheduleModal(selected);
  };

  const handleConfirmSchedule = () => {
    if (postsToSchedule.length === 0) return;
    if (!scheduleDate) {
      alert("Please select a date and time.");
      return;
    }
    const timestamp = new Date(scheduleDate).getTime();
    postsToSchedule.forEach(post => {
        const isFlagged = restrictedTerms.some(term => post.content.toLowerCase().includes(term.toLowerCase()));
        addPost({
            ...post,
            status: PostStatus.SCHEDULED,
            scheduledTime: timestamp
        });
    });
    
    const scheduledIds = postsToSchedule.map(p => p.id);
    setGeneratedPosts(prev => prev.filter(p => !scheduledIds.includes(p.id)));
    setSelectedIds(prev => prev.filter(id => !scheduledIds.includes(id)));
    setPostsToSchedule([]);
    setScheduleDate('');
    setShowSuccess(`Successfully scheduled ${scheduledIds.length} post${scheduledIds.length > 1 ? 's' : ''}!`);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const getRecommendedFormats = (platform: Platform): ContentFormat[] => {
      switch(platform) {
          case 'Instagram': return ['Post', 'Story', 'Reel', 'Carousel', 'Video'];
          case 'TikTok': return ['Reel', 'Video'];
          case 'YouTube': return ['Video', 'Reel'];
          case 'LinkedIn': return ['Post', 'Carousel', 'Video'];
          case 'X': return ['Post', 'Thread', 'Video'];
          case 'Pinterest': return ['Post', 'Video'];
          case 'Facebook': return ['Post', 'Story', 'Reel', 'Video', 'Carousel'];
          case 'Threads': return ['Post', 'Thread'];
          case 'Snapchat': return ['Story', 'Video'];
          case 'Reddit': return ['Post', 'Video'];
          case 'Google Business': return ['Post'];
          default: return ['Post'];
      }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
            <motion.div 
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 50, x: '-50%' }}
                className="fixed bottom-10 left-1/2 z-[100] bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 border border-indigo-400/30"
            >
                <CheckCircle2 className="w-5 h-5" />
                {showSuccess}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduling Modal */}
      {postsToSchedule.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
           <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Schedule {postsToSchedule.length} Post{postsToSchedule.length > 1 ? 's' : ''}
                </h3>
                <button onClick={() => setPostsToSchedule([])} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6">
                <input type="datetime-local" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setPostsToSchedule([])} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button onClick={handleConfirmSchedule} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">Confirm</button>
              </div>
           </div>
        </div>
      )}

      {/* Repurpose Modal */}
      {repurposeTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
           <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                 <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-blue-500" /> Repurpose Content
                    </h3>
                    <p className="text-slate-400 text-sm">Transform your content for a new channel using AI.</p>
                 </div>
                 <button onClick={() => setRepurposeTargetId(null)} className="text-slate-400 hover:text-white bg-slate-900 p-2 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="grid md:grid-cols-12 gap-8 mb-8">
                 {/* Left Column: Source */}
                 <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-slate-500"></div> Source Content
                         </h4>
                         {(() => {
                             const op = generatedPosts.find(p => p.id === repurposeTargetId);
                             const Icon = PLATFORMS.find(p => p.id === op?.platform)?.icon;
                             return op && Icon && (
                                 <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                     <Icon className="w-3 h-3" /> {op.platform}
                                 </span>
                             );
                         })()}
                    </div>
                    
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-slate-300 text-sm italic leading-relaxed relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 rounded-l-xl"></div>
                        "{generatedPosts.find(p => p.id === repurposeTargetId)?.content}"
                    </div>

                    <div className="flex justify-center py-4">
                         <div className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-600 rotate-90 md:rotate-0">
                             <ArrowRight className="w-5 h-5" />
                         </div>
                    </div>
                 </div>
                 
                 {/* Right Column: Destination Settings */}
                 <div className="md:col-span-7 space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> 1. Select Destination
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {PLATFORMS.map(p => {
                                const originalPost = generatedPosts.find(post => post.id === repurposeTargetId);
                                const isRec = originalPost && (() => {
                                    const map: Record<string, string[]> = {
                                        'Twitter': ['LinkedIn', 'Instagram', 'Threads'],
                                        'LinkedIn': ['Twitter', 'Facebook', 'Instagram'],
                                        'Instagram': ['TikTok', 'Facebook', 'Pinterest'],
                                        'TikTok': ['Instagram', 'YouTube'],
                                        'Facebook': ['Instagram', 'LinkedIn'],
                                        'YouTube': ['TikTok', 'Instagram'],
                                    };
                                    return map[originalPost.platform]?.includes(p.id);
                                })();
                                const Icon = p.icon;
                                const isSelected = repurposePlatform === p.id;

                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            setRepurposePlatform(p.id);
                                            const rec = getRecommendedFormats(p.id);
                                            setRepurposeFormat(rec[0]);
                                        }}
                                        className={clsx(
                                            "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 aspect-square",
                                            isSelected 
                                            ? "bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                                            : "bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <div className={clsx("p-2 rounded-lg transition-colors", isSelected ? "bg-slate-900" : "bg-slate-950")}>
                                            <Icon className={clsx("w-5 h-5", isSelected ? p.color : "text-slate-400")} />
                                        </div>
                                        <span className={clsx("text-[10px] font-bold text-center leading-tight", isSelected ? "text-white" : "text-slate-500")}>
                                            {p.label.split('(')[0]}
                                        </span>
                                        {isRec && (
                                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-400 z-10">
                                                Best
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-purple-500"></div> 2. Choose Format
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {FORMATS.map((fmt) => {
                                const fmtId = fmt.id;
                                const isRecommended = getRecommendedFormats(repurposePlatform).includes(fmtId);
                                const isSelected = repurposeFormat === fmtId;
                                const Icon = fmt.icon;
                                
                                return (
                                    <button
                                        key={fmtId}
                                        onClick={() => setRepurposeFormat(fmtId)}
                                        className={clsx(
                                            "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group relative overflow-hidden",
                                            isSelected
                                            ? "bg-purple-900/20 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                            : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                                        )}
                                    >
                                        <div className={clsx("p-2 rounded-lg shrink-0", isSelected ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-500 group-hover:text-slate-300")}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className={clsx("text-sm font-bold truncate", isSelected ? "text-white" : "text-slate-300")}>{fmt.label}</div>
                                            <div className="text-[10px] text-slate-500 truncate">{fmt.desc}</div>
                                        </div>
                                        {isRecommended && !isSelected && (
                                            <div className="absolute -top-1 -right-1 bg-purple-500/20 text-purple-400 text-[8px] font-bold px-1 rounded border border-purple-500/30">
                                                Rec
                                            </div>
                                        )}
                                        {isSelected && <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-purple-500 shadow"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div 
                                onClick={() => setRepurposeIncludeCommunityLink(!repurposeIncludeCommunityLink)}
                                className={clsx(
                                    "w-10 h-5 rounded-full relative transition-all duration-300",
                                    repurposeIncludeCommunityLink ? "bg-indigo-600" : "bg-slate-700"
                                )}
                            >
                                <div className={clsx(
                                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                                    repurposeIncludeCommunityLink ? "left-6" : "left-1"
                                )}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Include Smart Community Link</span>
                        </label>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-800 bg-slate-950 sticky bottom-0 z-20">
                 <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                     <Sparkles className="w-4 h-4 text-purple-500" />
                     <span>AI will rewrite contents to match platform best practices.</span>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto justify-end">
                     <button onClick={() => setRepurposeTargetId(null)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-bold">Cancel</button>
                     <button 
                        onClick={() => handleRepurpose(generatedPosts.find(p => p.id === repurposeTargetId)!)} 
                        disabled={isRepurposing} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                     >
                        {isRepurposing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Generate Remix
                     </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center shrink-0 mb-6">
        <div>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic font-heading">Content Studio</h2>
           <p className="text-slate-500 text-sm font-medium font-display">Design, generate, and schedule content with AI precision.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
            <button 
                onClick={() => setPreviewMode('Mobile')}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all font-display",
                    previewMode === 'Mobile' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
            >
                <Smartphone className="w-4 h-4" /> Mobile
            </button>
            <button 
                onClick={() => setPreviewMode('Desktop')}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all font-display",
                    previewMode === 'Desktop' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
            >
                <MonitorPlay className="w-4 h-4" /> Desktop
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        {/* Left Config Panel */}
        <div className="lg:col-span-4 h-full overflow-y-auto pr-2 pb-10 scrollbar-hide">
          <div className="space-y-6">
             {/* 1. Content Input */}
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative group focus-within:border-indigo-500/50 transition-all duration-500 glass overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 font-display">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50"></div>
                                01. Core Message
                            </label>
                            <button 
                                onClick={handleEnhancePrompt}
                                disabled={!coreMessage}
                                className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50 border border-indigo-500/20 font-display shadow-sm"
                            >
                                <Wand2 className="w-4 h-4" /> Enhance
                            </button>
                        </div>
                        
                        <textarea
                          className="w-full h-56 bg-white/50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xl leading-relaxed focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none mb-8 relative z-10 font-sans shadow-inner"
                          placeholder="What's the main idea for your post?"
                          value={coreMessage}
                          onChange={(e) => setCoreMessage(e.target.value)}
                        />

                        {/* Visual Direction Input */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/50 relative z-10">
                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] mb-5 flex items-center gap-3 font-display">
                                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                    <ImageIcon className="w-4 h-4 text-blue-500" />
                                </div>
                                02. Visual Style
                            </label>
                            <div className="relative group/input">
                                <input 
                                    type="text"
                                    className="w-full bg-white/50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 text-base text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans shadow-inner"
                                    placeholder="e.g. Minimalist, bright lighting, beach background..."
                                    value={visualPrompt}
                                    onChange={(e) => setVisualPrompt(e.target.value)}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                        </div>

                {/* Idea Starters Chips */}
                <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                    {Object.entries(CATEGORIZED_IDEAS).map(([category, ideas]) => (
                        ideas.map(idea => (
                            <button 
                                key={idea} 
                                onClick={() => setCoreMessage(prev => prev ? prev + " " + idea : idea)}
                                className="text-[9px] font-black uppercase tracking-widest bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 font-display"
                            >
                                {idea}
                            </button>
                        ))
                    ))}
                </div>
             </div>

             {/* 2. Platform Selection */}
             <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl glass">
                <div className="flex justify-between items-center mb-8">
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-display">03. Platforms</label>
                    <button 
                        onClick={handleSelectAllPlatforms}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-black uppercase tracking-widest flex items-center gap-2 bg-indigo-600/10 px-4 py-2 rounded-xl border border-indigo-500/20 transition-all font-display shadow-sm"
                    >
                        <Layers className="w-4 h-4" />
                        {selectedPlatforms.length === PLATFORMS.length ? 'Deselect' : 'Select All'}
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-5">
                   {PLATFORMS.map(p => {
                      const Icon = p.icon;
                      const isSelected = selectedPlatforms.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={clsx(
                             "relative flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 transition-all duration-500 gap-4 aspect-square group/plat",
                             isSelected 
                               ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-[0_20px_40px_rgba(99,102,241,0.2)] scale-[1.08] z-10" 
                               : "bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02]"
                          )}
                          title={p.label}
                        >
                           {isSelected && (
                               <motion.div 
                                 layoutId="plat-active"
                                 className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/50 border-2 border-white dark:border-slate-900 z-20"
                               >
                                   <CheckCircle2 className="w-4 h-4 text-white" />
                               </motion.div>
                           )}
                           <Icon className={clsx("w-8 h-8 transition-all duration-500 group-hover/plat:scale-110 group-hover/plat:rotate-6", isSelected ? p.color : "text-slate-400 dark:text-slate-600")} />
                           <span className={clsx("text-[9px] font-black uppercase tracking-[0.15em] transition-colors font-display", isSelected ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600")}>
                               {p.label.split(' ')[0]}
                           </span>
                        </button>
                      );
                   })}
                </div>
             </div>

              {/* 3. Format Selection */}
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl glass">
                <div className="flex items-center justify-between mb-8">
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-display">04. Format</label>
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-500/50"></div>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-display">Viral Optimized</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                   {FORMATS.map(f => {
                      const isSelected = selectedFormat === f.id;
                      const Icon = f.icon;
                      return (
                        <button 
                            key={f.id}
                            onClick={() => setSelectedFormat(f.id)}
                            className={clsx(
                                "flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left group relative overflow-hidden font-display",
                                isSelected 
                                ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-[0_20px_40px_rgba(99,102,241,0.15)] scale-[1.05] z-10" 
                                : "bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
                            )}
                        >
                            <div className={clsx("p-3 rounded-xl transition-all", isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-200/50 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-400")}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className={clsx("text-sm font-black uppercase tracking-tight truncate font-heading", isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>{f.label}</div>
                                <div className="text-[10px] text-slate-500 font-medium truncate font-display">{f.desc}</div>
                            </div>
                            {isSelected && <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></div>}
                        </button>
                      );
                   })}
                </div>
              </div>

              {/* 4. Smart Community Integration */}
              <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group/sc">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">05. Smart Community</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Growth Hack</span>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                </div>
                
                <div 
                    onClick={() => setIncludeCommunityLink(!includeCommunityLink)}
                    className={clsx(
                        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group/toggle",
                        includeCommunityLink 
                        ? "bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-900/10" 
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={clsx("p-3 rounded-xl transition-all", includeCommunityLink ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-slate-800 text-slate-500")}>
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={clsx("text-sm font-black uppercase tracking-tight", includeCommunityLink ? "text-white" : "text-slate-400")}>Append Community Link</p>
                            <p className="text-[10px] text-slate-500 font-medium">Promote your Smart Community in every post.</p>
                        </div>
                    </div>
                    <div className={clsx(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        includeCommunityLink ? "bg-blue-600" : "bg-slate-800"
                    )}>
                        <motion.div 
                            animate={{ x: includeCommunityLink ? 24 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                        />
                    </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !coreMessage}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white px-8 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-5 transition-all shadow-2xl shadow-indigo-900/40 text-2xl hover:scale-[1.02] active:scale-95 sticky bottom-0 z-10 border-b-4 border-indigo-800 group/gen font-heading overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isGenerating ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                      <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform shadow-lg" />
                  )}
                  <span>Generate Content</span>
              </button>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-8 h-full overflow-y-auto pb-20 pr-2 scrollbar-hide relative" ref={resultsRef}>
          
          <AIThinkingOverlay isVisible={isGenerating} />

          {generatedPosts.length === 0 && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl min-h-[500px] bg-slate-900/20 p-8">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                 <div className="p-6 bg-slate-950 rounded-full relative z-10 border border-slate-800 shadow-xl">
                    <Sparkles className="w-12 h-12 text-blue-500" />
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Ready to create magic?</h3>
              <p className="text-slate-400 max-w-sm text-center leading-relaxed mb-8">
                  Your AI assistant is ready. Select your platforms on the left and describe what you want to post about.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                 <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center text-center">
                    <Layers className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-xs font-bold text-slate-300">Multi-Channel</span>
                    <span className="text-[10px] text-slate-500">Auto-formatted for all apps</span>
                 </div>
                 <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center text-center">
                    <Wand2 className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-xs font-bold text-slate-300">AI Rewriting</span>
                    <span className="text-[10px] text-slate-500">Optimized tone & hashtags</span>
                 </div>
              </div>
            </div>
          )}

          {generatedPosts.length > 0 && (
             <div className="flex items-center justify-between bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 sticky top-0 z-20 backdrop-blur-xl shadow-2xl mb-8">
                <div className="flex items-center gap-4">
                    <input 
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === generatedPosts.length}
                        onChange={handleSelectAll}
                        className="w-6 h-6 rounded-lg border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                    />
                    <span className="text-sm font-black uppercase tracking-widest text-slate-300">
                        {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}
                    </span>
                </div>
                {selectedIds.length > 0 && (
                    <button 
                        onClick={handleBulkSchedule}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-900/40 active:scale-95 border-b-2 border-indigo-800"
                    >
                        <Calendar className="w-4 h-4" />
                        Schedule ({selectedIds.length})
                    </button>
                )}
             </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {generatedPosts.map((post, index) => {
                const PlatformIcon = PLATFORMS.find(p => p.id === post.platform)?.icon;
                const platformColor = PLATFORMS.find(p => p.id === post.platform)?.color || 'text-slate-400';
                
                return (
                <motion.div 
                    key={post.id} 
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.05 
                    }}
                    className="relative group bg-white dark:bg-slate-950/40 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-2xl hover:border-indigo-500/50 transition-all duration-500 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
                  
                  {/* Toolbar */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="relative">
                            <input 
                                type="checkbox"
                                checked={selectedIds.includes(post.id)}
                                onChange={() => handleToggleSelect(post.id)}
                                className="w-7 h-7 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all appearance-none checked:bg-indigo-600 checked:border-indigo-600"
                            />
                            {selectedIds.includes(post.id) && (
                                <CheckCircle2 className="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none" />
                            )}
                       </div>
                       <div className="flex items-center gap-4">
                            <div className={clsx("p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl", platformColor)}>
                                {PlatformIcon && <PlatformIcon className="w-6 h-6" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white leading-none mb-1.5">{post.platform}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Optimized</span>
                                </div>
                            </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-[9px] uppercase tracking-widest transition-all shadow-sm",
                            post.voiceScore > 80 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                        )}>
                            {post.voiceScore}% Match
                        </div>
                        <div className="relative group/more">
                            <button 
                                className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all text-slate-400 hover:text-indigo-600 dark:hover:text-white shadow-xl"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {/* Quick Action Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-50 p-2">
                                <button onClick={() => setRepurposeTargetId(post.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                    <RefreshCw className="w-4 h-4 text-blue-500" /> Remix Content
                                </button>
                                <button onClick={() => handleGenerateImage(post)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                    <ImageIcon className="w-4 h-4 text-purple-500" /> New Visual
                                </button>
                                <button onClick={() => handlePredictVirality(post)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Predict Virality
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                                <button onClick={() => setGeneratedPosts(prev => prev.filter(p => p.id !== post.id))} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold text-red-600 dark:text-red-400 transition-colors">
                                    <X className="w-4 h-4" /> Discard
                                </button>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Virality Heatmap */}
                  {post.viralityBreakdown && (
                      <div className="mb-8 grid grid-cols-4 gap-4 px-4 relative z-10">
                          {[
                              { label: 'Hook', value: post.viralityBreakdown.hook, color: 'bg-blue-500', icon: Zap },
                              { label: 'Visual', value: post.viralityBreakdown.visual, color: 'bg-purple-500', icon: ImageIcon },
                              { label: 'Emotional', value: post.viralityBreakdown.emotional, color: 'bg-pink-500', icon: Heart },
                              { label: 'Timing', value: post.viralityBreakdown.timing, color: 'bg-emerald-500', icon: Clock },
                          ].map(metric => (
                              <div key={metric.label} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center group/metric relative overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-xl">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                                    className={clsx("absolute bottom-0 left-0 h-1.5 opacity-30", metric.color)}
                                  ></motion.div>
                                  <metric.icon className={clsx("w-4 h-4 mb-2 opacity-50", metric.color.replace('bg-', 'text-'))} />
                                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{metric.label}</span>
                                  <span className="text-sm font-black text-slate-900 dark:text-white">{metric.value}%</span>
                                  
                                  {/* Hover Tooltip */}
                                  <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover/metric:opacity-100 flex items-center justify-center transition-all z-10">
                                      <span className="text-[9px] font-black text-white uppercase tracking-widest">AI Analysis</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* Device Frame Wrapper */}
                  <div className="flex-1 flex flex-col min-h-0 relative z-10">
                    <DeviceFrame mode={previewMode}>
                       {/* Social Feed Item Style */}
                       <div className={clsx("bg-transparent h-full flex flex-col", previewMode === 'Mobile' ? "p-6" : "p-4")}>
                           {/* Mock Social Header */}
                           <div className="flex items-center gap-4 mb-5">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-xl transform -rotate-3">
                                  {currentUser?.name.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">{currentUser?.name || 'Your Brand'}</p>
                                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">@{currentUser?.companyName.replace(/\s+/g, '').toLowerCase() || 'brandhandle'}</p>
                              </div>
                              <div className="p-2 text-slate-300 dark:text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer">
                                  <MoreHorizontal className="w-5 h-5" />
                              </div>
                           </div>

                           {/* Editable Content */}
                           <div className="relative group/edit mb-5">
                               <textarea 
                                  className="w-full bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium focus:outline-none resize-none transition-all border-2 border-transparent focus:border-indigo-500/30 p-4 rounded-3xl shadow-inner scrollbar-hide"
                                  rows={post.imageUrl ? 3 : 8}
                                  value={post.content}
                                  onChange={(e) => handleUpdatePost(post.id, 'content', e.target.value)}
                                  placeholder="Write your caption here..."
                               />
                               <div className="absolute top-3 right-3 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                                   <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
                                       <Edit3 className="w-3 h-3 text-indigo-500" />
                                   </div>
                               </div>
                           </div>

                           {/* Smart Community Promotion Link */}
                           {post.communityLink && (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-3xl flex items-center gap-4 group/link cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all shadow-sm"
                              >
                                  <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                                      <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1.5">Smart Community</p>
                                      <p className="text-xs text-indigo-900 dark:text-indigo-200/80 truncate font-bold">{post.communityLink}</p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-indigo-500 group-hover/link:translate-x-1 transition-transform" />
                              </motion.div>
                           )}

                           {/* Visual Media */}
                           <div className="mb-6 flex-1 min-h-0">
                              {post.imageUrl ? (
                                  <div className="relative group/image h-full">
                                      <motion.img 
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          src={post.imageUrl} 
                                          alt="AI Generated" 
                                          className="w-full h-full object-cover rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all rounded-[2rem] flex items-end justify-center p-6">
                                          <button 
                                              onClick={() => handleGenerateImage(post)}
                                              disabled={generatingImageForId === post.id}
                                              className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                                          >
                                              {generatingImageForId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                              Regenerate Visual
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="h-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-[2rem] p-8 relative group/visual hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col items-center justify-center text-center">
                                      <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover/visual:scale-110 transition-transform">
                                          <ImageIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                      </div>
                                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3">AI Visual Concept</span>
                                      <textarea 
                                          className="w-full bg-transparent text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed resize-none focus:outline-none focus:text-slate-900 dark:focus:text-slate-200 transition-colors text-center"
                                          value={post.visualPrompt || ''}
                                          onChange={(e) => handleUpdatePost(post.id, 'visualPrompt', e.target.value)}
                                          rows={2}
                                          placeholder="Describe the image you want..."
                                      />
                                      {post.visualPrompt && (
                                          <button
                                              onClick={() => handleGenerateImage(post)}
                                              disabled={generatingImageForId === post.id}
                                              className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/40 transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                                          >
                                              {generatingImageForId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                              Generate Image
                                          </button>
                                      )}
                                  </div>
                              )}
                           </div>

                           {/* Mock Interaction Bar */}
                           <div className="flex items-center justify-between text-slate-400 dark:text-slate-600 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex gap-8">
                                  <div className="flex items-center gap-2 hover: pink-500 cursor-pointer transition-colors group/stat">
                                      <Heart className="w-6 h-6 group-hover/stat:fill-current" />
                                      <span className="text-xs font-bold">0</span>
                                  </div>
                                  <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors group/stat">
                                      <MessageCircle className="w-6 h-6 group-hover/stat:fill-current" />
                                      <span className="text-xs font-bold">0</span>
                                  </div>
                                  <div className="flex items-center gap-2 hover:text-emerald-400 cursor-pointer transition-colors group/stat">
                                      <Share2 className="w-6 h-6 group-hover/stat:fill-current" />
                                      <span className="text-xs font-bold">0</span>
                                  </div>
                              </div>
                              <Bookmark className="w-6 h-6 hover:text-amber-500 cursor-pointer transition-colors" />
                           </div>
                       </div>
                    </DeviceFrame>
                  </div>

                  {/* Warnings & Footer */}
                  <div className="mt-8 px-4 relative z-10">
                      {post.flaggedKeywords.length > 0 && (
                        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-100 dark:border-amber-500/20 rounded-[2rem] flex items-start gap-4 shadow-sm">
                            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Safety Warning</p>
                                <p className="text-xs text-amber-900/70 dark:text-amber-200/60 font-medium">
                                Flagged Keywords: <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{post.flaggedKeywords.join(', ')}</span>
                                </p>
                            </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-end gap-3 mb-8">
                        <button 
                            onClick={() => navigator.clipboard.writeText(post.content)} 
                            className="p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-500 transition-all hover:border-indigo-500/30 rounded-2xl shadow-xl group/btn" 
                            title="Copy text"
                        >
                            <Copy className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                            onClick={() => handleSaveDraft(post)} 
                            className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500/30 text-slate-600 dark:text-slate-300 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl hover:scale-105"
                        >
                            <Save className="w-4 h-4 text-indigo-500" /> Draft
                        </button>
                        <button 
                            onClick={() => handleSingleAction(post)} 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/40 flex items-center gap-3 hover:scale-105"
                        >
                            <Calendar className="w-4 h-4" /> Schedule
                        </button>
                        <button 
                            onClick={() => handlePredictVirality(post)}
                            disabled={isAnalyzingVirality === post.id}
                            className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl hover:scale-105"
                        >
                            {isAnalyzingVirality === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                            Predict
                        </button>
                      </div>

                      {viralityAnalysis[post.id] && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-100 dark:border-emerald-500/20 rounded-[2.5rem] overflow-hidden shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Virality Score</span>
                                </div>
                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 italic">{viralityAnalysis[post.id].score}%</span>
                            </div>
                            <div className="h-3 w-full bg-white dark:bg-slate-900 rounded-full overflow-hidden mb-4 shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${viralityAnalysis[post.id].score}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40"
                                />
                            </div>
                            <p className="text-sm text-emerald-900/70 dark:text-emerald-200/60 leading-relaxed font-medium italic">
                                "{viralityAnalysis[post.id].reasoning}"
                            </p>
                        </motion.div>
                      )}
                  </div>
                </motion.div>
              );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudio;

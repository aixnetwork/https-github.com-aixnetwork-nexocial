
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Rocket,
  Sparkles,
  Target,
  Globe,
  CheckCircle,
  ArrowRight,
  Bot,
  Zap,
  Layout,
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Loader2,
  Key,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { Platform, ContentFormat } from '../types';
import { runLlmDiagnostic } from '../services/usersService';

const STORAGE_KEY = (userId: string) => `nexocial_onboarding_${userId}`;

interface OnboardingDraft {
  step: number;
  companyName: string;
  description: string;
  suggestedTone: number;
  selectedPlatforms: Platform[];
  goal: string;
  firstPost: string;
  llmProvider: string;
  llmApiKey: string;
  llmModel: string;
}

function loadDraft(userId: string): Partial<OnboardingDraft> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const Onboarding: React.FC = () => {
  const { currentUser, completeOnboarding, updateBrandVoice, updateUserProfile, generateContent } = useApp();

  const draft = loadDraft(currentUser?.id ?? '');

  const [step, setStep] = useState(draft.step ?? 1);
  const [loading, setLoading] = useState(false);

  // Step 1: Brand Info
  const [companyName, setCompanyName] = useState(draft.companyName ?? currentUser?.companyName ?? '');
  const [description, setDescription] = useState(draft.description ?? '');

  // Step 2: AI Voice Analysis
  const [suggestedTone, setSuggestedTone] = useState<number>(draft.suggestedTone ?? 50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 3: Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(draft.selectedPlatforms ?? ['Instagram', 'X']);

  // Step 4: Goals
  const [goal, setGoal] = useState(draft.goal ?? 'Build brand awareness and engage with potential customers.');

  // Step 5: LLM API
  const [llmProvider, setLlmProvider] = useState(draft.llmProvider ?? 'Gemini');
  const [llmApiKey, setLlmApiKey] = useState(draft.llmApiKey ?? '');
  const [llmModel, setLlmModel] = useState(draft.llmModel ?? '');
  const [llmTesting, setLlmTesting] = useState(false);
  const [llmTestResult, setLlmTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Step 6: First Post
  const [firstPost, setFirstPost] = useState<string>(draft.firstPost ?? '');

  // Persist draft to localStorage whenever relevant state changes
  useEffect(() => {
    if (!currentUser?.id) return;
    const draft: OnboardingDraft = { step, companyName, description, suggestedTone, selectedPlatforms, goal, firstPost, llmProvider, llmApiKey, llmModel };
    localStorage.setItem(STORAGE_KEY(currentUser.id), JSON.stringify(draft));
  }, [step, companyName, description, suggestedTone, selectedPlatforms, goal, firstPost, llmProvider, llmApiKey, llmModel, currentUser?.id]);

  // Auto-generate first post when arriving at step 6 with no post yet
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step === 6 && !firstPost) {
      handleGenerateFirstPost();
    }
  }, [step]); // intentionally omits handleGenerateFirstPost to avoid re-triggering on re-renders

  const handleAnalyzeVoice = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setSuggestedTone(75); // Suggesting a more playful tone based on description
      setIsAnalyzing(false);
      setStep(2);
    }, 2000);
  };

  const handleGenerateFirstPost = async () => {
    setLoading(true);
    try {
      const posts = await generateContent(`Introduce ${companyName} to the world! We are: ${description}`, {
        platforms: [selectedPlatforms[0]],
        format: 'Post'
      });
      if (posts && posts.length > 0) {
        setFirstPost(posts[0].content);
      } else {
        setFirstPost(`Welcome to ${companyName}! We're excited to share our journey of ${description.substring(0, 50)}... with you all!`);
      }
    } catch {
      setFirstPost(`Hello world! We are ${companyName}. ${description.substring(0, 100)}... Stay tuned for more updates!`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLlm = async () => {
    if (!llmApiKey.trim()) return;
    setLlmTesting(true);
    setLlmTestResult(null);
    try {
      // Save settings to DB first so diagnostic can read them
      await updateUserProfile({
        llmSettings: { provider: llmProvider, apiKey: llmApiKey, modelName: llmModel || defaultModel(llmProvider), isEnabled: true },
      });
      const result = await runLlmDiagnostic();
      setLlmTestResult({ ok: true, message: `${result.provider} (${result.model}) — ${result.latency}ms` });
    } catch (err: unknown) {
      setLlmTestResult({ ok: false, message: err instanceof Error ? err.message : 'Connection failed' });
    } finally {
      setLlmTesting(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    await updateUserProfile({
      companyName,
      brandDescription: description,
      brandTone: suggestedTone,
      preferredPlatforms: selectedPlatforms,
      primaryGoal: goal,
      ...(llmApiKey ? { llmSettings: { provider: llmProvider, apiKey: llmApiKey, modelName: llmModel || defaultModel(llmProvider), isEnabled: true } } : {}),
    });
    updateBrandVoice({ description, targetScore: 85, tone: suggestedTone });
    await completeOnboarding();
    if (currentUser?.id) localStorage.removeItem(STORAGE_KEY(currentUser.id));
    setLoading(false);
  };

  const defaultModel = (provider: string) => {
    if (provider === 'Gemini') return 'gemini-2.0-flash';
    if (provider === 'OpenAI') return 'gpt-4o-mini';
    if (provider === 'Anthropic') return 'claude-haiku-4-5-20251001';
    return '';
  };

  const steps = [
    { id: 1, title: 'Brand', icon: Globe },
    { id: 2, title: 'Voice', icon: Bot },
    { id: 3, title: 'Channels', icon: Layout },
    { id: 4, title: 'Goals', icon: Target },
    { id: 5, title: 'AI Setup', icon: Key },
    { id: 6, title: 'Launch', icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-6 animate-bounce">
            <Zap className="text-white w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to Nexocial</h1>
          <p className="text-slate-400">Let's set up your AI Social Growth Engine in 60 seconds.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 px-4 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 -z-10 mx-12"></div>
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10",
                step >= s.id ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30" : "bg-slate-800 text-slate-500"
              )}>
                {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
              </div>
              <span className={clsx(
                "text-[10px] uppercase tracking-widest font-bold transition-colors",
                step >= s.id ? "text-indigo-400" : "text-slate-600"
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm min-h-[400px] flex flex-col">
          
          {/* Step 1: Brand Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">Tell us about your brand</h2>
              </div>
              <p className="text-slate-400 text-sm">Our AI uses this to learn your business and generate relevant content.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  <input 
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
                    placeholder="e.g. Acme Creative"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What do you do?</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors h-32 resize-none"
                    placeholder="e.g. We provide sustainable packaging solutions for e-commerce brands..."
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyzeVoice}
                disabled={!companyName || !description || isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:animate-pulse" />}
                Analyze Brand Voice
              </button>
            </div>
          )}

          {/* Step 2: Voice Analysis */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">Your AI Voice Profile</h2>
              </div>
              <p className="text-slate-400 text-sm">Based on your description, we've calibrated your AI's personality.</p>
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tone of Voice</span>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      {suggestedTone < 30 ? 'Professional' : suggestedTone < 70 ? 'Balanced' : 'Playful'}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={suggestedTone}
                    onChange={(e) => setSuggestedTone(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Serious</span>
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Playful</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Target Score</h4>
                    <p className="text-xl font-bold text-white">85% <span className="text-[10px] text-emerald-500 font-normal ml-1">Optimal</span></p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">AI Confidence</h4>
                    <p className="text-xl font-bold text-white">High</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Looks Good <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 3: Platforms */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Layout className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">Where should we post?</h2>
              </div>
              <p className="text-slate-400 text-sm">Select the platforms you want to focus on initially.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                  { id: 'X', icon: Twitter, color: 'text-blue-400' },
                  { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
                  { id: 'Facebook', icon: Facebook, color: 'text-blue-500' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (selectedPlatforms.includes(p.id as Platform)) {
                        setSelectedPlatforms(selectedPlatforms.filter(x => x !== p.id));
                      } else {
                        setSelectedPlatforms([...selectedPlatforms, p.id as Platform]);
                      }
                    }}
                    className={clsx(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                      selectedPlatforms.includes(p.id as Platform)
                        ? "bg-indigo-600/10 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    <p.icon className={clsx("w-5 h-5", selectedPlatforms.includes(p.id as Platform) ? p.color : "text-slate-600")} />
                    <span className="font-bold text-sm">{p.id}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(4)}
                disabled={selectedPlatforms.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">What's your primary goal?</h2>
              </div>
              <p className="text-slate-400 text-sm">This helps the AI prioritize the right type of content.</p>
              
              <div className="space-y-3">
                {[
                  "Build brand awareness and reach new audiences.",
                  "Drive sales and direct traffic to my website.",
                  "Establish thought leadership and industry authority.",
                  "Engage with my community and build loyalty."
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={clsx(
                      "w-full p-4 rounded-xl border transition-all text-left text-sm",
                      goal === g
                        ? "bg-indigo-600/10 border-indigo-500 text-white font-medium"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(5)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 5: LLM API Setup */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Key className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">Connect Your AI Engine</h2>
              </div>
              <p className="text-slate-400 text-sm">Nexocial uses your own AI API key to generate content. This keeps your data private and gives you full control over usage.</p>

              {/* Provider selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Gemini', 'OpenAI', 'Anthropic', 'Custom'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setLlmProvider(p); setLlmModel(''); setLlmTestResult(null); }}
                      className={clsx(
                        "p-3 rounded-xl border text-sm font-bold transition-all",
                        llmProvider === p
                          ? "bg-indigo-600/10 border-indigo-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">API Key</label>
                <input
                  type="password"
                  value={llmApiKey}
                  onChange={e => { setLlmApiKey(e.target.value); setLlmTestResult(null); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono text-sm"
                  placeholder={llmProvider === 'Gemini' ? 'AIza...' : llmProvider === 'OpenAI' ? 'sk-...' : llmProvider === 'Anthropic' ? 'sk-ant-...' : 'Your API key'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Model <span className="text-slate-600 normal-case font-normal">(optional — uses default if blank)</span>
                </label>
                <input
                  type="text"
                  value={llmModel}
                  onChange={e => setLlmModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
                  placeholder={defaultModel(llmProvider)}
                />
              </div>

              {/* Test result */}
              {llmTestResult && (
                <div className={clsx(
                  "flex items-start gap-3 p-4 rounded-xl border text-sm",
                  llmTestResult.ok
                    ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-300"
                    : "bg-red-900/20 border-red-500/30 text-red-300"
                )}>
                  {llmTestResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  {llmTestResult.message}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestLlm}
                disabled={!llmApiKey.trim() || llmTesting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {llmTesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {llmTestResult?.ok ? 'Connected — Continue' : 'Test Connection'}
              </button>

              {llmTestResult?.ok && (
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="text-xs text-slate-600 hover:text-slate-400 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Skip for now — I'll configure this in Settings
                </button>
              </div>
            </div>
          )}

          {/* Step 6: First Post */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold">Ready for Liftoff!</h2>
              </div>
              <p className="text-slate-400 text-sm">Here's your first AI-generated post. You can edit this later.</p>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[120px]">
                <div className="absolute top-0 right-0 p-2">
                  <span className="bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Preview</span>
                </div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    <p className="text-xs text-slate-500">Generating your first post…</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                        {companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{companyName}</p>
                        <p className="text-[10px] text-slate-500">Just now</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap italic">"{firstPost}"</p>
                  </>
                )}
              </div>

              <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-200 leading-relaxed">
                  <strong>Pro Tip:</strong> You can use the Content Studio to generate variations of this post for all your selected platforms in one click.
                </p>
              </div>

              <button
                onClick={handleFinish}
                disabled={loading || !firstPost}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                {loading ? 'Generating post…' : 'Enter Dashboard'}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            Powered by <a href="https://aixnetwork.net" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">AI X Network</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;

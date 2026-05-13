
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Check, CreditCard, Facebook, Instagram, Linkedin, Twitter, Youtube, Copy, DollarSign, Activity, AlertCircle, Loader2, RefreshCw, Plus, Search, X, Filter, Sparkles, Lock, Shield, User, Camera, Bell, Trash2, Mail, Terminal, BarChart, Database, Briefcase, Globe, Pin, MapPin, Ghost, Hash, Video, AtSign, MessageCircle, Layers, Cpu, Brain, Key } from 'lucide-react';
import { PLANS } from '../constants';
import { BillingPlan, PaymentProvider } from '../types';
import { analyzeBrandIdentity } from '../services/geminiService';
import { runLlmDiagnostic } from '../services/usersService';
import type { DiagnosticResult } from '../services/usersService';
import clsx from 'clsx';

interface PaymentModalProps {
  plan: BillingPlan;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (provider: PaymentProvider) => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, isOpen, onClose, onConfirm }) => {
  const [provider, setProvider] = useState<PaymentProvider>('Stripe');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(provider);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade to {plan.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">${plan.price}/month • Cancel anytime</p>
                </div>
                <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
            </div>

            {/* Provider Toggle */}
            <div className="p-6 pb-0">
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setProvider('Stripe')}
                        className={clsx(
                            "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                            provider === 'Stripe' ? "bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-xs font-bold">Card</span>
                    </button>
                    <button 
                        onClick={() => setProvider('PayPal')}
                        className={clsx(
                            "flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                            provider === 'PayPal' ? "bg-blue-600/10 border-blue-500 text-blue-600 dark:text-white" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <span className="italic font-bold font-serif text-lg">P</span>
                        <span className="text-xs font-bold">PayPal</span>
                    </button>
                </div>
            </div>

            {/* Forms */}
            <div className="p-6 pt-0">
                {provider === 'Stripe' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none font-mono text-sm"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Expiry</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none font-mono text-center"
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none font-mono text-center"
                                    value={cvc}
                                    onChange={e => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            Pay ${plan.price}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You will be redirected to PayPal to complete your purchase safely.</p>
                        <button 
                            onClick={(e) => handleSubmit(e)}
                            disabled={loading}
                            className="w-full bg-[#ffc439] hover:bg-[#f4bb36] text-blue-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Pay with <span className="italic font-bold">PayPal</span></span>}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> Secure 256-bit SSL Encrypted Payment
                </p>
            </div>
        </div>
    </div>
  );
}

const Settings: React.FC = () => {
  const {
    brandVoice, updateBrandVoice, integrations, toggleIntegration, testIntegration,
    currentPlan, processSubscription, currentUser, updateUserProfile,
    changePassword, deleteAccount,
    requestPayout, updateAffiliateCode, allUsers,
    send2faSetupCode, enable2fa, disable2fa,
  } = useApp();
  const [description, setDescription] = useState(brandVoice.description);
  const [tone, setTone] = useState(brandVoice.tone ?? 50);
  const [activeTab, setActiveTab] = useState<'profile' | 'my brand' | 'engagement' | 'llm api' | 'connect accounts' | 'subscription' | 'affiliate'>('profile');
  
  // Profile State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.companyName || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);
  const [show2faEnableModal, setShow2faEnableModal] = useState(false);
  const [enable2faCode, setEnable2faCode] = useState('');
  const [enable2faError, setEnable2faError] = useState('');
  const [enable2faSending, setEnable2faSending] = useState(false);
  const [enable2faCodeSent, setEnable2faCodeSent] = useState(false);
  const [show2faDisableModal, setShow2faDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disablePasswordError, setDisablePasswordError] = useState('');

  // Notifications State
  const [notifEmailDigest, setNotifEmailDigest] = useState(currentUser?.notifEmailDigest ?? true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(currentUser?.notifAnnouncements ?? true);
  const [notifSecurityAlerts, setNotifSecurityAlerts] = useState(currentUser?.notifSecurityAlerts ?? true);
  const [notifSaving, setNotifSaving] = useState(false);

  // Change Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);

  // Engagement State
  const [autoReply, setAutoReply] = useState(brandVoice.engagement?.autoReplyEnabled ?? true);
  const [replySentiments, setReplySentiments] = useState(brandVoice.engagement?.replyToSentiment ?? ['Positive', 'Neutral']);
  const [maxReplies, setMaxReplies] = useState(brandVoice.engagement?.maxRepliesPerHour ?? 10);
  const [escalationKeywords, setEscalationKeywords] = useState(brandVoice.engagement?.escalationKeywords.join(', ') ?? '');
  const [toneMatch, setToneMatch] = useState(brandVoice.engagement?.aiToneMatch ?? true);

  // Integration Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newAffiliateCode, setNewAffiliateCode] = useState(currentUser?.affiliate?.code || '');
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  // Brand voice save state
  const [voiceSaving, setVoiceSaving] = useState(false);
  const [voiceSaveSuccess, setVoiceSaveSuccess] = useState(false);

  // Engagement save state
  const [engagementSaving, setEngagementSaving] = useState(false);
  const [engagementSaveSuccess, setEngagementSaveSuccess] = useState(false);

  // LLM save state
  const [llmSaving, setLlmSaving] = useState(false);
  const [llmSaveSuccess, setLlmSaveSuccess] = useState(false);
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResult, setDiagResult] = useState<DiagnosticResult | null>(null);
  const [diagError, setDiagError] = useState('');

  // Affiliate code save state
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeError, setCodeError] = useState('');

  // LLM State
  const [llmProvider, setLlmProvider] = useState(brandVoice.llm?.provider ?? 'Gemini');
  const [llmApiKey, setLlmApiKey] = useState(brandVoice.llm?.apiKey ?? '');
  const [llmModelName, setLlmModelName] = useState(brandVoice.llm?.modelName ?? 'gemini-3-flash-preview');
  const [llmBaseUrl, setLlmBaseUrl] = useState(brandVoice.llm?.baseUrl ?? '');
  const [llmEnabled, setLlmEnabled] = useState(brandVoice.llm?.isEnabled ?? true);

  const handleSaveLlm = async () => {
    setLlmSaving(true);
    try {
      const llmSettings = {
        provider: llmProvider as any,
        apiKey: llmApiKey,
        modelName: llmModelName,
        baseUrl: llmBaseUrl,
        isEnabled: llmEnabled,
      };
      await updateUserProfile({ llmSettings });
      updateBrandVoice({ ...brandVoice, llm: llmSettings });
      setLlmSaveSuccess(true);
      setTimeout(() => setLlmSaveSuccess(false), 3000);
    } finally {
      setLlmSaving(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setDiagRunning(true);
    setDiagResult(null);
    setDiagError('');
    try {
      const result = await runLlmDiagnostic();
      setDiagResult(result);
    } catch (err: any) {
      setDiagError(err instanceof Error ? err.message : 'Diagnostic failed');
    } finally {
      setDiagRunning(false);
    }
  };

  const handleUpdateCode = async () => {
    if (!newAffiliateCode.trim()) return;
    const code = newAffiliateCode.trim().toUpperCase();
    setCodeSaving(true);
    setCodeError('');
    try {
      await updateAffiliateCode(code);
      setIsEditingCode(false);
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Failed to update code');
    } finally {
      setCodeSaving(false);
    }
  };

  const handlePayout = async () => {
    setIsPayoutLoading(true);
    setPayoutError('');
    try {
      await requestPayout();
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Payout request failed');
    } finally {
      setIsPayoutLoading(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Social' | 'CRM' | 'Productivity' | 'Marketing' | 'Analytics'>('All');

  // Payment Modal State
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);

  // Brand Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileCompany(currentUser.companyName);
      setProfileEmail(currentUser.email);
      setTwoFactorEnabled(currentUser.twoFactorEnabled ?? false);
      setNotifEmailDigest(currentUser.notifEmailDigest ?? true);
      setNotifAnnouncements(currentUser.notifAnnouncements ?? true);
      setNotifSecurityAlerts(currentUser.notifSecurityAlerts ?? true);
    }
  }, [currentUser]);

  const connectedIntegrations = integrations.filter(i => i.connected);
  
  const availableIntegrations = integrations.filter(i => 
      !i.connected && 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeCategory === 'All' || i.category === activeCategory)
  );

  const handleSaveVoice = async () => {
    setVoiceSaving(true);
    try {
      await updateUserProfile({ brandDescription: description, brandTone: tone });
      updateBrandVoice({ ...brandVoice, description, tone });
      setVoiceSaveSuccess(true);
      setTimeout(() => setVoiceSaveSuccess(false), 3000);
    } finally {
      setVoiceSaving(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      await updateUserProfile({ name: profileName, companyName: profileCompany });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setDisablePassword('');
      setDisablePasswordError('');
      setShow2faDisableModal(true);
    } else {
      setEnable2faCode('');
      setEnable2faError('');
      setEnable2faCodeSent(false);
      setShow2faEnableModal(true);
    }
  };

  const handleSend2faCode = async () => {
    setEnable2faSending(true);
    setEnable2faError('');
    try {
      await send2faSetupCode();
      setEnable2faCodeSent(true);
    } catch (err: unknown) {
      setEnable2faError(err instanceof Error ? err.message : 'Failed to send code.');
    } finally {
      setEnable2faSending(false);
    }
  };

  const handleConfirmEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorSaving(true);
    setEnable2faError('');
    try {
      await enable2fa(enable2faCode);
      setTwoFactorEnabled(true);
      setShow2faEnableModal(false);
    } catch (err: unknown) {
      setEnable2faError(err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleConfirmDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorSaving(true);
    setDisablePasswordError('');
    try {
      await disable2fa(disablePassword);
      setTwoFactorEnabled(false);
      setShow2faDisableModal(false);
    } catch (err: unknown) {
      setDisablePasswordError(err instanceof Error ? err.message : 'Failed to disable 2FA.');
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      await updateUserProfile({ notifEmailDigest, notifAnnouncements, notifSecurityAlerts });
    } finally {
      setNotifSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    setPasswordError('');
    try {
      await changePassword(currentPassword, newPassword);
      // changePassword logs the user out on success
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteSaving(true);
    try {
      await deleteAccount();
    } catch {
      setDeleteSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsAnalyzing(true);
    // Gather info
    const connectedApps = integrations.filter(i => i.connected).map(i => i.name);
    // Heuristic for website if not explicitly stored: use email domain or company name
    const websiteHint = currentUser?.email.split('@')[1] || currentUser?.companyName || '';
    
    try {
        const result = await analyzeBrandIdentity(
            currentUser?.companyName || 'My Brand',
            websiteHint,
            connectedApps
        );
        setDescription(result.description);
        setTone(result.tone);
    } catch (e) {
        console.error(e);
        alert("Could not analyze brand automatically. Please fill in details manually.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const updatePlan = (plan: BillingPlan) => {
      setSelectedPlan(plan);
  }

  const handlePaymentConfirm = async (provider: PaymentProvider) => {
      if(selectedPlan) {
          await processSubscription(selectedPlan.name, provider);
      }
  }

  const renderIntegrationIcon = (icon: string) => {
    switch(icon) {
        // Core Social
        case 'facebook': return <Facebook className="w-5 h-5 text-[#1877F2]" />;
        case 'instagram': return <Instagram className="w-5 h-5 text-[#E4405F]" />;
        case 'twitter': return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
        case 'linkedin': return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
        case 'youtube': return <Youtube className="w-5 h-5 text-[#FF0000]" />;
        case 'tiktok': return <Video className="w-5 h-5 text-[#000000]" />;
        case 'pinterest': return <Pin className="w-5 h-5 text-[#BD081C]" />;
        case 'google-business': return <MapPin className="w-5 h-5 text-[#4285F4]" />;
        case 'snapchat': return <Ghost className="w-5 h-5 text-[#FFFC00]" />;
        case 'reddit': return <Hash className="w-5 h-5 text-[#FF4500]" />;
        case 'threads': return <AtSign className="w-5 h-5 text-white" />;
        
        // CRM
        case 'hubspot': return <span className="font-bold text-xs text-[#FF7A59]">HUB</span>;
        case 'salesforce': return <span className="font-bold text-xs text-[#00A1E0]">SF</span>;
        case 'zoho': return <span className="font-bold text-xs text-[#F44336]">ZOHO</span>;
        case 'pipedrive': return <span className="font-bold text-xs text-[#22D07D]">PIPE</span>;
        
        // Marketing & Email
        case 'mailchimp': return <MessageCircle className="w-5 h-5 text-[#FFE01B]" />;
        case 'sparkpost': return <Terminal className="w-5 h-5 text-[#FF5A5F]" />;
        case 'sendgrid': return <Mail className="w-5 h-5 text-[#009DD9]" />;
        case 'activecampaign': return <span className="font-bold text-xs text-[#3564E6]">AC</span>;
        case 'klaviyo': return <span className="font-bold text-xs text-white">KL</span>;
        
        // Productivity
        case 'google': return <Globe className="w-5 h-5 text-[#4285F4]" />;
        case 'slack': return <Layers className="w-5 h-5 text-[#4A154B]" />;
        case 'teams': return <span className="font-bold text-xs text-[#6264A7]">TEAMS</span>;
        case 'notion': return <span className="font-bold text-xs text-white">N</span>;
        
        // Analytics
        case 'google-analytics': return <BarChart className="w-5 h-5 text-[#F9AB00]" />;
        case 'segment': return <Database className="w-5 h-5 text-[#52BD95]" />;
        case 'mixpanel': return <BarChart className="w-5 h-5 text-[#7856FF]" />;
        case 'hotjar': return <span className="font-bold text-xs text-[#FF2C00]">HJ</span>;
        
        default: return <Briefcase className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
      
      {/* Payment Modal */}
      {selectedPlan && (
          <PaymentModal 
            plan={selectedPlan} 
            isOpen={true} 
            onClose={() => setSelectedPlan(null)} 
            onConfirm={handlePaymentConfirm}
          />
      )}

      {/* Add Integration Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh]">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Integrations Directory</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Connect your social accounts, CRMs, and marketing tools.</p>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                      <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                          <input 
                              type="text" 
                              placeholder="Search apps (e.g. Mailchimp, Salesforce, TikTok)..." 
                              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                          />
                      </div>
                      
                      {/* Categories */}
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {['All', 'Social', 'CRM', 'Productivity', 'Marketing', 'Analytics'].map(cat => (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat as any)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap",
                                    activeCategory === cat
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600"
                                )}
                              >
                                  {cat}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableIntegrations.length === 0 ? (
                          <div className="col-span-full text-center py-10 text-slate-500">
                              <p>No matching integrations found.</p>
                          </div>
                      ) : (
                          availableIntegrations.map(app => (
                              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-400 dark:hover:border-slate-600 transition-all group">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                          {renderIntegrationIcon(app.icon)}
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-900 dark:text-white text-sm">{app.name}</div>
                                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{app.category}</div>
                                      </div>
                                  </div>
                                  <button 
                                      onClick={() => toggleIntegration(app.id)}
                                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-900/20"
                                  >
                                      Connect
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Control how Nexocial works for you.</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
         {['Profile', 'My Brand', 'Engagement', 'LLM API', 'Connect Accounts', 'Subscription', 'Affiliate'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab.toLowerCase() as any)}
             className={clsx(
               "px-4 py-2 font-medium text-sm transition-colors relative whitespace-nowrap",
               activeTab === tab.toLowerCase() 
                 ? "text-indigo-600 dark:text-indigo-400" 
                 : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
             )}
           >
             {tab}
             {activeTab === tab.toLowerCase() && (
               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 -mb-1"></div>
             )}
           </button>
         ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center gap-4">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl">
                              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-4xl font-bold text-slate-900 dark:text-white overflow-hidden relative group cursor-pointer">
                                  {currentUser?.name.charAt(0)}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Camera className="w-8 h-8 text-white" />
                                  </div>
                              </div>
                          </div>
                          <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">Change Photo</button>
                      </div>

                      {/* Details Form */}
                      <div className="flex-1 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                  <div className="relative">
                                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                      <input 
                                          type="text" 
                                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                                          value={profileName}
                                          onChange={e => setProfileName(e.target.value)}
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Name</label>
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                                      value={profileCompany}
                                      onChange={e => setProfileCompany(e.target.value)}
                                  />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                  <input 
                                      type="email" 
                                      disabled
                                      className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                      value={profileEmail}
                                  />
                                  <p className="text-[10px] text-slate-500 mt-1">Contact support to change your email.</p>
                              </div>
                          </div>

                          {profileError && (
                            <p className="text-sm text-red-500 whitespace-pre-line">{profileError}</p>
                          )}
                          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {profileSuccess && (
                              <span className="text-sm text-emerald-500 flex items-center gap-1">
                                <Check className="w-4 h-4" /> Saved
                              </span>
                            )}
                            <button
                              onClick={handleUpdateProfile}
                              disabled={profileSaving}
                              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
                            >
                              {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Changes
                            </button>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Security
                      </h3>
                      <div className="space-y-4">
                          {/* Password row */}
                          <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <div>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">Password</p>
                                      <p className="text-xs text-slate-500">Change your account password</p>
                                  </div>
                                  <button
                                      onClick={() => { setShowPasswordForm(v => !v); setPasswordError(''); }}
                                      className="text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white px-3 py-1.5 rounded transition-colors"
                                  >
                                      {showPasswordForm ? 'Cancel' : 'Change'}
                                  </button>
                              </div>
                              {showPasswordForm && (
                                  <form onSubmit={handleChangePassword} className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                                      <input
                                          type="password"
                                          placeholder="Current password"
                                          value={currentPassword}
                                          onChange={e => setCurrentPassword(e.target.value)}
                                          required
                                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                                      />
                                      <input
                                          type="password"
                                          placeholder="New password (min 8 chars, 1 uppercase, 1 number)"
                                          value={newPassword}
                                          onChange={e => setNewPassword(e.target.value)}
                                          required
                                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                                      />
                                      <input
                                          type="password"
                                          placeholder="Confirm new password"
                                          value={confirmNewPassword}
                                          onChange={e => setConfirmNewPassword(e.target.value)}
                                          required
                                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                                      />
                                      {passwordError && <p className="text-xs text-red-500 whitespace-pre-line">{passwordError}</p>}
                                      <button
                                          type="submit"
                                          disabled={passwordSaving}
                                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                                      >
                                          {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                          Update Password
                                      </button>
                                      <p className="text-[10px] text-slate-500 text-center">You will be logged out after changing your password.</p>
                                  </form>
                              )}
                          </div>
                          {/* 2FA row */}
                          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                              <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">2FA Authentication</p>
                                  <p className="text-xs text-slate-500">{twoFactorEnabled ? 'Enabled' : 'Not enabled'}</p>
                              </div>
                              <button
                                  onClick={handleToggle2FA}
                                  disabled={twoFactorSaving}
                                  className={clsx(
                                      "text-xs border px-3 py-1.5 rounded transition-colors flex items-center gap-1",
                                      twoFactorEnabled
                                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                          : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                  )}
                              >
                                  {twoFactorSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Enable 2FA Modal */}
                  {show2faEnableModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                      <div className="bg-white dark:bg-[#131825] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Enable Two-Factor Auth</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                          {enable2faCodeSent ? 'Enter the 6-digit code sent to your email.' : "We'll send a verification code to your registered email."}
                        </p>
                        {!enable2faCodeSent ? (
                          <div className="space-y-3">
                            {enable2faError && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg px-3 py-2">{enable2faError}</p>}
                            <button onClick={handleSend2faCode} disabled={enable2faSending} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                              {enable2faSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                              Send Verification Code
                            </button>
                            <button onClick={() => setShow2faEnableModal(false)} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 bg-transparent border-0 cursor-pointer">Cancel</button>
                          </div>
                        ) : (
                          <form onSubmit={handleConfirmEnable2fa} className="space-y-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              required
                              className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center text-2xl font-mono tracking-[0.4em] text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                              placeholder="------"
                              value={enable2faCode}
                              onChange={e => setEnable2faCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                            {enable2faError && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg px-3 py-2">{enable2faError}</p>}
                            <button type="submit" disabled={twoFactorSaving || enable2faCode.length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                              {twoFactorSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                              Verify & Enable
                            </button>
                            <button type="button" onClick={() => setShow2faEnableModal(false)} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 bg-transparent border-0 cursor-pointer">Cancel</button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Disable 2FA Modal */}
                  {show2faDisableModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                      <div className="bg-white dark:bg-[#131825] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Disable Two-Factor Auth</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Enter your current password to confirm.</p>
                        <form onSubmit={handleConfirmDisable2fa} className="space-y-3">
                          <input
                            type="password"
                            required
                            className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 outline-none"
                            placeholder="Current Password"
                            value={disablePassword}
                            onChange={e => setDisablePassword(e.target.value)}
                          />
                          {disablePasswordError && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg px-3 py-2">{disablePasswordError}</p>}
                          <button type="submit" disabled={twoFactorSaving || !disablePassword} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                            {twoFactorSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Disable 2FA
                          </button>
                          <button type="button" onClick={() => setShow2faDisableModal(false)} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2 bg-transparent border-0 cursor-pointer">Cancel</button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Notifications
                      </h3>
                      <div className="space-y-3">
                          {([
                              { label: 'Email digests', value: notifEmailDigest, set: setNotifEmailDigest },
                              { label: 'New feature announcements', value: notifAnnouncements, set: setNotifAnnouncements },
                              { label: 'Security alerts', value: notifSecurityAlerts, set: setNotifSecurityAlerts },
                          ] as const).map(({ label, value, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                                  <button
                                      onClick={() => { set((v: boolean) => !v); }}
                                      className={clsx(
                                          "w-10 h-5 rounded-full relative transition-colors",
                                          value ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                                      )}
                                  >
                                      <div className={clsx(
                                          "absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all",
                                          value ? "right-1" : "left-1"
                                      )} />
                                  </button>
                              </div>
                          ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                          <button
                              onClick={handleSaveNotifications}
                              disabled={notifSaving}
                              className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                          >
                              {notifSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                          </button>
                      </div>
                  </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" /> Danger Zone
                  </h3>
                  {!showDeleteConfirm ? (
                      <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Permanently delete your account and all data.</p>
                          <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="text-xs bg-red-600 border border-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors"
                          >
                              Delete Account
                          </button>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          <p className="text-sm text-red-600 dark:text-red-400 font-bold">This action is irreversible. Type <span className="font-mono bg-red-100 dark:bg-red-900/30 px-1 rounded">DELETE</span> to confirm.</p>
                          <input
                              type="text"
                              placeholder="Type DELETE to confirm"
                              value={deleteConfirmText}
                              onChange={e => setDeleteConfirmText(e.target.value)}
                              className="w-full bg-white dark:bg-slate-950 border border-red-300 dark:border-red-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-red-500 outline-none"
                          />
                          <div className="flex gap-3 justify-end">
                              <button
                                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                  className="text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                  Cancel
                              </button>
                              <button
                                  onClick={handleDeleteAccount}
                                  disabled={deleteConfirmText !== 'DELETE' || deleteSaving}
                                  className="text-xs bg-red-600 border border-red-600 text-white hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg font-bold flex items-center gap-1 transition-colors"
                              >
                                  {deleteSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                  Confirm Delete
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* General Tab: Brand Voice */}
      {activeTab === 'my brand' && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Brand Voice & Personality</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400">How should we sound?</label>
                  <button 
                      onClick={handleAutoDetect}
                      disabled={isAnalyzing}
                      className="text-xs flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-white px-3 py-1.5 rounded-lg transition-all"
                  >
                      {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Auto-Detect from Socials
                  </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Describe your business tone (e.g., "Professional but friendly," "Exciting and loud," "Calm and helpful"). The AI will copy this style.
              </p>
              <textarea 
                className={clsx(
                    "w-full h-40 bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none leading-relaxed transition-all",
                    isAnalyzing ? "border-purple-500/50 animate-pulse" : "border-slate-200 dark:border-slate-700"
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing}
                placeholder={isAnalyzing ? "Analyzing your digital footprint..." : "Enter your brand description here..."}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Brand Soul Visualization</label>
                        <p className="text-[10px] text-slate-500">AI-mapped personality dimensions</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-500/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        LIVE ANALYSIS
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Radar Chart SVG */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Background Hexagon */}
                            <polygon points="50,5 93,30 93,70 50,95 7,70 7,30" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
                            <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            
                            {/* Axis Lines */}
                            <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="93" y2="30" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="93" y2="70" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="7" y2="70" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="50" y1="50" x2="7" y2="30" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="0.5" />

                            {/* Data Polygon (Dynamic based on tone) */}
                            {/* Dimensions: Professional, Playful, Bold, Minimal, Emotional, Technical */}
                            <polygon 
                                points={`
                                    50,${20 + (100 - tone) * 0.3} 
                                    ${50 + tone * 0.4},${50 - tone * 0.2} 
                                    ${50 + (100 - tone) * 0.4},${50 + (100 - tone) * 0.2} 
                                    50,${50 + tone * 0.4} 
                                    ${50 - (100 - tone) * 0.4},${50 + (100 - tone) * 0.2} 
                                    ${50 - tone * 0.4},${50 - tone * 0.2}
                                `} 
                                fill="rgba(99, 102, 241, 0.3)" 
                                stroke="#6366f1" 
                                strokeWidth="2"
                                className="transition-all duration-700 ease-out"
                            />
                            
                            {/* Glow Dots */}
                            <circle cx="50" cy={20 + (100 - tone) * 0.3} r="2" fill="#6366f1" />
                            <circle cx={50 + tone * 0.4} cy={50 - tone * 0.2} r="2" fill="#6366f1" />
                        </svg>
                        
                        {/* Labels */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500 uppercase">Professional</div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500 uppercase">Playful</div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-4 text-[8px] font-bold text-slate-500 uppercase rotate-90">Bold</div>
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 text-[8px] font-bold text-slate-500 uppercase -rotate-90">Minimal</div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Dominant Trait</p>
                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{tone > 50 ? 'Creative Energy' : 'Authority'}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Consistency</p>
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">98%</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Your brand soul is currently mapped as <span className="text-slate-900 dark:text-white font-bold">{tone > 50 ? 'Approachable & Dynamic' : 'Structured & Reliable'}</span>. 
                            This visualization updates in real-time as you adjust your brand description and tone profile.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Tone Profile</label>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                        {tone < 20 ? 'Very Serious' : tone < 40 ? 'Professional' : tone < 60 ? 'Balanced' : tone < 80 ? 'Casual' : 'Very Playful'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Serious</span>
                    <div className="relative flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500" 
                            style={{ width: `${tone}%` }}
                        ></div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={tone} 
                            onChange={(e) => setTone(Number(e.target.value))}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-600 pointer-events-none transition-all duration-500"
                            style={{ left: `calc(${tone}% - 8px)` }}
                        ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Playful</span>
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
              {voiceSaveSuccess && (
                <span className="text-sm text-emerald-500 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved
                </span>
              )}
              <button
                onClick={handleSaveVoice}
                disabled={voiceSaving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                {voiceSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Auto-Engagement</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Let Nexocial handle community interactions automatically.</p>
                      </div>
                      <div 
                        onClick={() => setAutoReply(!autoReply)}
                        className={clsx(
                            "w-14 h-7 rounded-full relative cursor-pointer transition-colors",
                            autoReply ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                        )}
                      >
                          <div className={clsx(
                              "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
                              autoReply ? "right-1" : "left-1"
                          )}></div>
                      </div>
                  </div>

                  <div className="space-y-8">
                      {/* Sentiment Filters */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-4">Reply to Sentiments</label>
                          <div className="flex flex-wrap gap-3">
                              {['Positive', 'Neutral', 'Negative', 'Sarcastic'].map((s: any) => (
                                  <button
                                      key={s}
                                      onClick={() => {
                                          setReplySentiments(prev => 
                                              prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                                          );
                                      }}
                                      className={clsx(
                                          "px-4 py-2 rounded-lg border text-sm font-bold transition-all",
                                          replySentiments.includes(s)
                                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                                      )}
                                  >
                                      {s}
                                  </button>
                              ))}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-2 italic">Pro Tip: We recommend only auto-replying to Positive and Neutral comments initially.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Replies Per Hour</label>
                              <div className="flex items-center gap-4">
                                  <input 
                                      type="range" 
                                      min="1" 
                                      max="50" 
                                      value={maxReplies}
                                      onChange={(e) => setMaxReplies(Number(e.target.value))}
                                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                  />
                                  <span className="text-sm font-bold text-slate-900 dark:text-white w-8">{maxReplies}</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">AI Tone Matching</label>
                              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-sm text-slate-600 dark:text-slate-300">Match Brand Voice</span>
                                  <div 
                                    onClick={() => setToneMatch(!toneMatch)}
                                    className={clsx(
                                        "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                                        toneMatch ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                                    )}
                                  >
                                      <div className={clsx(
                                          "absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all",
                                          toneMatch ? "right-1" : "left-1"
                                      )}></div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Escalation Keywords</label>
                          <textarea 
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-slate-300 text-sm focus:border-indigo-500 outline-none h-24"
                              placeholder="e.g. lawsuit, refund, scam, manager..."
                              value={escalationKeywords}
                              onChange={(e) => setEscalationKeywords(e.target.value)}
                          />
                          <p className="text-[10px] text-slate-500 mt-2">If any of these words appear, Nexocial will NOT auto-reply and will flag the message for human review.</p>
                      </div>

                      <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                          {engagementSaveSuccess && (
                            <span className="text-sm text-emerald-500 flex items-center gap-1">
                              <Check className="w-4 h-4" /> Saved
                            </span>
                          )}
                          <button
                            onClick={async () => {
                                setEngagementSaving(true);
                                try {
                                  const settings = {
                                      autoReplyEnabled: autoReply,
                                      replyToSentiment: replySentiments as any,
                                      maxRepliesPerHour: maxReplies,
                                      escalationKeywords: escalationKeywords.split(',').map(k => k.trim()).filter(k => k),
                                      aiToneMatch: toneMatch
                                  };
                                  await updateUserProfile({ engagementSettings: settings });
                                  updateBrandVoice({ ...brandVoice, engagement: settings });
                                  setEngagementSaveSuccess(true);
                                  setTimeout(() => setEngagementSaveSuccess(false), 3000);
                                } finally {
                                  setEngagementSaving(false);
                                }
                            }}
                            disabled={engagementSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                          >
                              {engagementSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Engagement Rules
                          </button>
                      </div>
                  </div>
              </div>

              {/* Engagement Stats (Visual Only) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">AI Replies (24h)</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">142</p>
                      <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[65%]"></div>
                      </div>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Sentiment Lift</p>
                      <p className="text-2xl font-bold text-emerald-600">+18%</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">vs manual response time</p>
                  </div>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Escalations</p>
                      <p className="text-2xl font-bold text-amber-600">4</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">Handed over to humans</p>
                  </div>
              </div>
          </div>
      )}

      {/* LLM API Tab */}
      {activeTab === 'llm api' && (
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Brain className="w-6 h-6 text-indigo-500" /> LLM Configuration
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure the AI engine powering your content and engagement.</p>
                      </div>
                      <div 
                        onClick={() => setLlmEnabled(!llmEnabled)}
                        className={clsx(
                            "w-14 h-7 rounded-full relative cursor-pointer transition-colors",
                            llmEnabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                        )}
                      >
                          <div className={clsx(
                              "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
                              llmEnabled ? "right-1" : "left-1"
                          )}></div>
                      </div>
                  </div>

                  <div className="space-y-8">
                      {/* Provider Selection */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-4">AI Provider</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {['Gemini', 'OpenAI', 'Anthropic', 'Custom'].map((p) => (
                                  <button
                                      key={p}
                                      onClick={() => setLlmProvider(p as any)}
                                      className={clsx(
                                          "p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                                          llmProvider === p
                                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-white shadow-lg shadow-indigo-900/10"
                                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                      )}
                                  >
                                      {p === 'Gemini' && <Sparkles className="w-6 h-6" />}
                                      {p === 'OpenAI' && <Cpu className="w-6 h-6" />}
                                      {p === 'Anthropic' && <Brain className="w-6 h-6" />}
                                      {p === 'Custom' && <Terminal className="w-6 h-6" />}
                                      <span className="text-xs font-bold">{p}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">API Key</label>
                              <div className="relative">
                                  <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                  <input 
                                      type="password" 
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors font-mono text-sm"
                                      placeholder="••••••••••••••••"
                                      value={llmApiKey}
                                      onChange={(e) => setLlmApiKey(e.target.value)}
                                  />
                              </div>
                              <p className="text-[10px] text-slate-500 mt-2">Your API key is stored securely and never shared.</p>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model Name</label>
                              <div className="relative">
                                  <Layers className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors text-sm"
                                      placeholder={llmProvider === 'Gemini' ? 'gemini-3-flash-preview' : llmProvider === 'OpenAI' ? 'gpt-4o' : 'claude-3-sonnet'}
                                      value={llmModelName}
                                      onChange={(e) => setLlmModelName(e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>

                      {llmProvider === 'Custom' && (
                          <div className="animate-in slide-in-from-top-2 duration-200">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Base URL (Endpoint)</label>
                              <div className="relative">
                                  <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors text-sm"
                                      placeholder="https://api.your-provider.com/v1"
                                      value={llmBaseUrl}
                                      onChange={(e) => setLlmBaseUrl(e.target.value)}
                                  />
                              </div>
                          </div>
                      )}

                      <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                          {llmSaveSuccess && (
                            <span className="text-sm text-emerald-500 flex items-center gap-1">
                              <Check className="w-4 h-4" /> Saved
                            </span>
                          )}
                          <button
                            onClick={handleSaveLlm}
                            disabled={llmSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                          >
                              {llmSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save LLM Settings
                          </button>
                      </div>
                  </div>
              </div>

              {/* AI Health Check */}
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Engine Health</h4>
                          {diagResult ? (
                            <p className="text-xs text-emerald-500">
                              Connected to {diagResult.provider} ({diagResult.model}) • Latency: {diagResult.latency}ms • Status: {diagResult.status}
                            </p>
                          ) : diagError ? (
                            <p className="text-xs text-red-400">{diagError}</p>
                          ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {llmProvider} configured • Click "Run Diagnostic" to test connectivity
                            </p>
                          )}
                      </div>
                      <button
                        onClick={handleRunDiagnostic}
                        disabled={diagRunning}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 flex items-center gap-1"
                      >
                        {diagRunning && <Loader2 className="w-3 h-3 animate-spin" />}
                        {diagRunning ? 'Testing...' : 'Run Diagnostic'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'connect accounts' && (
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 min-h-[500px] transition-colors duration-300">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Connected Apps</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your active social media and tool connections.</p>
                </div>
                <div className="flex gap-3">
                    <button className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold transition-colors">
                        <RefreshCw className="w-3 h-3" /> Check Health
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-bold transition-colors shadow-lg shadow-indigo-900/20"
                    >
                        <Plus className="w-4 h-4" /> Add Integration
                    </button>
                </div>
             </div>
             
             {connectedIntegrations.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                     <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                         <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No apps connected</h3>
                     <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Connect your social media accounts to start publishing and analyzing content.</p>
                     <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Connect First App
                    </button>
                 </div>
             ) : (
                <div className="grid grid-cols-1 gap-4">
                {connectedIntegrations.map(app => (
                    <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50/30 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all gap-4 group">
                        <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            {renderIntegrationIcon(app.icon)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base">{app.name}</h4>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                    app.status === 'active' ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-500" :
                                    app.status === 'error' ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-500" :
                                    "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900 text-yellow-600 dark:text-yellow-500"
                                )}>
                                    {app.status || 'Unknown'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                                {app.latencyMs && (
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                        <Activity className="w-3 h-3" /> {app.latencyMs}ms latency
                                    </span>
                                )}
                                <span className="text-[10px] text-slate-400 dark:text-slate-600 flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3" /> Sync: {app.lastChecked ? new Date(app.lastChecked).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Never'}
                                </span>
                            </div>
                        </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto pl-16 md:pl-0">
                            <button 
                                onClick={() => testIntegration(app.id)}
                                disabled={app.status === 'testing'}
                                className="px-4 py-2 rounded-lg text-xs font-bold transition-colors border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 flex items-center gap-2 disabled:opacity-50"
                            >
                                {app.status === 'testing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                                Test
                            </button>

                            <button 
                                onClick={() => toggleIntegration(app.id)}
                                className="px-4 py-2 rounded-lg text-xs font-bold transition-colors border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                ))}
                </div>
             )}
           </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'subscription' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {PLANS.map(plan => (
                 <div 
                   key={plan.name} 
                   className={clsx(
                     "border rounded-xl p-6 relative flex flex-col cursor-pointer transition-all duration-300",
                     currentPlan.name === plan.name 
                       ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-500 shadow-lg shadow-indigo-900/20" 
                       : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                   )}
                   onClick={() => updatePlan(plan)}
                 >
                    {currentPlan.name === plan.name && (
                      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        Current Plan
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-2 mb-6">
                       <span className="text-3xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                       <span className="text-slate-500 dark:text-slate-400">/mo</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                       {plan.features.map(feat => (
                         <li key={feat} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                           <Check className="w-4 h-4 text-emerald-500" /> {feat}
                         </li>
                       ))}
                    </ul>
                    <button 
                      className={clsx(
                        "w-full py-2 rounded-lg font-bold text-sm transition-colors",
                        currentPlan.name === plan.name
                           ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default"
                           : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      )}
                    >
                       {currentPlan.name === plan.name ? 'Active' : 'Switch to this plan'}
                    </button>
                 </div>
               ))}
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-300">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                 <CreditCard className="w-5 h-5" /> Payment Method
               </h3>
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-mono text-slate-700 dark:text-white">VISA</div>
                     <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">•••• 4242</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Expires 12/28</p>
                     </div>
                  </div>
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold">Update Card</button>
               </div>
            </div>
         </div>
      )}

      {/* Affiliate Tab */}
      {activeTab === 'affiliate' && currentUser?.affiliate && (
          <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-8 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Share & Earn</h3>
                          <p className="text-slate-600 dark:text-slate-300">Earn 30% recurring commission for every customer you refer to Nexocial.</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Referrals</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentUser.affiliate.referrals}</p>
                        </div>
                        <div className="text-center bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-emerald-100 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Total Earnings</p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${currentUser.affiliate.earnings.toFixed(2)}</p>
                        </div>
                      </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Your Referral Link</label>
                        <div className="flex gap-2">
                            <input 
                              readOnly
                              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-700 dark:text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={`${window.location.origin}/?ref=${currentUser.affiliate.code}`}
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/?ref=${currentUser.affiliate.code}`);
                                alert("Link Copied!");
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                            >
                               <Copy className="w-4 h-4" /> Copy
                            </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Referral Code</label>
                        <div className="flex gap-2">
                            {isEditingCode ? (
                              <>
                                <div className="flex-1 space-y-1">
                                  <input
                                    className="w-full bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg p-3 text-slate-700 dark:text-white font-mono text-sm focus:outline-none"
                                    value={newAffiliateCode}
                                    onChange={e => { setNewAffiliateCode(e.target.value); setCodeError(''); }}
                                  placeholder="NEW-CODE"
                                  />
                                  {codeError && <p className="text-xs text-red-500">{codeError}</p>}
                                </div>
                                <button
                                  onClick={handleUpdateCode}
                                  disabled={codeSaving}
                                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1"
                                >
                                  {codeSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                   Save
                                </button>
                                <button
                                  onClick={() => { setIsEditingCode(false); setCodeError(''); }}
                                  className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg font-bold transition-colors"
                                >
                                   Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex-1 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-700 dark:text-slate-300 font-mono text-sm">
                                  {currentUser.affiliate.code}
                                </div>
                                <button 
                                  onClick={() => {
                                    setNewAffiliateCode(currentUser.affiliate!.code);
                                    setIsEditingCode(true);
                                  }}
                                  className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                >
                                   Edit
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                  </div>

                  {currentUser.affiliate.earnings > 0 && (
                    <div className="mt-8 pt-8 border-t border-emerald-200 dark:border-emerald-800/30 flex flex-col items-end gap-2">
                        {payoutError && <p className="text-xs text-red-500">{payoutError}</p>}
                        {currentUser.affiliate.payoutStatus === 'Pending' ? (
                          <span className="text-sm text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Payout Pending — processing
                          </span>
                        ) : (
                          <button
                            onClick={handlePayout}
                            disabled={isPayoutLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-900/20"
                          >
                             {isPayoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                             Request Payout
                          </button>
                        )}
                    </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default Settings;

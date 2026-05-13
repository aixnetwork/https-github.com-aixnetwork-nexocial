
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SocialPost, 
  IncomingMessage, 
  BrandVoiceSettings,
  EngagementSettings,
  PostStatus,
  Integration,
  BillingPlan,
  BrandMention,
  Competitor,
  ContentFormat,
  UserProfile,
  UserRole,
  PaymentProvider,
  Transaction,
  Campaign,
  CampaignPostTemplate,
  Feedback,
  AdminGateway
} from '../types';
import { 
  DEFAULT_BRAND_VOICE, 
  INITIAL_RESTRICTED_TERMS, 
  MOCK_INCOMING_MESSAGES, 
  MOCK_POSTS, 
  MOCK_INTEGRATIONS, 
  PLANS,
  MOCK_MENTIONS,
  MOCK_COMPETITORS,
  MOCK_USERS,
  MOCK_TRANSACTIONS,
  MOCK_FEEDBACKS,
  MOCK_ADMIN_GATEWAYS
} from '../constants';
import * as GeminiService from '../services/geminiService';
import { loginUser, registerUser, logoutUser, verify2fa as apiVerify2fa, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, getSessionRestorePromise } from '../services/authService';
import type { LoginResult } from '../services/authService';
import { updateProfile, changePassword as apiChangePassword, deleteAccount as apiDeleteAccount, updateAffiliateCode as apiUpdateAffiliateCode, requestPayout as apiRequestPayout, submitFeedback as apiSubmitFeedback, send2faSetupCode as apiSend2faSetupCode, enable2fa as apiEnable2fa, disable2fa as apiDisable2fa } from '../services/usersService';
import { fetchAllUsers as apiFetchAllUsers, updateUserStatus as apiUpdateUserStatus, deleteUser as apiDeleteUser, fetchFeedbacks as apiFetchFeedbacks, updateFeedbackStatus as apiUpdateFeedbackStatus } from '../services/adminService';

interface AppContextType {
  // Auth State
  currentUser: UserProfile | null;
  allUsers: UserProfile[]; // For Super Admin
  
  // App Data
  posts: SocialPost[];
  campaigns: Campaign[];
  messages: IncomingMessage[];
  restrictedTerms: string[];
  brandVoice: BrandVoiceSettings;
  integrations: Integration[];
  currentPlan: BillingPlan;
  mentions: BrandMention[];
  competitors: Competitor[];
  transactions: Transaction[];
  feedbacks: Feedback[];
  adminGateways: AdminGateway[];
  
  // Auth loading — true while restoring session on boot
  authLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<LoginResult>;
  verify2fa: (userId: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, company: string, referralCode?: string) => Promise<void>;
  processSubscription: (planName: string, provider: PaymentProvider) => Promise<void>;
  
  // User Actions
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  requestPayout: () => Promise<void>;
  updateAffiliateCode: (newCode: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  send2faSetupCode: () => Promise<void>;
  enable2fa: (code: string) => Promise<void>;
  disable2fa: (password: string) => Promise<void>;

  // Super Admin Actions
  loadAdminData: () => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loginAsUser: (userId: string) => void;
  updateFeedbackStatus: (id: string, status: 'Read' | 'Resolved') => Promise<void>;
  configureAdminGateway: (provider: PaymentProvider, data: any) => Promise<void>;

  // Standard Actions
  addPost: (post: SocialPost) => void;
  updatePostStatus: (id: string, status: PostStatus) => void;
  updatePostContent: (id: string, content: string) => void;
  schedulePost: (id: string, time: number) => void;
  deletePost: (id: string) => void;
  addCampaign: (campaign: Campaign) => void;
  
  addRestrictedTerm: (term: string) => void;
  removeRestrictedTerm: (term: string) => void;
  updateBrandVoice: (settings: BrandVoiceSettings) => void;
  updateEngagementSettings: (settings: EngagementSettings) => void;
  toggleIntegration: (id: string) => void;
  testIntegration: (id: string) => void;
  sendMessageReply: (id: string, reply: string) => void;
  submitFeedback: (type: 'Improvement' | 'Bug' | 'Technical Issue', message: string) => Promise<void>;
  
  // AI Actions
  generateContent: (coreMessage: string, options: { platforms: string[], format: ContentFormat, visualPrompt?: string, includeCommunityLink?: boolean }) => Promise<SocialPost[]>;
  generateCampaignPlan: (goal: string, durationDays: number, platforms: string[], trainingData?: { website: string, sampleContent: string }, targetAudience?: string) => Promise<CampaignPostTemplate[]>;
  generateImage: (prompt: string) => Promise<string | null>;
  repurposePost: (originalPost: SocialPost, targetPlatform: string, targetFormat: ContentFormat, includeCommunityLink?: boolean) => Promise<SocialPost>;
  
  // Beta Test Helpers
  injectMessage: (message: IncomingMessage) => void;
  injectFeedback: (feedback: Feedback) => void;
  resetOnboarding: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nexocial_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexocial_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexocial_user');
    }
  }, [currentUser]);

  // Restore session from httpOnly refresh token cookie on app boot.
  // The cancel flag prevents React StrictMode's double-invocation from causing
  // a flash: StrictMode runs effects twice (mount→cleanup→remount). Without the
  // flag, the first call's stale result would race with the second call's result.
  useEffect(() => {
    let cancelled = false;

    getSessionRestorePromise()
      .then(user => {
        if (cancelled) return;
        if (user) {
          setCurrentUser(user);
          if (user.brandDescription || user.brandTone !== undefined || user.primaryGoal || user.engagementSettings || user.llmSettings) {
            setBrandVoice((prev: BrandVoiceSettings) => ({
              ...prev,
              description: user.brandDescription ?? prev.description,
              tone: user.brandTone ?? prev.tone,
              ...(user.engagementSettings ? { engagement: user.engagementSettings as any } : {}),
              ...(user.llmSettings ? { llm: user.llmSettings as any } : {}),
            }));
          }
          const plan = PLANS.find(p => p.name === user.plan);
          if (plan) setCurrentPlan(plan);
        } else {
          setCurrentUser(null);
        }
        // Moved inside .then() so it's batched with setCurrentUser in the same
        // React render — prevents an intermediate frame where authLoading=false
        // but currentUser is still null.
        setAuthLoading(false);
      })
      .catch(() => {
        // restoreSession threw (network down, etc.) — keep localStorage user,
        // just stop the loading gate.
        if (!cancelled) setAuthLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [authLoading, setAuthLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);

  // Sync currentUser with allUsers whenever allUsers changes
  useEffect(() => {
    if (currentUser) {
      const updatedUser = allUsers.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [allUsers, currentUser]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // App Data
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [messages, setMessages] = useState<IncomingMessage[]>(MOCK_INCOMING_MESSAGES);
  const [restrictedTerms, setRestrictedTerms] = useState<string[]>(INITIAL_RESTRICTED_TERMS);
  const [brandVoice, setBrandVoice] = useState<BrandVoiceSettings>(DEFAULT_BRAND_VOICE);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [currentPlan, setCurrentPlan] = useState<BillingPlan>(PLANS[0]); // Default to Spark
  const [mentions] = useState<BrandMention[]>(MOCK_MENTIONS);
  const [competitors] = useState<Competitor[]>(MOCK_COMPETITORS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
  const [adminGateways, setAdminGateways] = useState<AdminGateway[]>(MOCK_ADMIN_GATEWAYS);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('nexocial_theme') as 'light' | 'dark') || 'dark'
  );

  // Apply theme to document and persist
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('nexocial_theme', theme);
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#0B0F19';
      document.body.style.color = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initial analysis of mock messages
  useEffect(() => {
    const processMessages = async () => {
       const updatedMessages = await Promise.all(messages.map(async (msg) => {
         if (!msg.suggestedReply && msg.status === 'New') {
            const analysis = await GeminiService.analyzeIncomingMessage(msg.content, brandVoice.llm);
            return { ...msg, ...analysis };
         }
         return msg;
       }));
       if (JSON.stringify(updatedMessages) !== JSON.stringify(messages)) {
         setMessages(updatedMessages);
       }
    };
    processMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mock background scheduler
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosts(currentPosts => {
        const now = Date.now();
        let hasChanges = false;
        
        const updatedPosts = currentPosts.map(post => {
          if (post.status === PostStatus.SCHEDULED && post.scheduledTime && post.scheduledTime <= now) {
            hasChanges = true;
            return { ...post, status: PostStatus.PUBLISHED };
          }
          return post;
        });

        return hasChanges ? updatedPosts : currentPosts;
      });
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  // Auth Methods
  const login = async (email: string, password: string): Promise<LoginResult> => {
    const result = await loginUser(email, password);
    if (result.requiresTwoFactor === true) return result;
    const user = result.user;
    setCurrentUser(user);
    if (user.brandDescription || user.brandTone !== undefined || user.primaryGoal) {
      setBrandVoice((prev: BrandVoiceSettings) => ({
        ...prev,
        description: user.brandDescription ?? prev.description,
        tone: user.brandTone ?? prev.tone,
      }));
    }
    const plan = PLANS.find(p => p.name === user.plan);
    if (plan) setCurrentPlan(plan);
    return result;
  };

  const verify2fa = async (userId: string, code: string): Promise<void> => {
    const user = await apiVerify2fa(userId, code);
    setCurrentUser(user);
    const plan = PLANS.find(p => p.name === user.plan);
    if (plan) setCurrentPlan(plan);
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setCurrentUser(null);
  };

  const register = async (name: string, email: string, password: string, company: string, referralCode?: string): Promise<void> => {
    const user = await registerUser(name, email, password, company, referralCode);
    setCurrentUser(user);
    setCurrentPlan(PLANS[0]);
  };

  const processSubscription = async (planName: string, provider: PaymentProvider) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const plan = PLANS.find(p => p.name === planName);
        if (plan && currentUser) {
          // Update Plan
          setCurrentPlan(plan);
          
          // Create Transaction Record
          const newTransaction: Transaction = {
              id: `tx-${Date.now()}`,
              userId: currentUser.id,
              userEmail: currentUser.email,
              amount: plan.price,
              status: 'Succeeded',
              date: Date.now(),
              provider: provider,
              type: 'Subscription'
          };
          setTransactions(prev => [newTransaction, ...prev]);

          // Affiliate Commission logic (30% recurring)
          if (currentUser.referredBy) {
            const commission = plan.price * 0.3;
            setAllUsers(prev => prev.map(u => u.id === currentUser.referredBy ? {
              ...u,
              affiliate: u.affiliate ? { ...u.affiliate, earnings: u.affiliate.earnings + commission, payoutStatus: 'Pending' } : u.affiliate
            } : u));
          }

          // Update User Profile
          const updatedUser = { ...currentUser, plan: plan.name as any };
          setCurrentUser(updatedUser);
          setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
          
          // Notify
          alert(`Payment of $${plan.price} successful via ${provider}. You are now on the ${planName} plan.`);
        }
        resolve();
      }, 2000); // Simulate network delay
    });
  };

  const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) return;
    const updated = await updateProfile(data);
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiChangePassword(currentPassword, newPassword);
    await logoutUser();
    setCurrentUser(null);
  };

  const deleteAccount = async (): Promise<void> => {
    if (!currentUser) return;
    await apiDeleteAccount();
    setCurrentUser(null);
  };

  const completeOnboarding = async () => {
    if (!currentUser) return;
    const updated = await updateProfile({ onboardingCompleted: true });
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const requestPayout = async () => {
    if (!currentUser) return;
    const updated = await apiRequestPayout();
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const updateAffiliateCode = async (newCode: string) => {
    if (!currentUser) return;
    const updated = await apiUpdateAffiliateCode(newCode);
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const forgotPassword = async (email: string): Promise<void> => {
    await apiForgotPassword(email);
  };

  const resetPassword = async (token: string, password: string): Promise<void> => {
    await apiResetPassword(token, password);
  };

  const send2faSetupCode = async (): Promise<void> => {
    await apiSend2faSetupCode();
  };

  const enable2fa = async (code: string): Promise<void> => {
    const updated = await apiEnable2fa(code);
    setCurrentUser(updated);
  };

  const disable2fa = async (password: string): Promise<void> => {
    const updated = await apiDisable2fa(password);
    setCurrentUser(updated);
  };

  // Super Admin Actions
  const loadAdminData = async () => {
    const [users, fbs] = await Promise.all([apiFetchAllUsers(), apiFetchFeedbacks()]);
    setAllUsers(users);
    setFeedbacks(fbs);
  };

  const suspendUser = async (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    const updated = await apiUpdateUserStatus(userId, newStatus);
    setAllUsers(prev => prev.map(u => u.id === userId ? updated : u));
  };

  const deleteUser = async (userId: string) => {
    await apiDeleteUser(userId);
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const loginAsUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      const plan = PLANS.find(p => p.name === user.plan);
      if (plan) setCurrentPlan(plan);
    }
  };

  const updateFeedbackStatus = async (id: string, status: 'Read' | 'Resolved') => {
    const updated = await apiUpdateFeedbackStatus(id, status);
    setFeedbacks(prev => prev.map(f => f.id === id ? updated : f));
  };

  const configureAdminGateway = async (provider: PaymentProvider, data: any) => {
      // Simulate API call
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              setAdminGateways(prev => {
                  // Check if exists
                  const existing = prev.find(g => g.provider === provider);
                  if (existing) {
                      return prev.map(g => g.provider === provider ? { ...g, connected: true, lastSynced: Date.now(), config: data } : g);
                  }
                  return [...prev, { provider, connected: true, lastSynced: Date.now(), config: data }];
              });
              resolve();
          }, 1500);
      });
  };

  // Standard Actions
  const addPost = (post: SocialPost) => {
    const flagged = restrictedTerms
      .filter(term => post.content.toLowerCase().includes(term.toLowerCase()));

    const finalStatus = flagged.length > 0 
      ? PostStatus.NEEDS_REVIEW 
      : (post.status || PostStatus.DRAFT);

    const newPost = {
      ...post,
      flaggedKeywords: flagged,
      status: finalStatus
    };
    
    // Update gamification points for creating a post
    if (currentUser && currentUser.gamification) {
        const newPoints = currentUser.gamification.points + 10;
        const newLevel = Math.floor(newPoints / 100) + 1;
        const updatedUser = { 
            ...currentUser, 
            gamification: { 
                ...currentUser.gamification, 
                points: newPoints,
                level: newLevel
            } 
        };
        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
    
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const updatePostContent = (id: string, content: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p));
  };

  const schedulePost = (id: string, time: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, status: PostStatus.SCHEDULED, scheduledTime: time } : p
    ));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const addRestrictedTerm = (term: string) => {
    setRestrictedTerms(prev => [...prev, term]);
  };

  const removeRestrictedTerm = (term: string) => {
    setRestrictedTerms(prev => prev.filter(t => t !== term));
  };

  const updateBrandVoice = (settings: BrandVoiceSettings) => {
    setBrandVoice(settings);
  };

  const updateEngagementSettings = (settings: EngagementSettings) => {
    setBrandVoice(prev => ({ ...prev, engagement: settings }));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  }

  const testIntegration = (id: string) => {
    // Set status to testing
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'testing' } : i));
    
    // Simulate API call delay
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate for demo
        const latency = Math.floor(Math.random() * 200) + 20; // 20-220ms latency
        
        setIntegrations(prev => prev.map(i => i.id === id ? { 
            ...i, 
            status: success ? 'active' : 'error',
            lastChecked: Date.now(),
            latencyMs: latency
        } : i));
    }, 2000);
  }

  const sendMessageReply = (id: string, reply: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Replied', suggestedReply: reply } : m));
  };

  const injectMessage = (message: IncomingMessage) => {
    setMessages(prev => [message, ...prev]);

    // Auto-Engagement Simulation
    if (brandVoice.engagement?.autoReplyEnabled && 
        brandVoice.engagement.replyToSentiment.includes(message.sentiment)) {
      
      // Simulate AI thinking and replying
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'Replied' as const, suggestedReply: m.suggestedReply || "Thanks for your message! Our team is looking into this." } 
            : m
        ));
      }, 3000);
    }
  };

  const injectFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const resetOnboarding = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, onboardingCompleted: false };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const submitFeedback = async (type: 'Improvement' | 'Bug' | 'Technical Issue', message: string) => {
    const newFeedback = await apiSubmitFeedback(type, message);
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const generateContent = async (coreMessage: string, options: { platforms: string[], format: ContentFormat, visualPrompt?: string, includeCommunityLink?: boolean }): Promise<SocialPost[]> => {
    const generatedData = await GeminiService.generateSocialContent(coreMessage, options.platforms, options.format, brandVoice, options.visualPrompt);
    
    const newPosts: SocialPost[] = generatedData.map((data: any) => {
        const flagged = restrictedTerms
            .filter(term => data.content.toLowerCase().includes(term.toLowerCase()));

        const communityLink = "https://nexocial.ai/community";
        const contentWithLink = options.includeCommunityLink 
            ? `${data.content}\n\nJoin our Smart Community: ${communityLink}`
            : data.content;

        return {
            id: Math.random().toString(36).substr(2, 9),
            content: contentWithLink,
            platform: data.platform,
            format: options.format,
            visualPrompt: data.visualPrompt,
            voiceScore: data.voiceScore,
            status: flagged.length > 0 ? PostStatus.NEEDS_REVIEW : PostStatus.DRAFT,
            timestamp: Date.now(),
            flaggedKeywords: flagged,
            predictedEngagement: data.predictedEngagement,
            author: "AI Assistant",
            communityLink: options.includeCommunityLink ? communityLink : undefined
        } as SocialPost;
    });

    return newPosts;
  };

  const generateCampaignPlan = async (goal: string, durationDays: number, platforms: string[], trainingData?: { website: string, sampleContent: string }, targetAudience?: string): Promise<CampaignPostTemplate[]> => {
    return await GeminiService.generateCampaignPlan(goal, durationDays, platforms, trainingData, targetAudience, brandVoice.llm);
  };

  const generateImage = async (prompt: string): Promise<string | null> => {
    return await GeminiService.generateImage(prompt, brandVoice.llm);
  };

  const repurposePost = async (originalPost: SocialPost, targetPlatform: string, targetFormat: ContentFormat, includeCommunityLink?: boolean): Promise<SocialPost> => {
     const generatedData = await GeminiService.repurposeSocialContent(
       { content: originalPost.content, platform: originalPost.platform, format: originalPost.format },
       targetPlatform,
       targetFormat,
       brandVoice
     );
     
     if (generatedData.length > 0) {
        const data = generatedData[0];
        const flagged = restrictedTerms
            .filter(term => data.content.toLowerCase().includes(term.toLowerCase()));

        const communityLink = "https://nexocial.ai/community";
        const contentWithLink = includeCommunityLink 
            ? `${data.content}\n\nJoin our Smart Community: ${communityLink}`
            : data.content;

        return {
            id: Math.random().toString(36).substr(2, 9),
            content: contentWithLink,
            platform: data.platform as any,
            format: targetFormat,
            visualPrompt: data.visualPrompt,
            voiceScore: data.voiceScore,
            status: flagged.length > 0 ? PostStatus.NEEDS_REVIEW : PostStatus.DRAFT,
            timestamp: Date.now(),
            flaggedKeywords: flagged,
            predictedEngagement: data.predictedEngagement,
            author: "AI Assistant",
            communityLink: includeCommunityLink ? communityLink : undefined
        } as SocialPost;
     }
     throw new Error("Repurpose failed");
  };

  return (
    <AppContext.Provider value={{
      authLoading,
      currentUser,
      allUsers,
      posts,
      campaigns,
      messages,
      restrictedTerms,
      brandVoice,
      integrations,
      currentPlan,
      mentions,
      competitors,
      transactions,
      feedbacks,
      adminGateways,
      login,
      logout,
      register,
      verify2fa,
      processSubscription,
      updateUserProfile,
      changePassword,
      deleteAccount,
      completeOnboarding,
      requestPayout,
      updateAffiliateCode,
      forgotPassword,
      resetPassword,
      send2faSetupCode,
      enable2fa,
      disable2fa,
      loadAdminData,
      suspendUser,
      deleteUser,
      loginAsUser,
      updateFeedbackStatus,
      configureAdminGateway,
      addPost,
      updatePostStatus,
      updatePostContent,
      schedulePost,
      deletePost,
      addCampaign,
      addRestrictedTerm,
      removeRestrictedTerm,
      updateBrandVoice,
      updateEngagementSettings,
      toggleIntegration,
      testIntegration,
      sendMessageReply,
      submitFeedback,
      generateContent,
      generateCampaignPlan,
      generateImage,
      repurposePost,
      injectMessage,
      injectFeedback,
      resetOnboarding,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

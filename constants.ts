
import { BrandVoiceSettings, IncomingMessage, SocialPost, PostStatus, Integration, BillingPlan, BrandMention, Competitor, UserProfile, Transaction, Feedback, AdminGateway, Trend, ViralFormat } from "./types";

export const DEFAULT_BRAND_VOICE: BrandVoiceSettings = {
  name: "Nexocial",
  description: "Playful, energetic, and relatable. We speak the language of Gen Z and Millennials, using emojis, slang, and high energy to keep things hype. Fun but functional. 🔥✨",
  targetScore: 75,
  tone: 85,
  engagement: {
    autoReplyEnabled: true,
    replyToSentiment: ['Positive', 'Neutral'],
    maxRepliesPerHour: 10,
    escalationKeywords: ['lawsuit', 'sue', 'scam', 'fraud', 'stole'],
    aiToneMatch: true
  },
  llm: {
    provider: 'Gemini',
    apiKey: '',
    modelName: 'gemini-3-flash-preview',
    isEnabled: true
  }
};

export const INITIAL_RESTRICTED_TERMS: string[] = [
  'guaranteed results', // Marketing claim risk
  'competitor_slander', 
  'hate speech',
  'free money',
];

export const MOCK_ADMIN_GATEWAYS: AdminGateway[] = [
    { provider: 'Stripe', connected: true, lastSynced: Date.now() - 1000000 },
    { provider: 'PayPal', connected: false }
];

export const PLANS: BillingPlan[] = [
  {
    name: 'Spark',
    price: 0,
    interval: 'monthly',
    features: [
      '3 Social Profiles',
      '10 AI-Generated Posts / mo',
      'Standard Scheduling',
      'Basic Performance Metrics',
      'Community Support'
    ]
  },
  {
    name: 'Catalyst',
    price: 49,
    interval: 'monthly',
    features: [
      '20 Social Profiles',
      '5 Team Seats',
      'Unlimited AI Content Generation',
      'AI Brand Soul Visualization',
      'Predictive Virality Heatmaps',
      'Advanced Analytics Dashboard',
      'Priority Email Support'
    ]
  },
  {
    name: 'Empire',
    price: 199,
    interval: 'monthly',
    features: [
      'Unlimited Social Profiles',
      '25 Team Seats',
      '24/7 AI Auto-Engagement Agent',
      'Competitor Strategy Spy (TrendHunter™)',
      'Custom Brand Voice Training (LLM Fine-tuning)',
      'Multi-User Approval Workflows',
      'Dedicated Account Strategist',
      'API Access'
    ]
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  // Social
  { id: 's1', name: 'Facebook', connected: true, icon: 'facebook', category: 'Social', status: 'active' },
  { id: 's2', name: 'Instagram', connected: true, icon: 'instagram', category: 'Social', status: 'active' },
  { id: 's3', name: 'TikTok', connected: false, icon: 'tiktok', category: 'Social' },
  { id: 's4', name: 'X', connected: false, icon: 'twitter', category: 'Social' },
  { id: 's5', name: 'LinkedIn', connected: false, icon: 'linkedin', category: 'Social' },
  { id: 's6', name: 'YouTube', connected: false, icon: 'youtube', category: 'Social' },
  { id: 's7', name: 'Pinterest', connected: false, icon: 'pinterest', category: 'Social' },
  { id: 's8', name: 'Google Business', connected: false, icon: 'google-business', category: 'Social' },
  { id: 's9', name: 'Snapchat', connected: false, icon: 'snapchat', category: 'Social' },
  { id: 's10', name: 'Reddit', connected: false, icon: 'reddit', category: 'Social' },
  { id: 's11', name: 'Threads', connected: false, icon: 'threads', category: 'Social' },
  
  // CRM
  { id: 'c1', name: 'HubSpot', connected: false, icon: 'hubspot', category: 'CRM' },
  { id: 'c2', name: 'Salesforce', connected: false, icon: 'salesforce', category: 'CRM' },
  { id: 'c3', name: 'Zoho CRM', connected: false, icon: 'zoho', category: 'CRM' },
  { id: 'c4', name: 'Pipedrive', connected: false, icon: 'pipedrive', category: 'CRM' },
  
  // Marketing & Email
  { id: 'm1', name: 'Mailchimp', connected: false, icon: 'mailchimp', category: 'Marketing' },
  { id: 'm2', name: 'SparkPost', connected: false, icon: 'sparkpost', category: 'Marketing' },
  { id: 'm3', name: 'SendGrid', connected: false, icon: 'sendgrid', category: 'Marketing' },
  { id: 'm4', name: 'ActiveCampaign', connected: false, icon: 'activecampaign', category: 'Marketing' },
  { id: 'm5', name: 'Klaviyo', connected: false, icon: 'klaviyo', category: 'Marketing' },
  
  // Productivity
  { id: 'p1', name: 'Google Workspace', connected: false, icon: 'google', category: 'Productivity' },
  { id: 'p2', name: 'Slack', connected: true, icon: 'slack', category: 'Productivity', status: 'active', lastChecked: Date.now(), latencyMs: 45 },
  { id: 'p3', name: 'Microsoft Teams', connected: false, icon: 'teams', category: 'Productivity' },
  { id: 'p4', name: 'Notion', connected: false, icon: 'notion', category: 'Productivity' },

  // Analytics
  { id: 'a1', name: 'Google Analytics', connected: false, icon: 'google-analytics', category: 'Analytics' },
  { id: 'a2', name: 'Segment', connected: false, icon: 'segment', category: 'Analytics' },
  { id: 'a3', name: 'Mixpanel', connected: false, icon: 'mixpanel', category: 'Analytics' },
  { id: 'a4', name: 'Hotjar', connected: false, icon: 'hotjar', category: 'Analytics' },
];

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'post1',
    content: 'Unlocking new levels of productivity with Nexocial! 🚀 #MarketingAI #Growth',
    platform: 'LinkedIn',
    format: 'Post',
    voiceScore: 92,
    status: PostStatus.PUBLISHED,
    timestamp: Date.now() - 86400000,
    flaggedKeywords: [],
    author: 'AI Assistant',
    metrics: { views: 1200, likes: 45, shares: 12, clicks: 8 }
  },
  {
    id: 'post2',
    content: 'Check out our latest summer collection! ☀️ #Fashion #SummerVibes',
    platform: 'Instagram',
    format: 'Post',
    voiceScore: 88,
    status: PostStatus.SCHEDULED,
    timestamp: Date.now(),
    scheduledTime: Date.now() + 3600000,
    flaggedKeywords: [],
    author: 'AI Assistant'
  }
];

export const MOCK_INCOMING_MESSAGES: IncomingMessage[] = [
  {
    id: 'msg1',
    sender: 'Jane Doe',
    content: 'I love your product! How can I get the Pro plan?',
    platform: 'Facebook',
    timestamp: Date.now() - 3600000,
    sentiment: 'Positive',
    riskLevel: 'Low',
    status: 'New'
  },
  {
    id: 'msg2',
    sender: 'John Smith',
    content: 'I am having trouble connecting my X account.',
    platform: 'X',
    timestamp: Date.now() - 7200000,
    sentiment: 'Neutral',
    riskLevel: 'Low',
    status: 'New'
  }
];

export const MOCK_MENTIONS: BrandMention[] = [
  { id: 'men1', user: 'TechTrend', content: 'Nexocial is changing the game for SMBs.', platform: 'X', timestamp: Date.now(), sentiment: 'Positive', keywordMatch: 'Nexocial' }
];

export const MOCK_COMPETITORS: Competitor[] = [
  { id: 'comp1', name: 'SocialSuite', handle: '@socialsuite', avatarColor: 'bg-indigo-500', latestPost: { content: 'We just launched our new AI features!', timestamp: Date.now(), likes: 250 } }
];

export const MOCK_USERS: UserProfile[] = [
  { id: 'user1', name: 'Admin User', email: 'admin@nexocial.ai', role: 'SuperAdmin', companyName: 'Nexocial HQ', plan: 'Empire', status: 'Active', joinedDate: Date.now(), onboardingCompleted: true },
  { 
    id: 'user2', 
    name: 'Matt Demo', 
    email: 'matt@nexocial.ai', 
    role: 'Owner', 
    companyName: 'Demo Co', 
    plan: 'Catalyst', 
    status: 'Active', 
    joinedDate: Date.now(), 
    onboardingCompleted: true,
    affiliate: {
      code: 'MATT-DEMO',
      referrals: 12,
      earnings: 450.00,
      payoutStatus: 'Paid'
    }
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', userId: 'user2', userEmail: 'matt@nexocial.ai', amount: 49, status: 'Succeeded', date: Date.now() - 86400000, provider: 'Stripe', type: 'Subscription' },
  { id: 'tx2', userId: 'user2', userEmail: 'matt@nexocial.ai', amount: 150, status: 'Succeeded', date: Date.now() - 172800000, provider: 'Stripe', type: 'AffiliatePayout' },
  { id: 'tx3', userId: 'user2', userEmail: 'matt@nexocial.ai', amount: 300, status: 'Succeeded', date: Date.now() - 604800000, provider: 'Stripe', type: 'AffiliatePayout' }
];

export const MOCK_FEEDBACKS: Feedback[] = [
  { id: 'fb1', userId: 'user2', userName: 'Matt Demo', userEmail: 'matt@nexocial.ai', type: 'Improvement', message: 'Would love more LinkedIn templates.', timestamp: Date.now(), status: 'New' }
];

export const MOCK_TRENDS: Trend[] = [
  { id: 'tr1', topic: 'AI Safety Regulations', category: 'Tech', volume: 'Exploding', description: 'New EU laws regarding AI transparency.', aiHookSuggestion: 'Is your marketing AI compliant?', platforms: ['X', 'LinkedIn'] }
];

export const MOCK_VIRAL_FORMATS: ViralFormat[] = [
  { id: 'vf1', name: 'The Story Hook', description: 'Start with a controversial statement.', example: 'Everything you know about marketing is wrong...', difficulty: 'Easy', format: 'Post' }
];

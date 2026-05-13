
export type Platform = 'X' | 'LinkedIn' | 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube' | 'Pinterest' | 'Google Business' | 'Snapchat' | 'Reddit' | 'Threads';

export type ContentFormat = 'Post' | 'Story' | 'Reel' | 'Thread' | 'Carousel' | 'Video';

export type UserRole = 'Owner' | 'Editor' | 'Viewer' | 'SuperAdmin';

export type PaymentProvider = 'Stripe' | 'PayPal';

export interface AffiliateStats {
  code: string;
  referrals: number;
  earnings: number;
  payoutStatus: 'Paid' | 'Pending';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  badges: string[]; // Badge IDs
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  plan: 'Spark' | 'Catalyst' | 'Empire';
  status: 'Active' | 'Suspended';
  joinedDate: number;
  onboardingCompleted?: boolean;
  avatar?: string;
  referredBy?: string;
  twoFactorEnabled?: boolean;
  notifEmailDigest?: boolean;
  notifAnnouncements?: boolean;
  notifSecurityAlerts?: boolean;
  brandDescription?: string;
  brandTone?: number;
  preferredPlatforms?: string[];
  primaryGoal?: string;
  engagementSettings?: EngagementSettings;
  llmSettings?: LLMSettings;
  affiliate?: AffiliateStats;
  gamification?: GamificationStats;
}

export interface Transaction {
    id: string;
    userId: string;
    userEmail: string;
    amount: number;
    status: 'Succeeded' | 'Failed' | 'Refunded';
    date: number;
    provider: 'Stripe' | 'PayPal';
    type: 'Subscription' | 'AffiliatePayout';
}

export interface AdminGateway {
    provider: PaymentProvider;
    connected: boolean;
    lastSynced?: number;
    config?: {
        publicKey?: string;
        secretKey?: string; // Mock only
        clientId?: string;
    }
}

export enum RiskLevel {
  SAFE = 'Safe',
  WARNING = 'Check',
  CRITICAL = 'Action Needed',
}

export enum PostStatus {
  DRAFT = 'Draft',
  NEEDS_REVIEW = 'Needs Review', // Was PENDING_COMPLIANCE
  APPROVED = 'Approved',
  REJECTED = 'Needs Edit',
  PUBLISHED = 'Published',
  SCHEDULED = 'Scheduled',
}

export interface SocialPost {
  id: string;
  content: string;
  platform: Platform;
  format?: ContentFormat;
  visualPrompt?: string; // AI suggestion for image/video
  imageUrl?: string; // Generated image URL
  voiceScore: number;
  status: PostStatus;
  timestamp: number;
  flaggedKeywords: string[];
  predictedEngagement?: string;
  viralityBreakdown?: {
    hook: number;
    visual: number;
    emotional: number;
    timing: number;
  };
  author: string;
  scheduledTime?: number;
  communityLink?: string;
  // Performance metrics for Monitor
  metrics?: {
    views: number;
    likes: number;
    shares: number;
    clicks: number;
  }
}

export interface CampaignPostTemplate {
  dayOffset: number; // Day 1, Day 3, etc.
  platform: Platform;
  format: ContentFormat;
  intent: string; // "Teaser", "Launch", "Social Proof"
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  startDate: number;
  status: 'Draft' | 'Active' | 'Completed';
  posts: string[]; // IDs of SocialPosts
  aiSummary?: string;
}

export interface IncomingMessage {
  id: string;
  sender: string;
  content: string;
  platform: Platform;
  timestamp: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Sarcastic';
  riskLevel: 'Low' | 'High';
  suggestedReply?: string;
  status: 'New' | 'Replied' | 'Escalated';
}

export interface BrandMention {
  id: string;
  user: string;
  content: string;
  platform: Platform;
  timestamp: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  keywordMatch: string;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  latestPost: {
    content: string;
    timestamp: number;
    likes: number;
  };
}

export interface EngagementSettings {
  autoReplyEnabled: boolean;
  replyToSentiment: ('Positive' | 'Neutral' | 'Negative' | 'Sarcastic')[];
  maxRepliesPerHour: number;
  escalationKeywords: string[];
  aiToneMatch: boolean;
}

export interface LLMSettings {
  provider: 'Gemini' | 'OpenAI' | 'Anthropic' | 'Custom';
  apiKey: string;
  modelName: string;
  baseUrl?: string;
  isEnabled: boolean;
}

export interface BrandVoiceSettings {
  name: string;
  description: string;
  targetScore: number;
  tone: number; // 0 (Serious) to 100 (Playful)
  engagement?: EngagementSettings;
  llm?: LLMSettings;
}

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  icon: string;
  category: 'Social' | 'CRM' | 'Productivity' | 'Marketing' | 'Analytics';
  status?: 'active' | 'error' | 'testing';
  lastChecked?: number;
  latencyMs?: number;
}

export interface BillingPlan {
  name: 'Spark' | 'Catalyst' | 'Empire';
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  stripeId?: string;
  paypalId?: string;
}

export interface ContextTip {
  title: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
  type: 'info' | 'success' | 'warning';
}

export interface Trend {
    id: string;
    topic: string;
    category: 'Industry News' | 'Pop Culture' | 'Tech' | 'Finance';
    volume: 'High' | 'Exploding' | 'Steady';
    description: string;
    aiHookSuggestion?: string; // The "Newsjack" angle
    platforms: Platform[];
}

export interface ViralFormat {
    id: string;
    name: string;
    description: string;
    example: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    format: ContentFormat;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'Improvement' | 'Bug' | 'Technical Issue';
  message: string;
  timestamp: number;
  status: 'New' | 'Read' | 'Resolved';
}

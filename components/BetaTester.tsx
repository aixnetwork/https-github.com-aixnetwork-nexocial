
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Beaker, X, Play, AlertTriangle, MessageSquare, BarChart3, PenTool, Layers, Shield, Calendar, Flame, Megaphone, Settings, Rocket, UserPlus, User } from 'lucide-react';
import { PostStatus, Feedback } from '../types';

const BetaTester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { addPost, injectMessage, login, resetOnboarding, injectFeedback } = useApp();

  const runResetOnboarding = () => {
    resetOnboarding();
    navigate('/onboarding');
    setIsOpen(false);
  };

  const runInjectFeedback = () => {
    const feedbackItems: Feedback[] = [
      {
        id: `fb-test-1-${Date.now()}`,
        userId: 'u-999',
        userName: 'Sarah Beta',
        userEmail: 'sarah@beta.test',
        type: 'Improvement',
        message: "The AI tone analysis is amazing! Could we add more specific industry templates for real estate?",
        timestamp: Date.now(),
        status: 'New'
      },
      {
        id: `fb-test-2-${Date.now()}`,
        userId: 'u-888',
        userName: 'Mike Tester',
        userEmail: 'mike@beta.test',
        type: 'Bug',
        message: "I noticed a slight delay when generating images on mobile. The spinner works, but maybe a progress bar?",
        timestamp: Date.now() - 3600000,
        status: 'New'
      },
      {
        id: `fb-test-3-${Date.now()}`,
        userId: 'u-777',
        userName: 'Alex Dev',
        userEmail: 'alex@beta.test',
        type: 'Technical Issue',
        message: "The LinkedIn integration seems to disconnect every 24 hours. Is this a known API limit?",
        timestamp: Date.now() - 7200000,
        status: 'New'
      }
    ];

    feedbackItems.forEach(item => injectFeedback(item));
    alert("3 Mock Feedback items injected! View them in the Super Admin dashboard.");
    setIsOpen(false);
  };

  const runUC1_1 = () => {
    // Governance: Content Creator gets flagged
    addPost({
      id: `test-risk-${Date.now()}`,
      content: "Get guaranteed returns on your investment! 💰 No risk, all profit. Sign up now for free money.",
      platform: 'Facebook',
      format: 'Post',
      voiceScore: 45,
      status: PostStatus.NEEDS_REVIEW,
      timestamp: Date.now(),
      flaggedKeywords: ['guaranteed returns', 'free money'],
      author: 'Beta Tester',
      predictedEngagement: 'Low',
      visualPrompt: 'A pile of gold coins'
    });
    navigate('/review');
    setIsOpen(false);
  };

  const runUC2_1 = () => {
    // Velocity: Strategist Cross-Channel (LinkedIn + Twitter)
    navigate('/studio', {
      state: {
        coreMessage: "We are thrilled to announce our new strategic partnership with TechGiant Inc. This collaboration will accelerate our AI roadmap and bring unprecedented value to our SMB customers. 🚀 #TechNews #Innovation #Partnership",
        platforms: ['LinkedIn', 'Twitter'],
        format: 'Post'
      }
    });
    setIsOpen(false);
  };

  const runOmniChannel = () => {
    // Integration: All Channels
    navigate('/studio', {
      state: {
        coreMessage: "Big news! We are expanding our hours for the holiday season. Come visit us until 9 PM every night! 🌙✨ #HolidayHours #SmallBiz #OpenLate",
        platforms: [
            'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 
            'TikTok', 'YouTube', 'Pinterest', 'Google Business', 
            'Snapchat', 'Reddit', 'Threads'
        ],
        format: 'Post'
      }
    });
    setIsOpen(false);
  };

  const runUC3_1 = () => {
    // Community: Crisis Routing
    injectMessage({
      id: `test-crisis-${Date.now()}`,
      sender: '@AngryCustomer99',
      content: "Your software deleted all my data! I'm suing you. This is a scam. 😡",
      platform: 'Twitter',
      timestamp: Date.now(),
      sentiment: 'Negative',
      riskLevel: 'High',
      status: 'New'
    });
    navigate('/inbox');
    setIsOpen(false);
  };

  const runUC4_1 = () => {
    // Reporting: ROI
    navigate('/monitor');
    setIsOpen(false);
  };

  const runSuperAdmin = () => {
     login('admin@zentaras.ai');
     setIsOpen(false);
  }

  const runUserDemo = () => {
     login('matt@zentaras.ai');
     setIsOpen(false);
  }

  // --- New Feature Navigation Tests ---

  const runTrendHunter = () => {
      navigate('/trends');
      setIsOpen(false);
  };

  const runCampaignManager = () => {
      navigate('/campaigns');
      setIsOpen(false);
  };

  const runCalendarView = () => {
      // Inject a scheduled post for visual confirmation
      addPost({
          id: `test-sched-${Date.now()}`,
          content: "Beta Test Scheduled Post for Tomorrow",
          platform: 'Instagram',
          format: 'Post',
          voiceScore: 90,
          status: PostStatus.SCHEDULED,
          timestamp: Date.now(),
          scheduledTime: Date.now() + 86400000, // +1 day
          flaggedKeywords: [],
          author: 'Beta Tester'
      });
      navigate('/calendar');
      setIsOpen(false);
  };

  const runSettings = () => {
      navigate('/settings');
      setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-full shadow-lg border border-slate-600 z-50 transition-all hover:scale-110"
        title="Open Beta Test Protocol"
      >
        <Beaker className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Beaker className="w-5 h-5 text-purple-400" />
           <h3 className="font-bold text-white text-sm">Beta Test Protocol</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Roles</div>
        
        <button onClick={runUserDemo} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-indigo-900/30 p-2 rounded text-indigo-400 group-hover:text-indigo-300">
             <User className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Switch to User Demo</div>
             <div className="text-xs text-slate-500">Experience as a Standard User</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 ml-auto" />
        </button>

        <button onClick={runSuperAdmin} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-purple-900/30 p-2 rounded text-purple-400 group-hover:text-purple-300">
             <Shield className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Switch to Super Admin</div>
             <div className="text-xs text-slate-500">View Tenant Dashboard</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-purple-400 ml-auto" />
        </button>

        <button onClick={runResetOnboarding} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-amber-900/30 p-2 rounded text-amber-400 group-hover:text-amber-300">
             <Rocket className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Reset Onboarding</div>
             <div className="text-xs text-slate-500">Experience the First-Run Flow</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-amber-400 ml-auto" />
        </button>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Feature Tours</div>
        
        <div className="grid grid-cols-2 gap-2">
            <button onClick={runTrendHunter} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group">
                <Flame className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Trends</span>
            </button>
            <button onClick={runCampaignManager} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group">
                <Megaphone className="w-5 h-5 text-purple-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Campaigns</span>
            </button>
            <button onClick={runCalendarView} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group">
                <Calendar className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Calendar</span>
            </button>
            <button onClick={runSettings} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group">
                <Settings className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Settings</span>
            </button>
        </div>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Use Case Scenarios</div>
        
        <button onClick={runOmniChannel} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-purple-900/30 p-2 rounded text-purple-400 group-hover:text-purple-300">
             <Layers className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Omni-Channel Blast</div>
             <div className="text-xs text-slate-500">Generate for ALL 11 Platforms</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-purple-400 ml-auto" />
        </button>

        <button onClick={runUC2_1} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-blue-900/30 p-2 rounded text-blue-400 group-hover:text-blue-300">
             <PenTool className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Content Velocity</div>
             <div className="text-xs text-slate-500">Test B2B (LinkedIn + Twitter)</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-blue-400 ml-auto" />
        </button>

        <button onClick={runUC1_1} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-amber-900/30 p-2 rounded text-amber-400 group-hover:text-amber-300">
             <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Compliance Check</div>
             <div className="text-xs text-slate-500">Inject Flagged/Risky Post</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-amber-400 ml-auto" />
        </button>

        <button onClick={runUC3_1} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-red-900/30 p-2 rounded text-red-400 group-hover:text-red-300">
             <MessageSquare className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Crisis Management</div>
             <div className="text-xs text-slate-500">Inject High-Risk Inbox Msg</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-red-400 ml-auto" />
        </button>

        <button onClick={runUC4_1} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-emerald-900/30 p-2 rounded text-emerald-400 group-hover:text-emerald-300">
             <BarChart3 className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Reporting & ROI</div>
             <div className="text-xs text-slate-500">View Monitor/ROI Dashboard</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 ml-auto" />
        </button>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Beta Feedback Injection</div>
        
        <button onClick={runInjectFeedback} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left">
          <div className="bg-blue-900/30 p-2 rounded text-blue-400 group-hover:text-blue-300">
             <UserPlus className="w-4 h-4" />
          </div>
          <div>
             <div className="text-sm font-bold text-slate-200">Inject Beta Feedback</div>
             <div className="text-xs text-slate-500">Populate Super Admin Dashboard</div>
          </div>
          <Play className="w-3 h-3 text-slate-600 group-hover:text-blue-400 ml-auto" />
        </button>
      </div>
    </div>
  );
};

export default BetaTester;

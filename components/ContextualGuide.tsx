
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bot, X, ChevronRight, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContextTip } from '../types';
import clsx from 'clsx';

const ContextualGuide: React.FC = () => {
  const location = useLocation();
  const { messages, posts } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [tip, setTip] = useState<ContextTip | null>(null);

  useEffect(() => {
    // Logic to determine the best tip based on current page and app state
    const path = location.pathname;
    const unreadMessages = messages.filter(m => m.status === 'New').length;
    const drafts = posts.filter(p => p.status === 'Draft' || p.status === 'Needs Review').length;

    let newTip: ContextTip = {
        title: "Hello!",
        message: "I'm your AI assistant. I'll guide you through your marketing tasks.",
        type: 'info'
    };

    if (path === '/dashboard' || path === '/') {
        if (unreadMessages > 0) {
            newTip = {
                title: "Inbox Alert",
                message: `You have ${unreadMessages} customer messages waiting. Replying quickly boosts engagement!`,
                actionLabel: "Go to Inbox",
                actionLink: "/inbox",
                type: 'warning'
            };
        } else if (drafts > 0) {
            newTip = {
                title: "Finish your drafts",
                message: `You have ${drafts} posts waiting for approval. Let's get them scheduled.`,
                actionLabel: "Review Drafts",
                actionLink: "/review",
                type: 'info'
            };
        } else {
            newTip = {
                title: "Good Morning!",
                message: "Your calendar looks good. Want to create a post for next week?",
                actionLabel: "Create Post",
                actionLink: "/studio",
                type: 'success'
            };
        }
    } else if (path === '/studio') {
        newTip = {
            title: "Pro Tip",
            message: "Try selecting 'Recycle' to turn your best performing past post into a new format!",
            type: 'info'
        };
    } else if (path === '/review') {
        newTip = {
            title: "Quick Review",
            message: "Check for any yellow warning flags. Those might violate platform rules.",
            type: 'warning'
        };
    } else if (path === '/monitor') {
        newTip = {
            title: "Growth Insight",
            message: "Video content is getting 2x more engagement this week. Try creating a Reel next.",
            actionLabel: "Create Reel",
            actionLink: "/studio",
            type: 'success'
        };
    }

    setTip(newTip);
    setIsOpen(true);
  }, [location.pathname, messages, posts]);

  if (!tip || !isOpen) return null;

  return (
    <div className="fixed bottom-6 left-6 lg:left-72 z-40 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
        <div className={clsx(
            "bg-slate-900 border rounded-xl shadow-2xl p-4 flex gap-4 relative",
            tip.type === 'warning' ? "border-amber-500/50" : "border-slate-700"
        )}>
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-slate-500 hover:text-white"
            >
                <X className="w-3 h-3" />
            </button>

            <div className="shrink-0">
                <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                    tip.type === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-blue-600 text-white"
                )}>
                    {tip.type === 'info' ? <Bot className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
                </div>
            </div>

            <div className="flex-1">
                <h4 className={clsx("font-bold text-sm mb-1", tip.type === 'warning' ? "text-amber-400" : "text-white")}>
                    {tip.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                    {tip.message}
                </p>
                {tip.actionLabel && tip.actionLink && (
                    <Link 
                        to={tip.actionLink}
                        className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                        {tip.actionLabel} <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                )}
            </div>
        </div>
    </div>
  );
};

export default ContextualGuide;

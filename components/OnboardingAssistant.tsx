
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { chatWithOnboardingAgent } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Bot, Send, X, MessageCircle, Sparkles, User, Loader2, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const OnboardingAssistant: React.FC = () => {
    const { currentUser } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        if (currentUser && messages.length === 0) {
            setMessages([
                {
                    id: 'init-1',
                    role: 'assistant',
                    text: `Hi ${currentUser.name.split(' ')[0]}! 👋 I'm Nexocial AI, your personal onboarding assistant.`,
                    timestamp: Date.now()
                },
                {
                    id: 'init-2',
                    role: 'assistant',
                    text: "I can help you set up your brand voice, create your first campaign, or explain any feature. What would you like to do first?",
                    timestamp: Date.now() + 100
                }
            ]);
        }
    }, [currentUser]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !currentUser) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            text: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const responseText = await chatWithOnboardingAgent(
                userMsg.text, 
                messages, 
                { name: currentUser.name, plan: currentUser.plan }
            );

            const aiMsg: ChatMessage = {
                id: `resp-${Date.now()}`,
                role: 'assistant',
                text: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat Error", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!currentUser) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group",
                    isOpen ? "bg-slate-800 text-slate-400 rotate-90" : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
                )}
                {!isOpen && (
                   <div className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700">
                       Chat with Nexocial AI
                   </div>
                )}
            </button>

            {/* Chat Window */}
            <div 
                className={clsx(
                    "fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[550px] max-h-[70vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none translate-y-4"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/10">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Nexocial AI Assistant</h3>
                            <p className="text-xs text-indigo-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI Onboarding
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={clsx(
                                "flex gap-3 max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                msg.role === 'user' ? "bg-slate-700" : "bg-indigo-900/50 border border-indigo-500/30"
                            )}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                            </div>
                            
                            <div className={clsx(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === 'user' 
                                    ? "bg-blue-600 text-white rounded-tr-none" 
                                    : "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3 mr-auto max-w-[80%]">
                             <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="relative">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me anything about Nexocial..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none scrollbar-hide"
                            rows={1}
                            style={{ minHeight: '44px', maxHeight: '100px' }}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 top-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-colors"
                        >
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-[10px] text-slate-500">AI can make mistakes. Check important info.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnboardingAssistant;


import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Send, Sparkles, Target, Zap, TrendingUp, Users, MessageSquare, ShieldAlert, Loader2, Plus, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface StrategyNode {
    id: string;
    type: 'goal' | 'audience' | 'channel' | 'content' | 'risk';
    title: string;
    description: string;
    x: number;
    y: number;
}

const StrategyWarRoom: React.FC = () => {
    const { brandVoice } = useApp();
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: `Welcome to the Strategy War Room, ${brandVoice.name}. I've analyzed your brand soul. What's our primary objective for this quarter?` }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [nodes, setNodes] = useState<StrategyNode[]>([
        { id: '1', type: 'goal', title: 'Brand Awareness', description: 'Increase reach by 25% across all channels', x: 400, y: 100 },
        { id: '2', type: 'audience', title: 'Gen Z Creatives', description: 'Focus on visual-first platforms', x: 200, y: 300 },
        { id: '3', type: 'channel', title: 'TikTok/Reels', description: 'Short-form video dominance', x: 600, y: 300 },
    ]);
    const [activeNode, setActiveNode] = useState<string | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsThinking(true);

        // Simulate AI thinking and strategy generation
        setTimeout(() => {
            const aiResponse = "That's a bold move. Based on your brand's 'Bold' tone, I suggest we double down on interactive storytelling. I've added a new 'Content' node to our strategy map.";
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            
            const newNode: StrategyNode = {
                id: Date.now().toString(),
                type: 'content',
                title: 'Interactive Stories',
                description: 'Weekly Q&A and community polls',
                x: 400,
                y: 500
            };
            setNodes(prev => [...prev, newNode]);
            setIsThinking(false);
        }, 1500);
    };

    const getNodeIcon = (type: StrategyNode['type']) => {
        switch(type) {
            case 'goal': return <Target className="w-5 h-5 text-emerald-400" />;
            case 'audience': return <Users className="w-5 h-5 text-blue-400" />;
            case 'channel': return <Zap className="w-5 h-5 text-purple-400" />;
            case 'content': return <Sparkles className="w-5 h-5 text-orange-400" />;
            case 'risk': return <ShieldAlert className="w-5 h-5 text-red-400" />;
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6 overflow-hidden animate-in fade-in duration-700">
            {/* Left: Strategy Map (Visual WOW) */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden group">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                
                <div className="absolute top-6 left-6 z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Brain className="w-6 h-6 text-indigo-500" /> Strategy War Room
                    </h2>
                    <p className="text-slate-500 text-sm">Visualizing your path to market dominance.</p>
                </div>

                <div className="absolute top-6 right-6 z-10 flex gap-2">
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Nodes Canvas */}
                <div className="absolute inset-0 p-12">
                    {nodes.map((node) => (
                        <motion.div
                            key={node.id}
                            drag
                            dragMomentum={false}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className={clsx(
                                "absolute cursor-move p-4 rounded-xl border-2 transition-all w-64 shadow-2xl",
                                activeNode === node.id 
                                    ? "bg-indigo-900/40 border-indigo-500 shadow-indigo-500/20" 
                                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                            )}
                            style={{ left: node.x, top: node.y }}
                            onClick={() => setActiveNode(node.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-1.5 bg-slate-950 rounded-lg">
                                    {getNodeIcon(node.type)}
                                </div>
                                <button className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1">{node.title}</h4>
                            <p className="text-slate-400 text-[10px] leading-relaxed">{node.description}</p>
                        </motion.div>
                    ))}

                    {/* SVG Connections (Mock) */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-20">
                        <line x1="400" y1="180" x2="200" y2="300" stroke="white" strokeWidth="1" strokeDasharray="4" />
                        <line x1="400" y1="180" x2="600" y2="300" stroke="white" strokeWidth="1" strokeDasharray="4" />
                        <line x1="200" y1="380" x2="400" y2="500" stroke="white" strokeWidth="1" strokeDasharray="4" />
                        <line x1="600" y1="380" x2="400" y2="500" stroke="white" strokeWidth="1" strokeDasharray="4" />
                    </svg>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 flex gap-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Goal
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div> Audience
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div> Channel
                    </div>
                </div>
            </div>

            {/* Right: AI Strategist Chat */}
            <div className="w-full lg:w-96 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">AI Strategist Online</span>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx(
                                    "max-w-[85%] p-3 rounded-xl text-sm",
                                    msg.role === 'user' 
                                        ? "bg-indigo-600 text-white ml-auto rounded-tr-none" 
                                        : "bg-slate-900 text-slate-300 mr-auto rounded-tl-none border border-slate-800"
                                )}
                            >
                                {msg.content}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isThinking && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                            <Loader2 className="w-3 h-3 animate-spin" /> Strategist is analyzing market data...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Ask for a strategy pivot..." 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategyWarRoom;

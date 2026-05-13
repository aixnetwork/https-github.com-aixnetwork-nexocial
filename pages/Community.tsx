
import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, AlertOctagon, Send, ThumbsUp, User, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const Community: React.FC = () => {
  const { messages, sendMessageReply } = useApp();

  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || messages.find(m => m.status === 'New');

  const handleApproveReply = (id: string, reply: string) => {
    sendMessageReply(id, reply);
    // In real app, this would post to the API
    alert("Reply posted successfully!");
  };

  const getSentimentBadge = (sentiment: string) => {
      if (sentiment === 'Positive') return <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">😊 Happy</span>;
      if (sentiment === 'Negative') return <span className="bg-red-900/30 text-red-400 border border-red-900 px-2 py-0.5 rounded text-[10px] font-bold">😠 Unhappy</span>;
      if (sentiment === 'Sarcastic') return <span className="bg-purple-900/30 text-purple-400 border border-purple-900 px-2 py-0.5 rounded text-[10px] font-bold">🙃 Sarcastic</span>;
      return <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">😐 Neutral</span>;
  }

  const getPriorityBadge = (level: string) => {
      if (level === 'High') return <span className="bg-red-950 text-red-500 border border-red-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">High Priority</span>;
      return <span className="bg-slate-900 text-slate-500 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Normal</span>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Inbox</h2>
        <p className="text-slate-400">Manage customer comments and messages in one place.</p>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inbox List */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Messages</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {messages.map(msg => (
               <div 
                 key={msg.id} 
                 onClick={() => setSelectedMessageId(msg.id)}
                 className={clsx(
                   "p-5 border-b border-slate-800/50 hover:bg-slate-900/50 cursor-pointer transition-all duration-200 group relative",
                   msg.status === 'New' ? "bg-blue-500/5" : "",
                   selectedMessageId === msg.id && "bg-slate-900 border-l-4 border-l-blue-500"
                 )}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors">
                       <User className="w-5 h-5 text-slate-400" />
                     </div>
                     <div>
                       <p className={clsx("text-sm font-bold transition-colors", msg.status === 'New' ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>{msg.sender}</p>
                       <div className="flex items-center gap-1.5">
                         <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{msg.platform}</span>
                         {msg.status === 'New' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {msg.status === 'Replied' && (
                        <div className="flex items-center gap-1 mt-1 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          <span className="text-[8px] text-indigo-400 font-bold uppercase">AI</span>
                        </div>
                      )}
                    </div>
                 </div>
                 
                 <p className="text-slate-400 text-xs line-clamp-1 mb-3 pl-13 group-hover:text-slate-300 transition-colors">{msg.content}</p>

                 <div className="flex flex-wrap gap-2 pl-13">
                   {getPriorityBadge(msg.riskLevel)}
                   {getSentimentBadge(msg.sentiment)}
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Message Detail & Action */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col relative overflow-hidden shadow-2xl">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

           {selectedMessage ? (
             <div className="flex-1 flex flex-col relative z-10">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-none mb-1">{selectedMessage.sender}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        Active on {selectedMessage.platform} • {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedMessage.riskLevel)}
                    {getSentimentBadge(selectedMessage.sentiment)}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                   <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Incoming Message Bubble */}
                      <div className="flex gap-4 mb-2 max-w-[85%]">
                         <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                             <User className="w-5 h-5 text-slate-400" />
                         </div>
                         <div className="bg-slate-800/50 p-5 rounded-2xl rounded-tl-none border border-slate-700 shadow-lg backdrop-blur-sm">
                             <p className="text-base text-slate-200 leading-relaxed">{selectedMessage.content}</p>
                         </div>
                      </div>
                      <div className="ml-14 mb-8">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{new Date(selectedMessage.timestamp).toLocaleTimeString()}</span>
                      </div>

                      {/* AI Analysis / Replied State */}
                      {selectedMessage.status === 'Replied' && (
                        <div className="flex gap-4 justify-end ml-auto max-w-[85%]">
                            <div className="bg-indigo-600/10 p-5 rounded-2xl rounded-tr-none border border-indigo-500/30 shadow-lg backdrop-blur-sm flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-indigo-300 text-xs flex items-center gap-1.5 uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3" /> AI Agent Engagement
                                    </span>
                                </div>
                                <p className="text-base text-slate-200 leading-relaxed italic">"{selectedMessage.suggestedReply}"</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center shrink-0 mt-1 shadow-xl shadow-indigo-900/40">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Action Area */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/40 backdrop-blur-md">
                   {selectedMessage.status === 'Replied' ? (
                      <div className="flex justify-center">
                          <button className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2">
                            <AlertOctagon className="w-3.5 h-3.5" /> Undo AI Reply & Take Control
                          </button>
                      </div>
                   ) : selectedMessage.riskLevel === 'High' ? (
                     <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 flex items-center gap-6">
                       <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center shrink-0 border border-red-800/50">
                          <AlertOctagon className="w-8 h-8 text-red-500" />
                       </div>
                       <div className="flex-1">
                         <h3 className="text-lg font-bold text-red-400 mb-1">High Priority Crisis Detected</h3>
                         <p className="text-sm text-slate-400 mb-0">
                           AI recommends human intervention. Auto-reply has been disabled for safety.
                         </p>
                       </div>
                       <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 whitespace-nowrap">
                         Human Takeover
                       </button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="relative group">
                          <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">AI Suggested Engagement</span>
                          </div>
                          <textarea 
                            className="w-full bg-slate-900/50 border border-slate-700 group-hover:border-indigo-500/50 rounded-2xl p-5 text-white focus:outline-none focus:border-indigo-500 min-h-[120px] transition-all backdrop-blur-sm text-base leading-relaxed"
                            defaultValue={selectedMessage.suggestedReply}
                          />
                       </div>
                       <div className="flex gap-4">
                          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold transition-all border border-slate-700 uppercase tracking-widest text-xs">
                            Discard
                          </button>
                          <button 
                            onClick={() => selectedMessage.suggestedReply && handleApproveReply(selectedMessage.id, selectedMessage.suggestedReply)}
                            className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-900/20 uppercase tracking-widest text-xs"
                          >
                            <Send className="w-4 h-4" /> Approve & Send Reply
                          </button>
                       </div>
                     </div>
                   )}
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-slate-900/50 border border-slate-800 rounded-full flex items-center justify-center mb-8 animate-pulse">
                   <ThumbsUp className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Inbox Zero</h3>
                <p className="text-slate-500 max-w-xs">All customer interactions have been handled. You're completely caught up.</p>
             </div>
           )}
        </div>
      </div>

    </div>
  );
};

export default Community;

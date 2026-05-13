
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostStatus } from '../types';
import { CheckSquare, CheckCircle, Trash2, Calendar, Check, X, PartyPopper } from 'lucide-react';

const ReviewQueue: React.FC = () => {
  const { posts, updatePostStatus, deletePost, schedulePost } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [schedulePostId, setSchedulePostId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const needsReview = posts.filter(p => p.status === PostStatus.NEEDS_REVIEW || p.status === PostStatus.DRAFT);
  const scheduled = posts.filter(p => p.status === PostStatus.APPROVED || p.status === PostStatus.PUBLISHED || p.status === PostStatus.SCHEDULED);

  const handleApprove = (id: string) => {
    updatePostStatus(id, PostStatus.APPROVED);
    setSelectedIds(prev => prev.filter(pid => pid !== id));
  };

  const handleReject = (id: string) => {
    if (confirm("Delete this draft?")) {
      deletePost(id);
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => selectedIds.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === needsReview.length ? [] : needsReview.map(p => p.id));
  };

  const handleBulkApprove = () => {
    selectedIds.forEach(id => updatePostStatus(id, PostStatus.APPROVED));
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    if (confirm(`Delete ${selectedIds.length} drafts?`)) {
      selectedIds.forEach(id => deletePost(id));
      setSelectedIds([]);
    }
  };

  const handleApproveAllSafe = () => {
      // Approve all that don't have flagged keywords
      const safePosts = needsReview.filter(p => p.flaggedKeywords.length === 0);
      safePosts.forEach(p => updatePostStatus(p.id, PostStatus.APPROVED));
      alert(`Approved ${safePosts.length} posts!`);
  }

  const handleOpenSchedule = (id: string) => {
    setSchedulePostId(id);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    setScheduleDate(`${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T09:00`);
  };

  const confirmSchedule = () => {
    if (schedulePostId && scheduleDate) {
      const timestamp = new Date(scheduleDate).getTime();
      schedulePost(schedulePostId, timestamp);
      setSelectedIds(prev => prev.filter(pid => pid !== schedulePostId));
      setSchedulePostId(null);
      setScheduleDate('');
    }
  };

  return (
    <div className="space-y-8 relative">
      {schedulePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
           <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" /> Schedule Post
                </h3>
                <button onClick={() => setSchedulePostId(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6">
                <input type="datetime-local" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSchedulePostId(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button onClick={confirmSchedule} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">Confirm</button>
              </div>
           </div>
        </div>
      )}

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Content Approvals</h2>
                <p className="text-slate-400">Review your AI-generated drafts here before they go live.</p>
            </div>
            {needsReview.length > 0 && (
                <button 
                    onClick={handleApproveAllSafe}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <CheckCircle className="w-5 h-5" /> Approve All Safe Posts
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-500" /> Pending Review ({needsReview.length})
            </h3>
          </div>

          {needsReview.length > 0 && (
             <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center gap-3">
                   <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedIds.length > 0 && selectedIds.length === needsReview.length} onChange={handleSelectAll} />
                   <span className="text-sm text-slate-400 font-medium">{selectedIds.length === 0 ? "Select All" : `${selectedIds.length} Selected`}</span>
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2">
                     <button onClick={handleBulkReject} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950 text-red-400 hover:bg-red-900 border border-red-900/50 flex items-center gap-1"><X className="w-3 h-3" /> Delete</button>
                     <button onClick={handleBulkApprove} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 shadow-lg"><Check className="w-3 h-3" /> Approve</button>
                  </div>
                )}
             </div>
          )}

          {needsReview.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <PartyPopper className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
              <p className="text-slate-400">No drafts waiting for approval.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {needsReview.map(post => (
                <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative group hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedIds.includes(post.id)} onChange={() => handleToggleSelect(post.id)} />
                       <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{post.platform}</span>
                       {post.status === PostStatus.DRAFT && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">DRAFT</span>}
                       {post.status === PostStatus.NEEDS_REVIEW && <span className="text-[10px] bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded border border-amber-900/50">NEEDS REVIEW</span>}
                    </div>
                    <span className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-lg text-slate-200 mb-4 font-light pl-8">{post.content}</p>
                  
                  {post.flaggedKeywords.length > 0 && (
                      <div className="ml-8 mb-4 p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg text-sm text-amber-200">
                          ⚠️ Contains flagged words: <span className="font-bold">{post.flaggedKeywords.join(', ')}</span>
                      </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-900 pl-8">
                      <button onClick={() => handleReject(post.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                      <button onClick={() => handleOpenSchedule(post.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"><Calendar className="w-4 h-4" /> Schedule</button>
                      <button onClick={() => handleApprove(post.id)} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg font-bold"><CheckCircle className="w-4 h-4" /> Approve</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Published / Scheduled</h3>
            <div className="space-y-4">
               {scheduled.slice(0, 5).map(post => (
                 <div key={post.id} className="pb-3 border-b border-slate-900 last:border-0">
                    <p className="text-sm text-slate-300 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500 capitalize font-bold">{post.platform}</span>
                       <span className={`px-2 py-0.5 rounded font-bold ${post.status === 'Published' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-purple-900/30 text-purple-400'}`}>{post.status}</span>
                    </div>
                 </div>
               ))}
               {scheduled.length === 0 && <p className="text-sm text-slate-500">No history yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewQueue;

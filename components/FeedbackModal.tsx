
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, AlertCircle, Bug, Lightbulb, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { submitFeedback } = useApp();
  const [type, setType] = useState<'Improvement' | 'Bug' | 'Technical Issue'>('Improvement');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await submitFeedback(type, message);
      setMessage('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-950 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Help & Feedback</h3>
            <p className="text-slate-400 text-sm">Tell us how we can improve.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-900 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">What is this about?</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Improvement', label: 'Idea', icon: Lightbulb, color: 'text-yellow-400', border: 'hover:border-yellow-500/50' },
                { id: 'Bug', label: 'Bug', icon: Bug, color: 'text-red-400', border: 'hover:border-red-500/50' },
                { id: 'Technical Issue', label: 'Issue', icon: AlertCircle, color: 'text-orange-400', border: 'hover:border-orange-500/50' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as any)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                    type === item.id 
                      ? "bg-slate-800 border-blue-500 text-white" 
                      : `bg-slate-900 border-slate-800 text-slate-400 ${item.border}`
                  )}
                >
                  <item.icon className={clsx("w-5 h-5", type === item.id ? item.color : "text-slate-500")} />
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Details</label>
            <textarea
              required
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none placeholder-slate-600"
              placeholder={type === 'Bug' ? "What happened? Steps to reproduce..." : "How can we make Nexocial better?"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-3 flex gap-3 items-start">
             <div className="p-1.5 bg-blue-900/30 rounded-full shrink-0">
                <Send className="w-3 h-3 text-blue-400" />
             </div>
             <p className="text-[10px] text-blue-300 leading-relaxed">
                Your feedback will be sent directly to our product team and a copy will be emailed to <span className="font-bold underline">support@aixnetwork.net</span>.
             </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;

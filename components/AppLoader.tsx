import React from 'react';
import { Loader2, Zap } from 'lucide-react';

const AppLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center animate-pulse">
        <Zap className="w-7 h-7 text-white" />
      </div>
      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
    </div>
  </div>
);

export default AppLoader;

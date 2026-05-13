
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Menu, X, Check, ArrowRight, Star, Shield, Zap as ZapIcon, Clock, DollarSign, BarChart3, TrendingUp, Heart, Activity, Flame } from 'lucide-react';
import clsx from 'clsx';

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <Star 
                key={s} 
                className={clsx("w-4 h-4", s <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700")} 
            />
        ))}
    </div>
);

const ComparisonRow = ({ feature, legacy, nexocial, rating }: any) => (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <td className="py-6 pr-4">
            <div className="font-bold text-white mb-1">{feature}</div>
            <div className="text-xs text-slate-500">Industry Standard vs. AI-First</div>
        </td>
        <td className="py-6 px-4 text-slate-400 italic">
            {legacy}
        </td>
        <td className="py-6 px-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <ZapIcon className="w-4 h-4 fill-current" />
                {nexocial}
            </div>
        </td>
        <td className="py-6 pl-4 text-right">
            <RatingStars rating={rating} />
        </td>
    </tr>
);

const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 transition-all h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Zap className="text-white w-6 h-6 fill-current" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">Nexocial</div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
                 <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Home</Link>
                 <Link to="/features" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Features</Link>
                 <Link to="/comparison" className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-full bg-white/5">Comparison</Link>
                 <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Pricing</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
                <button onClick={() => navigate('/?mode=login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
                <button onClick={() => navigate('/?mode=register')} className="bg-white text-black hover:bg-slate-200 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <button className="md:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {isMobileMenuOpen && (
           <div className="md:hidden bg-[#0B0F19] border-b border-white/10 px-4 pt-2 pb-6 shadow-2xl absolute w-full left-0 top-20 z-[60]">
              <Link to="/" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Home</Link>
              <Link to="/features" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Features</Link>
              <Link to="/comparison" className="block w-full text-left text-white font-medium py-3 border-b border-white/5">Comparison</Link>
              <Link to="/pricing" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Pricing</Link>
              <button onClick={() => navigate('/?mode=login')} className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white">Log In</button>
              <button onClick={() => navigate('/?mode=register')} className="block w-full bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold mt-4 shadow-md">Start Free Trial</button>
           </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 text-center">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Nexocial vs. <span className="text-slate-500 italic">Legacy Schedulers.</span></h1>
            <p className="text-xl text-slate-400 leading-relaxed">
                Why pay $99/mo for a legacy scheduler when you can get an AI social growth engine for $19?
            </p>
         </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
         <div className="bg-[#131825] border border-white/10 rounded-[2rem] overflow-x-auto shadow-2xl">
            <div className="p-8 md:p-12 min-w-[800px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="pb-8 text-sm font-bold text-slate-500 uppercase tracking-widest">Capability</th>
                            <th className="pb-8 px-4 text-sm font-bold text-slate-500 uppercase tracking-widest">Legacy Tools</th>
                            <th className="pb-8 px-4 text-sm font-bold text-indigo-400 uppercase tracking-widest">Nexocial AI</th>
                            <th className="pb-8 text-right text-sm font-bold text-slate-500 uppercase tracking-widest">Nexocial Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow 
                            feature="Trend Discovery" 
                            legacy="Manual (OwlyWriter AI)" 
                            nexocial="Predictive Virality™" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="Sentiment Analysis" 
                            legacy="Basic Keyword Tracking" 
                            nexocial="Real-time Emotional Intelligence" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="Social Strategy" 
                            legacy="Manual Ideation" 
                            nexocial="AI-First Growth Engine" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="Entry Price" 
                            legacy="$99/mo (1 User)" 
                            nexocial="$19/mo (Entry)" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="AI Autonomy" 
                            legacy="Passive Assistant" 
                            nexocial="24/7 AI Social Agent" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="Viral Remixing" 
                            legacy="Manual Copy/Paste" 
                            nexocial="One-click Optimization" 
                            rating={5} 
                        />
                        <ComparisonRow 
                            feature="Pricing Predictability" 
                            legacy="Expensive Seat Taxes" 
                            nexocial="Entry plan ($19)" 
                            rating={5} 
                        />
                    </tbody>
                </table>
            </div>
         </div>
      </section>

      {/* Summary Cards */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6"><Clock className="text-indigo-400" /></div>
                <h3 className="text-xl font-bold text-white mb-4">85% Time Savings</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Our users report saving an average of 12 hours per week by automating the ideation and drafting phases.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6"><TrendingUp className="text-emerald-400" /></div>
                <h3 className="text-xl font-bold text-white mb-4">3x Engagement</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Trend-driven content consistently outperforms generic posts by leveraging real-time cultural momentum.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6"><Shield className="text-purple-400" /></div>
                <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Built-in compliance guards ensure your AI never goes off-script or mentions competitors accidentally.</p>
            </div>
         </div>
      </section>

      {/* Final Verdict */}
      <section className="py-24 px-4 text-center">
         <div className="max-w-3xl mx-auto bg-indigo-900/20 border border-indigo-500/30 p-12 rounded-[3rem]">
            <h2 className="text-3xl font-bold text-white mb-6">The Verdict</h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Legacy tools are <strong>passive</strong>. They wait for you to do the work. Nexocial is <strong>active</strong>. It brings ideas, drafts content, and manages your community while you sleep.
            </p>
            <div className="flex flex-col items-center gap-2">
                <div className="text-5xl font-black text-white">9.2/10</div>
                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Overall Nexocial Score</div>
                <div className="mt-8">
                    <button onClick={() => navigate('/?mode=register')} className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-slate-200 transition-all shadow-xl">
                        Experience the Difference
                    </button>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05080f] text-white pt-24 pb-12 border-t border-white/5 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div>
                    <h4 className="font-bold text-white mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-indigo-400 transition-colors">Why Nexocial</Link></li>
                        <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                        <li><Link to="/comparison" className="hover:text-indigo-400 transition-colors">Comparison</Link></li>
                        <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                        <li><a href="mailto:hello@nexocial.ai" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Blog</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Community</a></li>
                        <li><a href="mailto:support@nexocial.ai" className="hover:text-indigo-400 transition-colors">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Security</a></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Zap className="text-white w-5 h-5 fill-current" /></div>
                    <span className="text-xl font-bold tracking-tight">Nexocial</span>
                </div>
                <p className="text-slate-500 text-sm mb-4 md:mb-0">
                    &copy; 2026 Nexocial, Inc. All rights reserved.
                </p>
                <div className="text-center">
                     <p className="text-xs text-slate-700 font-medium">Powered by <a href="https://aixnetwork.net" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">AI X Network</a></p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ComparisonPage;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Menu, X, Check, ArrowRight, Flame, RefreshCw, Target, Sparkles, BarChart3, Users, ShieldCheck, Globe, Cpu, Heart, Activity } from 'lucide-react';
import clsx from 'clsx';

const FeatureCard = ({ icon: Icon, title, description, colorClass }: any) => (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group">
        <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", colorClass)}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 transition-all h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Zap className="text-white w-6 h-6 fill-current" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">Nexocial</div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
                 <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Home</Link>
                 <Link to="/features" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Features</Link>
                 <Link to="/comparison" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Comparison</Link>
                 <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Pricing</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
                <button onClick={() => navigate('/?mode=login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
                <button 
                  onClick={() => navigate('/?mode=register')}
                  className="bg-white text-black hover:bg-slate-200 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
           <div className="md:hidden bg-[#0B0F19] border-b border-white/10 px-4 pt-2 pb-6 shadow-2xl absolute w-full left-0 top-20 z-[60]">
              <Link to="/" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Home</Link>
              <Link to="/features" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Features</Link>
              <Link to="/comparison" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Comparison</Link>
              <Link to="/pricing" className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Pricing</Link>
              <button onClick={() => navigate('/?mode=login')} className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white">Log In</button>
              <button onClick={() => navigate('/?mode=register')} className="block w-full bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold mt-4 shadow-md">Start Free Trial</button>
           </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>
         <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">The AI Social <span className="text-indigo-400">Growth Engine.</span></h1>
            <p className="text-xl text-slate-400 leading-relaxed">
                Nexocial isn't just a tool; it's your entire social media team, condensed into a single, intelligent platform.
            </p>
         </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
                icon={Flame} 
                title="Predictive Virality™" 
                description="Our proprietary AI scans global trends, news, and social sentiment to identify what's about to go viral in your niche before it happens."
                colorClass="bg-orange-500/10 text-orange-500"
            />
            <FeatureCard 
                icon={Heart} 
                title="Brand Soul Visualizer" 
                description="Generate a single core message and let Nexocial transform it into optimized formats for LinkedIn, X, Instagram, TikTok, and more."
                colorClass="bg-indigo-500/10 text-indigo-500"
            />
            <FeatureCard 
                icon={Activity} 
                title="Viral Velocity Tracking" 
                description="Set a goal like 'Product Launch' or 'Brand Awareness' and Nexocial will architect a full 30-day content strategy with cohesive messaging."
                colorClass="bg-emerald-500/10 text-emerald-500"
            />
            <FeatureCard 
                icon={Sparkles} 
                title="AI Brand Soul" 
                description="We don't just generate text. We train an AI model on your specific brand voice, values, and visual style for 100% consistency."
                colorClass="bg-purple-500/10 text-purple-500"
            />
            <FeatureCard 
                icon={BarChart3} 
                title="Predictive Analytics" 
                description="See how your content is likely to perform before you even post it. Our AI predicts engagement rates based on historical data."
                colorClass="bg-blue-500/10 text-blue-500"
            />
            <FeatureCard 
                icon={Users} 
                title="AI Auto-Engagement" 
                description="Let Nexocial handle the comments. Our AI Agent engages with your community 24/7, answering questions and building relationships."
                colorClass="bg-pink-500/10 text-pink-500"
            />
            <FeatureCard 
                icon={ShieldCheck} 
                title="Compliance Guard" 
                description="Never worry about brand safety. Our AI automatically flags restricted terms, competitor mentions, and controversial topics."
                colorClass="bg-amber-500/10 text-amber-500"
            />
            <FeatureCard 
                icon={Globe} 
                title="Global Distribution" 
                description="Schedule and publish to all major social networks from one dashboard. Nexocial handles time zones and peak engagement windows."
                colorClass="bg-cyan-500/10 text-cyan-500"
            />
            <FeatureCard 
                icon={Cpu} 
                title="Custom AI Training" 
                description="Upload your past successful content and Nexocial will learn exactly what makes your audience tick, getting smarter with every post."
                colorClass="bg-slate-500/10 text-slate-300"
            />
         </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-6">Built for the <span className="text-indigo-400">Modern Social Strategist.</span></h2>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Traditional social media tools are just fancy spreadsheets. Nexocial is different. We've built an engine that understands context, culture, and viral momentum.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Zero-Prompt Content Generation",
                            "Real-time Trend Integration",
                            "Automated Multi-Platform Formatting",
                            "Brand Voice Consistency Engine"
                        ].map(item => (
                            <li key={item} className="flex items-center gap-3 text-white font-medium">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-indigo-400" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Nexocial AI Assistant</h4>
                                <p className="text-xs text-slate-500">Always Online</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                                <p className="text-sm text-slate-300">"I've identified a rising trend in #SustainableTech. Should I draft a 5-post thread for LinkedIn?"</p>
                            </div>
                            <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none ml-auto max-w-[80%]">
                                <p className="text-sm text-white font-medium">"Yes, please. Make it sound professional yet energetic."</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                                <p className="text-sm text-slate-300">"Drafting now. I'll also create a matching Instagram Reel script and a X thread hook."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
         <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to scale your <br /> brand with AI?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={() => navigate('/?mode=register')} className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl">Start Free Trial</button>
                    <button onClick={() => navigate('/pricing')} className="bg-indigo-900/30 text-white border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-900/50 transition-all">View Pricing</button>
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

export default FeaturesPage;

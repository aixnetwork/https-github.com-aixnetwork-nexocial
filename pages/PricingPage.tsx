
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Menu, X, Check, ArrowRight, Calculator, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ROI Calculator State
  const [roiHourlyRate, setRoiHourlyRate] = useState(45);
  const [roiHoursPerWeek, setRoiHoursPerWeek] = useState(5);
  const monthlyManualCost = roiHourlyRate * roiHoursPerWeek * 4;
  const monthlyAICost = 19;
  const monthlySavings = Math.max(0, monthlyManualCost - monthlyAICost);
  const yearlySavings = monthlySavings * 12;

  const handleGetStarted = () => {
    navigate('/?mode=register');
  };

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
                 <button onClick={() => navigate('/')} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Home</button>
                 <button onClick={() => navigate('/features')} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Features</button>
                 <button onClick={() => navigate('/comparison')} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">Comparison</button>
                 <button onClick={() => navigate('/pricing')} className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-full bg-white/5">Pricing</button>
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
              <button onClick={() => navigate('/')} className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Home</button>
              <button onClick={() => navigate('/features')} className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Features</button>
              <button onClick={() => navigate('/comparison')} className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white border-b border-white/5">Comparison</button>
              <button onClick={() => navigate('/pricing')} className="block w-full text-left text-white font-medium py-3 border-b border-white/5">Pricing</button>
              <button 
                onClick={() => navigate('/?mode=login')}
                className="block w-full text-left text-slate-400 font-medium py-3 hover:text-white"
              >
                 Log In
              </button>
              <button 
                onClick={() => navigate('/?mode=register')}
                className="block w-full bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold mt-4 shadow-md"
              >
                Start Free Trial
              </button>
           </div>
        )}
      </header>

      {/* Pricing Grid */}
      <section className="py-24 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple Plans. Viral Growth.</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    No enterprise-level bloat or hidden fees. <button onClick={() => navigate('/comparison')} className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4">Compare us to legacy schedulers</button> and see why brands are switching.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                {/* Entry Plan */}
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-white/20 flex flex-col transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-white">Entry</h3>
                    <p className="text-slate-500 mb-6">Perfect for solo creators.</p>
                    <div className="text-5xl font-extrabold mb-8 text-white">$19<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-indigo-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 5 Social Profiles</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 1 User Seat</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 50 AI-Generated Posts / mo</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> Basic Analytics</li>
                    </ul>
                    <button onClick={handleGetStarted} className="w-full text-white border border-white/20 font-bold py-3 rounded-xl hover:bg-white/10 transition duration-300 mt-auto">
                        Start Free Trial
                    </button>
                </div>

                {/* Catalyst Plan (Featured) */}
                <div className="bg-[#131825] p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 relative flex flex-col transform md:scale-105 z-10">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Most Popular</div>
                    <h3 className="text-2xl font-bold mb-2 text-white mt-4">Catalyst</h3>
                    <p className="text-slate-400 mb-6">Accelerate your brand growth.</p>
                    <div className="text-5xl font-extrabold mb-8 text-indigo-400">$49<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-emerald-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-200 font-medium"><Check className="w-5 h-5 mr-3 text-indigo-500" /> 20 Social Profiles</li>
                        <li className="flex items-center text-slate-200 font-medium"><Check className="w-5 h-5 mr-3 text-indigo-500" /> 5 Team Seats</li>
                        <li className="flex items-center text-slate-200 font-medium"><Check className="w-5 h-5 mr-3 text-indigo-500" /> Unlimited AI Content</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-500" /> Predictive Virality Heatmaps</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-500" /> Viral Velocity Tracking</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-indigo-500" /> Priority Support</li>
                    </ul>
                    <button onClick={handleGetStarted} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-700 transition duration-300 mt-auto transform hover:-translate-y-1">
                        Start Free Trial
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-white/20 flex flex-col transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-white">Enterprise</h3>
                    <p className="text-slate-500 mb-6">Dominance at scale.</p>
                    <div className="text-5xl font-extrabold mb-8 text-white">$199<span className="text-xl font-medium text-slate-500">/mo</span></div>
                    <p className="text-xs text-indigo-400 font-bold mb-6">30-Day Free Trial Included</p>
                    <ul className="text-left space-y-4 mb-10 flex-grow">
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> Unlimited Social Profiles</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> 25 Team Seats</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> Custom Brand Voice Training</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> AI Auto-Engagement Agent</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> API Access</li>
                        <li className="flex items-center text-slate-300"><Check className="w-5 h-5 mr-3 text-emerald-500" /> Dedicated Account Manager</li>
                    </ul>
                    <button onClick={handleGetStarted} className="w-full text-white border border-white/20 font-bold py-3 rounded-xl hover:bg-white/10 transition duration-300 mt-auto">
                        Start Free Trial
                    </button>
                </div>
            </div>

            {/* ROI Calculator */}
            <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-br from-[#131825] to-[#0B0F19] border border-indigo-500/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                            <Calculator className="w-8 h-8 text-emerald-400" />
                            Social ROI Calculator
                        </h3>
                        <p className="text-slate-400 mb-8">See how much time and money you save by automating content creation, scheduling, and community engagement.</p>
                        
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                                    <span>Your Hourly Value</span>
                                    <span className="text-indigo-400">${roiHourlyRate}/hr</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="15" 
                                    max="150" 
                                    step="5" 
                                    value={roiHourlyRate} 
                                    onChange={(e) => setRoiHourlyRate(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-slate-600 mt-1">
                                    <span>$15</span>
                                    <span>$150</span>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                                    <span>Hours on Social / Week</span>
                                    <span className="text-indigo-400">{roiHoursPerWeek} hrs</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="40" 
                                    step="1" 
                                    value={roiHoursPerWeek} 
                                    onChange={(e) => setRoiHoursPerWeek(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-slate-600 mt-1">
                                    <span>1 hr</span>
                                    <span>40 hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-indigo-500/20 text-center relative backdrop-blur-sm">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Your Potential Savings
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Monthly Cost (Manual)</p>
                                <p className="text-xl font-bold text-slate-400 line-through decoration-red-500/50 decoration-2">${Math.round(monthlyManualCost).toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                                <p className="text-xs text-indigo-300 uppercase font-bold mb-1 relative z-10">Monthly Cost (AI)</p>
                                <p className="text-xl font-bold text-white relative z-10">${monthlyAICost}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-slate-400 text-sm">You save <span className="text-emerald-400 font-bold">${Math.round(monthlySavings).toLocaleString()}</span> every month</p>
                            <div className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 py-2">
                                ${Math.round(yearlySavings).toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Yearly Savings</p>
                        </div>
                        
                        <button 
                            onClick={handleGetStarted}
                            className="w-full mt-6 bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Start Saving Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
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
                        <li><button onClick={() => navigate('/')} className="hover:text-indigo-400 transition-colors text-left">Why Nexocial</button></li>
                        <li><button onClick={() => navigate('/features')} className="hover:text-indigo-400 transition-colors text-left">Features</button></li>
                        <li><button onClick={() => navigate('/comparison')} className="hover:text-indigo-400 transition-colors text-left">Comparison</button></li>
                        <li><button onClick={() => navigate('/pricing')} className="hover:text-indigo-400 transition-colors text-left">Pricing</button></li>
                        <li><button onClick={() => navigate('/')} className="hover:text-indigo-400 transition-colors text-left">Log In</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><button onClick={() => navigate('/')} className="hover:text-indigo-400 transition-colors text-left">About Us</button></li>
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
                <p className="text-slate-500 text-sm mb-4 md:mb-0">
                    &copy; 2026 Nexocial, Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                </div>
            </div>
            <div className="text-center mt-12">
                 <p className="text-xs text-slate-700 font-medium">Powered by <a href="https://aixnetwork.net" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">AI X Network</a></p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;

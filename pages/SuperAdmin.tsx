
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, DollarSign, Activity, Search, Shield, LogIn, Trash2, Ban, CreditCard, ArrowUpRight, Trophy, Award, TrendingUp, MessageSquare, CheckCircle, AlertTriangle, Bug, Lightbulb, User, Settings, Save, X, Loader2, Key, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { PaymentProvider } from '../types';

interface GatewayConfigModalProps {
    provider: PaymentProvider;
    isOpen: boolean;
    onClose: () => void;
}

const GatewayConfigModal: React.FC<GatewayConfigModalProps> = ({ provider, isOpen, onClose }) => {
    const { configureAdminGateway } = useApp();
    const [loading, setLoading] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [webhookSecret, setWebhookSecret] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        await configureAdminGateway(provider, { publicKey, secretKey, webhookSecret });
        setLoading(false);
        onClose();
        alert(`${provider} configuration updated successfully!`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-950 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {provider === 'Stripe' ? <CreditCard className="w-5 h-5 text-blue-500" /> : <span className="text-lg font-bold text-blue-500 italic">P</span>}
                        Connect {provider}
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            {provider === 'Stripe' ? 'Publishable Key' : 'Client ID'}
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                            <input 
                                type="text" 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-blue-500 outline-none font-mono text-sm"
                                placeholder={provider === 'Stripe' ? 'pk_test_...' : 'client_id_...'}
                                value={publicKey}
                                onChange={e => setPublicKey(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            {provider === 'Stripe' ? 'Secret Key' : 'Client Secret'}
                        </label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none font-mono text-sm"
                            placeholder={provider === 'Stripe' ? 'sk_test_...' : 'client_secret_...'}
                            value={secretKey}
                            onChange={e => setSecretKey(e.target.value)}
                            required
                        />
                    </div>
                    {provider === 'Stripe' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Webhook Secret</label>
                            <input 
                                type="password" 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none font-mono text-sm"
                                placeholder="whsec_..."
                                value={webhookSecret}
                                onChange={e => setWebhookSecret(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save & Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SuperAdmin: React.FC = () => {
  const { allUsers, suspendUser, deleteUser, loginAsUser, loadAdminData, transactions, feedbacks, updateFeedbackStatus, currentUser, updateUserProfile, adminGateways, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'finance' | 'analytics' | 'feedback'>('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [configGateway, setConfigGateway] = useState<PaymentProvider | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Admin Profile State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
      if (currentUser) {
          setAdminName(currentUser.name);
          setAdminEmail(currentUser.email);
      }
  }, [currentUser]);

  // Load real data from backend on mount
  useEffect(() => {
      setAdminLoading(true);
      loadAdminData().finally(() => setAdminLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateUserProfile({ name: adminName });
      setIsProfileOpen(false);
  };

  const filteredUsers = userSearch.trim()
    ? allUsers.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.companyName || '').toLowerCase().includes(userSearch.toLowerCase())
      )
    : allUsers;

  const totalMRR = allUsers.reduce((acc, user) => {
    return acc + (user.plan === 'Pro' ? 99 : user.plan === 'Growth' ? 29 : 0);
  }, 0);

  const activeUsers = allUsers.filter(u => u.status === 'Active').length;

  // Analytics Calculations
  const totalReferrals = allUsers.reduce((acc, u) => acc + (u.affiliate?.referrals || 0), 0);
  const totalPoints = allUsers.reduce((acc, u) => acc + (u.gamification?.points || 0), 0);
  const topGamers = [...allUsers].sort((a,b) => (b.gamification?.points || 0) - (a.gamification?.points || 0)).slice(0, 5);
  const topAffiliates = [...allUsers].sort((a,b) => (b.affiliate?.earnings || 0) - (a.affiliate?.earnings || 0)).slice(0, 5);

  const stripeGateway = adminGateways.find(g => g.provider === 'Stripe');
  const paypalGateway = adminGateways.find(g => g.provider === 'PayPal');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      {/* Modals */}
      {configGateway && (
          <GatewayConfigModal 
              provider={configGateway} 
              isOpen={true} 
              onClose={() => setConfigGateway(null)} 
          />
      )}

      {isProfileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-950 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Admin Profile</h3>
                      <button onClick={() => setIsProfileOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
                  </div>
                  <form onSubmit={handleUpdateAdminProfile} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none"
                              value={adminName}
                              onChange={e => setAdminName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email (System)</label>
                          <input 
                              type="email" 
                              disabled
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed"
                              value={adminEmail}
                          />
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                              <Save className="w-4 h-4" /> Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" /> Super Admin
          </h1>
          <p className="text-slate-400">Platform Overview & Tenant Management</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>{currentUser?.name}</span>
           </div>
           <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
              title="Admin Settings"
           >
               <Settings className="w-5 h-5" />
           </button>
           <button
              onClick={() => logout()}
              className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
              title="Sign Out"
           >
               <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['Overview', 'Users', 'Finance', 'Analytics', 'Feedback'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                className={clsx(
                    "px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.toLowerCase() ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                )}
            >
                {tab}
                {tab === 'Feedback' && feedbacks.filter(f => f.status === 'New').length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {feedbacks.filter(f => f.status === 'New').length}
                    </span>
                )}
            </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total MRR</p>
                <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-white">${totalMRR.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" /> +12% vs last month
            </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Users</p>
                <Users className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white">{allUsers.length}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeUsers} Active</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">System Health</p>
                <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-white">99.9%</h3>
            <p className="text-xs text-slate-500 mt-1">All systems operational</p>
            </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" /> User Feedback & Issues
                  </h3>
                  <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> New</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 ml-3"><div className="w-2 h-2 rounded-full bg-slate-600"></div> Resolved</span>
                  </div>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-slate-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                          <tr>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4">User</th>
                              <th className="px-6 py-4">Message</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {feedbacks.map(item => (
                              <tr key={item.id} className={clsx("hover:bg-slate-900/50 transition-colors", item.status === 'New' ? "bg-slate-900/20" : "")}>
                                  <td className="px-6 py-4">
                                      <span className={clsx(
                                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                          item.status === 'New' ? "bg-red-900/30 text-red-400 border border-red-900" : 
                                          item.status === 'Resolved' ? "bg-emerald-900/30 text-emerald-400 border border-emerald-900" :
                                          "bg-slate-800 text-slate-400 border border-slate-700"
                                      )}>
                                          {item.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                          {item.type === 'Bug' ? <Bug className="w-4 h-4 text-red-400" /> : 
                                           item.type === 'Improvement' ? <Lightbulb className="w-4 h-4 text-yellow-400" /> : 
                                           <AlertTriangle className="w-4 h-4 text-orange-400" />}
                                          <span className="text-sm font-medium text-white">{item.type}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="text-sm font-bold text-white">{item.userName}</div>
                                      <div className="text-xs text-slate-500">{item.userEmail}</div>
                                  </td>
                                  <td className="px-6 py-4 max-w-md">
                                      <p className="text-sm text-slate-300 line-clamp-2" title={item.message}>{item.message}</p>
                                  </td>
                                  <td className="px-6 py-4 text-xs text-slate-500">
                                      {new Date(item.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      {item.status !== 'Resolved' && (
                                          <button 
                                              onClick={() => updateFeedbackStatus(item.id, 'Resolved')}
                                              className="bg-slate-800 hover:bg-emerald-900/30 hover:text-emerald-400 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                                          >
                                              <CheckCircle className="w-3 h-3" /> Mark Resolved
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          ))}
                          {feedbacks.length === 0 && (
                              <tr>
                                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                      No feedback received yet.
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
          <div className="space-y-8">
              {/* Gamification Stats */}
              <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" /> Gamification Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Points Awarded</p>
                          <h3 className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</h3>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Avg. Level</p>
                          <h3 className="text-3xl font-bold text-white">2.4</h3>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Badges Unlocked</p>
                          <h3 className="text-3xl font-bold text-white">
                              {allUsers.reduce((acc, u) => acc + (u.gamification?.badges.length || 0), 0)}
                          </h3>
                      </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <h4 className="font-bold text-white mb-4">Top Creators (Leaderboard)</h4>
                      <div className="space-y-4">
                          {topGamers.map((user, i) => (
                              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}>
                                          {i + 1}
                                      </div>
                                      <div>
                                          <p className="font-bold text-white">{user.name}</p>
                                          <p className="text-xs text-slate-500">{user.companyName}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="font-bold text-yellow-400">{user.gamification?.points} XP</p>
                                      <p className="text-xs text-slate-500">Level {user.gamification?.level}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Affiliate Stats */}
              <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> Affiliate Performance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Referrals</p>
                          <h3 className="text-3xl font-bold text-white">{totalReferrals}</h3>
                          <p className="text-xs text-emerald-400 mt-1">Users acquired via referrals</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Commissions Paid</p>
                          <h3 className="text-3xl font-bold text-white">
                              ${allUsers.reduce((acc, u) => acc + (u.affiliate?.earnings || 0), 0).toFixed(2)}
                          </h3>
                      </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <h4 className="font-bold text-white mb-4">Top Affiliates</h4>
                      <div className="space-y-4">
                          {topAffiliates.filter(u => (u.affiliate?.earnings || 0) > 0).map((user, i) => (
                              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-emerald-900/30 p-2 rounded text-emerald-400">
                                          <Award className="w-4 h-4" />
                                      </div>
                                      <div>
                                          <p className="font-bold text-white">{user.name}</p>
                                          <p className="text-xs text-slate-500">Code: {user.affiliate?.code}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="font-bold text-emerald-400">${user.affiliate?.earnings.toFixed(2)}</p>
                                      <p className="text-xs text-slate-500">{user.affiliate?.referrals} Referrals</p>
                                  </div>
                              </div>
                          ))}
                          {topAffiliates.filter(u => (u.affiliate?.earnings || 0) > 0).length === 0 && (
                              <p className="text-slate-500 italic">No affiliate activity yet.</p>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-bold">Tenant Accounts</h3>
            <div className="flex items-center gap-3">
                {adminLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
                <div className="relative w-full md:w-auto">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-full md:w-64"
                    />
                </div>
            </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">User / Company</th>
                        <th className="px-6 py-4">Plan</th>
                        <th className="px-6 py-4">Level / Points</th>
                        <th className="px-6 py-4">Affiliate</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-6 py-4">
                            <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                                {user.companyName && <p className="text-xs text-blue-400">{user.companyName}</p>}
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                user.plan === 'Pro' ? 'bg-purple-900/30 border-purple-800 text-purple-400' :
                                user.plan === 'Growth' ? 'bg-blue-900/30 border-blue-800 text-blue-400' :
                                'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                                {user.plan}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.gamification ? (
                                    <div>
                                        <span className="font-bold text-yellow-500">Lvl {user.gamification.level}</span>
                                        <p className="text-xs text-slate-500">{user.gamification.points} XP</p>
                                    </div>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4">
                                {user.affiliate ? (
                                    <div>
                                        <span className="font-bold text-emerald-400">${user.affiliate.earnings}</span>
                                        <p className="text-xs text-slate-500">{user.affiliate.referrals} Refs</p>
                                    </div>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4">
                            <span className={`flex items-center gap-2 text-xs font-bold ${
                                user.status === 'Active' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {user.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                {user.role !== 'SuperAdmin' && (
                                    <>
                                        <button 
                                        onClick={() => loginAsUser(user.id)}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Login as User"
                                        >
                                        <LogIn className="w-4 h-4" />
                                        </button>
                                        <button 
                                        onClick={() => suspendUser(user.id)}
                                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                                        title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                                        >
                                        <Ban className="w-4 h-4" />
                                        </button>
                                        <button 
                                        onClick={() => deleteUser(user.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Delete User"
                                        >
                                        <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Payment Gateway Config</h3>
                      <div className="space-y-4">
                          <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-600/20 rounded">
                                     <CreditCard className="w-5 h-5 text-blue-500" />
                                  </div>
                                  <div>
                                      <p className="font-bold text-white">Stripe</p>
                                      <div className="flex items-center gap-2">
                                          <p className={clsx("text-xs font-bold", stripeGateway?.connected ? "text-emerald-400" : "text-slate-500")}>
                                              {stripeGateway?.connected ? "Connected" : "Not Configured"}
                                          </p>
                                          {stripeGateway?.lastSynced && (
                                              <span className="text-[10px] text-slate-600">
                                                  Synced: {new Date(stripeGateway.lastSynced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => setConfigGateway('Stripe')}
                                className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-3 py-1.5 rounded transition-all"
                              >
                                  Configure
                              </button>
                          </div>
                          
                          <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-900/20 rounded">
                                     <span className="font-bold text-blue-500 italic text-lg px-1">P</span>
                                  </div>
                                  <div>
                                      <p className="font-bold text-white">PayPal</p>
                                      <div className="flex items-center gap-2">
                                          <p className={clsx("text-xs font-bold", paypalGateway?.connected ? "text-emerald-400" : "text-slate-500")}>
                                              {paypalGateway?.connected ? "Connected" : "Not Configured"}
                                          </p>
                                          {paypalGateway?.lastSynced && (
                                              <span className="text-[10px] text-slate-600">
                                                  Synced: {new Date(paypalGateway.lastSynced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => setConfigGateway('PayPal')}
                                className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-3 py-1.5 rounded transition-all"
                              >
                                  Configure
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Payouts Pending</h3>
                      <div className="flex items-center justify-center h-32 text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                          No pending affiliate payouts.
                      </div>
                  </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-800">
                      <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-900/50">
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-white">{tx.userEmail}</p>
                                        <p className="text-xs text-slate-500">ID: {tx.userId}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300">{tx.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300">{tx.provider}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold">
                                        {tx.amount < 0 ? (
                                            <span className="text-red-400">-${Math.abs(tx.amount).toFixed(2)}</span>
                                        ) : (
                                            <span className="text-emerald-400">+${tx.amount.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={clsx(
                                            "px-2 py-1 rounded text-xs font-bold",
                                            tx.status === 'Succeeded' ? "bg-emerald-900/30 text-emerald-400" :
                                            tx.status === 'Failed' ? "bg-red-900/30 text-red-400" :
                                            "bg-slate-800 text-slate-400"
                                        )}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SuperAdmin;

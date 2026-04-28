import { useState, useEffect } from 'react';
import { BalanceDisplay } from '../features/wallet/BalanceDisplay';
import { TransactionForms } from '../features/transactions/TransactionForms';
import { TransactionHistory } from '../features/reports/TransactionHistory';
import { ProfileSettings } from '../features/wallet/ProfileSettings';
import { api } from '../services/api';
import { LogOut, Bell, Settings, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import logo from '../assets/logo.png';

export const StudentDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'settings'
  const [walletData, setWalletData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ deposits: 0, payments: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const profile = await api.get(`/Wallet/${user.studentId}/profile`);
      const transactions = await api.get(`/Report/${user.studentId}/history`);
      setWalletData(profile);
      setHistory(transactions);
      
      // Calculate personal stats for Requirement 5
      const deposits = transactions.filter(t => t.type === 0).reduce((sum, t) => sum + t.amount, 0);
      const payments = transactions.filter(t => t.type === 1).reduce((sum, t) => sum + t.amount, 0);
      setStats({ deposits, payments });
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.studentId]);

  if (loading) return <div className="flex h-screen items-center justify-center text-primary-red font-bold">Loading Pocket...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl text-neutral-dark ml-2">U-Pocket</span>
            </div>
            
            <div className="hidden md:flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeView === 'dashboard' ? 'bg-white text-primary-red shadow-sm' : 'text-gray-400 hover:text-neutral-dark'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeView === 'settings' ? 'bg-white text-primary-red shadow-sm' : 'text-gray-400 hover:text-neutral-dark'
                }`}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-primary-red transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-red rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-neutral-dark">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.studentId}</p>
              </div>
              <Button onClick={onLogout} variant="ghost" className="p-2 text-gray-400 hover:text-primary-red">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {activeView === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <BalanceDisplay balance={walletData?.balance || 0} name={user.name} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Deposits</p>
                  <p className="text-xl font-black text-green-600">${stats.deposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payments</p>
                  <p className="text-xl font-black text-primary-red">${stats.payments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <TransactionHistory transactions={history} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-lg text-neutral-dark mb-4">Quick Actions</h3>
                <TransactionForms studentId={user.studentId} onTransactionSuccess={fetchData} />
              </div>
              
              <div className="bg-accent-yellow/10 rounded-2xl p-6 border border-accent-yellow/20">
                <h4 className="font-bold text-neutral-dark mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-yellow" /> Security Tip
                </h4>
                <p className="text-sm text-neutral-dark/70 leading-relaxed">
                  Never share your security PIN with anyone. U-Pocket staff will never ask for your credentials.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ProfileSettings user={{...user, ...walletData}} />
          </div>
        )}
      </main>
    </div>
  );
};

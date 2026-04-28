import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import { ShieldCheck, User, Lock, Loader2 } from 'lucide-react';

export const ProfileSettings = ({ user }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post('/Wallet/change-pin', {
        studentId: user.studentId,
        currentPin,
        newPin
      });
      setMessage({ type: 'success', text: response.message });
      setCurrentPin('');
      setNewPin('');
    } catch (err) {
      try {
        const errorData = JSON.parse(err.message);
        setMessage({ type: 'error', text: errorData.detail || errorData.message });
      } catch {
        setMessage({ type: 'error', text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-primary-red" />
        <h3 className="font-bold text-lg text-neutral-dark">Profile Settings</h3>
      </div>

      <Card className="p-6 space-y-8 bg-white shadow-xl border-none">
        {/* User Identity - Read Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <User className="w-3 h-3" /> Student Name
            </label>
            <p className="font-bold text-neutral-dark border-b border-gray-100 pb-2">{user.name}</p>
          </div>
          <div className="space-y-1 opacity-60">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Student ID (Permanent)
            </label>
            <p className="font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
              {user.studentId}
            </p>
          </div>
        </div>

        {/* Change PIN Form */}
        <div className="pt-4 border-t border-gray-50">
          <h4 className="font-bold text-neutral-dark mb-4 flex items-center gap-2">
            <span className="bg-primary-red/10 text-primary-red p-1 rounded-md">
              <Lock className="w-4 h-4" />
            </span>
            Security Credentials
          </h4>
          
          <form onSubmit={handleUpdatePin} className="space-y-4 max-w-md">
            <Input
              label="Current Security PIN"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              required
            />
            <Input
              label="New Security PIN (4 digits)"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
            />

            {message && (
              <div className={`p-3 rounded-lg text-xs font-bold ${
                message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-primary-red border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full shadow-lg shadow-primary-red/10">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </span>
              ) : 'Update Security PIN'}
            </Button>
          </form>
        </div>
      </Card>
      
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <div className="bg-amber-100 p-2 rounded-full h-fit">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Security Note:</strong> Your Student ID is your permanent identification on campus and cannot be changed. Changing your PIN frequently helps protect your wallet balance.
        </p>
      </div>
    </div>
  );
};

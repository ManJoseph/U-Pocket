import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import { AlertCircle, Lock } from 'lucide-react';

export const LoginForm = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      const data = await api.post('/Auth/login', { studentId, pin });
      onLoginSuccess(data);
    } catch (err) {
      try {
        // Try to parse the error message in case it's a stringified JSON object
        const errorData = JSON.parse(err.message);
        if (errorData.message && errorData.detail) {
          setAuthError(errorData);
        } else {
          // If it's JSON but not our format, show it as detail
          setAuthError({ 
            message: 'Authentication Error', 
            detail: errorData.message || JSON.stringify(errorData) 
          });
        }
      } catch {
        // If it's just a plain string (not JSON)
        setAuthError({ 
          message: 'Login Failed', 
          detail: err.message 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Student ID"
          placeholder="e.g. S101"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <Input
          label="Security PIN"
          type="password"
          placeholder="••••"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
      </div>

      {authError && (
        <div className={`p-4 rounded-xl border flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          authError.message === 'Account Blocked' 
            ? 'bg-red-50 border-red-200 text-primary-red' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {authError.message === 'Account Blocked' ? (
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          )}
          <div>
            <p className="font-bold text-sm leading-tight mb-1">{authError.message}</p>
            <p className="text-xs opacity-90 leading-relaxed">{authError.detail}</p>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full py-4 text-base font-bold shadow-lg shadow-primary-red/20" disabled={loading}>
        {loading ? 'Authenticating...' : 'Sign In to U-Pocket'}
      </Button>
    </form>
  );
};

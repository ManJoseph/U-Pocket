import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import { ArrowUpRight, ArrowDownLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';

export const TransactionForms = ({ studentId, onTransactionSuccess }) => {
  const [activeTab, setActiveTab] = useState('pay');
  const [amount, setAmount] = useState('');
  const [targetId, setTargetId] = useState('');
  const [service, setService] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setSuccessData(null);

    // Simulate 4-second banking processing time as requested
    const startTime = Date.now();

    try {
      let endpoint = '';
      let payload = { studentId, amount: parseFloat(amount) };

      if (activeTab === 'pay') {
        endpoint = '/Transaction/pay';
        payload.service = service || 'General Service';
      } else if (activeTab === 'deposit') {
        endpoint = '/Transaction/deposit';
      } else if (activeTab === 'transfer') {
        endpoint = '/Transaction/transfer';
        payload = { fromStudentId: studentId, toStudentId: targetId, amount: parseFloat(amount) };
      }

      const result = await api.post(endpoint, payload);
      
      // Calculate remaining time to ensure a full 4s delay
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 4000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remaining));

      setSuccessData({
        action: activeTab === 'pay' ? 'paid for ' + (service || 'service') : activeTab + 'ed',
        amount: parseFloat(amount),
        message: result.message
      });
      
      setAmount('');
      setTargetId('');
      setService('');
      onTransactionSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary-red animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent-yellow rounded-full animate-ping"></div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-dark">Securing Transaction</h3>
          <p className="text-gray-500 text-sm mt-2">Verifying balance and processing secure payment...</p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary-red h-full animate-progress-fast"></div>
        </div>
      </Card>
    );
  }

  if (successData) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-center space-y-6 border-2 border-green-500 bg-green-50/30 animate-in bounce-in duration-500">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-neutral-dark mb-2 tracking-tight">Congratulations 🎉</h3>
          <p className="text-neutral-dark/80 text-lg">
            You have successfully <span className="font-bold">{successData.action}</span> 
            <br />
            <span className="text-2xl font-black text-green-600">${successData.amount.toFixed(2)}</span>
          </p>
        </div>
        <Button onClick={() => setSuccessData(null)} className="w-full bg-green-600 hover:bg-green-700">
          Done
        </Button>
      </Card>
    );
  }

  const tabs = [
    { id: 'pay', label: 'Pay', icon: ArrowUpRight },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownLeft },
    { id: 'transfer', label: 'Transfer', icon: Send },
  ];

  return (
    <Card className="p-0 overflow-hidden border-none shadow-xl">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMessage({ text: '', type: '' }); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary-white border-b-2 border-primary-red text-primary-red' 
                : 'bg-gray-50 text-gray-500 hover:text-neutral-dark'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleAction} className="p-6 space-y-4">
        <Input
          label="Amount ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {activeTab === 'pay' && (
          <Input
            label="Service / Item"
            placeholder="e.g. Cafeteria, Library"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        )}

        {activeTab === 'transfer' && (
          <Input
            label="Recipient Student ID"
            placeholder="Enter student ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          />
        )}

        {error && (
          <p className="text-sm text-primary-red">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? 'Processing...' : `Confirm ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        </Button>
      </form>
    </Card>
  );
};

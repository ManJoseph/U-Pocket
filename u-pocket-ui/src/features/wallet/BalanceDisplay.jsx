import { Card } from '../../components/Card';
import { Wallet } from 'lucide-react';

export const BalanceDisplay = ({ balance, name }) => {
  return (
    <Card className="bg-gradient-to-br from-primary-red to-[#b02824] text-white border-none">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium">Available Balance</p>
          <h2 className="text-4xl font-bold mt-1">
            ${parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <Wallet className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-8 flex justify-between items-end">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider">Account Holder</p>
          <p className="font-semibold">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs uppercase tracking-wider">Status</p>
          <p className="font-semibold text-accent-yellow">Active</p>
        </div>
      </div>
    </Card>
  );
};

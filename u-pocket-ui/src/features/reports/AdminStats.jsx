import { Card } from '../../components/Card';
import { TrendingUp, CreditCard, Repeat, PieChart } from 'lucide-react';

export const AdminStats = ({ stats, dailySummary }) => {
  if (!stats) return null;

  const statCards = [
    { label: 'Total Deposits', value: stats.totalDeposits, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Total Payments', value: stats.totalPayments, icon: CreditCard, color: 'text-primary-red' },
    { label: 'Total Transfers', value: stats.totalTransfers, icon: Repeat, color: 'text-blue-600' },
    { label: 'System Balance', value: stats.overallBalance, icon: PieChart, color: 'text-neutral-dark' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">{s.label}</p>
              <p className="text-xl font-bold text-neutral-dark">
                ${s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {dailySummary && (
        <Card className="bg-accent-yellow/5 border-accent-yellow/20">
          <h4 className="font-bold text-neutral-dark mb-4">Today's Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Transactions</p>
              <p className="text-lg font-bold">{dailySummary.transactionCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Deposits</p>
              <p className="text-lg font-bold text-green-600">${dailySummary.totalDeposits}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Payments</p>
              <p className="text-lg font-bold text-primary-red">${dailySummary.totalPayments}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Transfers</p>
              <p className="text-lg font-bold text-blue-600">${dailySummary.totalTransfers}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

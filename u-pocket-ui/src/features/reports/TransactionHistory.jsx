import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Send, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const TransactionHistory = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getIcon = (type) => {
    switch (type) {
      case 0: return { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-100' }; // Deposit
      case 1: return { icon: ArrowUpRight, color: 'text-primary-red', bg: 'bg-red-100' };    // Payment
      case 2: return { icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' };         // Transfer
      default: return { icon: Receipt, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getTypeName = (type) => ['Deposit', 'Payment', 'Transfer'][type] || 'Other';

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>No transactions found</p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-neutral-dark flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Transaction History
        </h3>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="space-y-3 min-h-[350px]">
        {currentItems.map((t, index) => {
          const config = getIcon(t.type);
          return (
            <div key={t.id || index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`${config.bg} p-2.5 rounded-lg`}>
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark">{t.description}</p>
                  <p className="text-xs text-gray-500">
                    {getTypeName(t.type)} • {new Date(t.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 0 ? 'text-green-600' : 'text-neutral-dark'}`}>
                  {t.type === 0 ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] uppercase text-gray-400">Successful</p>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <Button 
            variant="ghost" 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === i + 1 ? 'bg-primary-red w-4' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <Button 
            variant="ghost" 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

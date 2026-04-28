import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import { UserCheck, UserX, Unlock, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

export const StudentList = ({ students, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when search/filter changes the students list
  useEffect(() => {
    setCurrentPage(1);
  }, [students.length]);

  const handleToggleLock = async (student, action) => {
    try {
      await api.post(`/Admin/${action}/${student.studentId}`);
      onUpdate();
    } catch (err) {
      alert(`Failed to ${action} account`);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Wallet Balance</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Account Status</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider text-right">Security Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentItems.map((student) => (
              <tr key={student.studentId} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-neutral-dark">{student.name}</p>
                  <p className="text-xs text-gray-400 font-mono tracking-tight">{student.studentId}</p>
                </td>
                <td className="px-6 py-4 font-bold text-lg text-neutral-dark">
                  ${student.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  {student.isLocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-primary-red border border-primary-red/20">
                      <UserX className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-200">
                      <UserCheck className="w-3 h-3" /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    {student.isLocked ? (
                      <Button 
                        onClick={() => handleToggleLock(student, 'unlock')}
                        variant="secondary"
                        className="py-1.5 px-4 text-xs flex items-center gap-2 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Unlock Access
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleToggleLock(student, 'lock')}
                        variant="ghost"
                        className="py-1.5 px-4 text-xs flex items-center gap-2 text-primary-red hover:bg-primary-red hover:text-white border border-primary-red/10 transition-all shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" /> Lock Account
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, students.length)}</span> of <span className="font-bold">{students.length}</span> students
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary-red text-white shadow-md shadow-primary-red/20' 
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                className="p-1.5 h-auto min-w-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="secondary" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="p-1.5 h-auto min-w-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

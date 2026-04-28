import { useState, useEffect } from 'react';
import { StudentList } from '../features/admin/StudentList';
import { AdminStats } from '../features/reports/AdminStats';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { LogOut, RefreshCw, ShieldAlert, Search, UserPlus } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import logo from '../assets/logo.png';

export const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registration form state
  const [regData, setRegData] = useState({ studentId: '', name: '', pin: '', initialBalance: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [studentsData, statsData, summaryData] = await Promise.all([
        api.get('/Admin/students'),
        api.get('/Report/total-stats'),
        api.get('/Report/daily-summary'),
      ]);
      setStudents(studentsData);
      setStats(statsData);
      setDailySummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage(null);
    try {
      await api.post('/Admin/register', {
        ...regData,
        initialBalance: parseFloat(regData.initialBalance || 0)
      });
      setRegMessage({ type: 'success', text: 'Student registered successfully!' });
      setRegData({ studentId: '', name: '', pin: '', initialBalance: '' });
      fetchAdminData();
    } catch (err) {
      setRegMessage({ type: 'error', text: err.message });
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'locked' && student.isLocked) ||
                         (statusFilter === 'unlocked' && !student.isLocked);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex h-screen items-center justify-center text-primary-red font-bold">Accessing Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-neutral-dark text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden border border-gray-600">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2 text-primary-red">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Admin Control Center</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchAdminData} variant="ghost" className="text-gray-400 hover:text-white p-2">
              <RefreshCw className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-gray-700"></div>
            <Button onClick={onLogout} variant="ghost" className="text-gray-400 hover:text-primary-red p-2">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark font-display">System Overview</h2>
              <p className="text-gray-500">Real-time financial status of the campus pocket system</p>
            </div>
          </div>
          <AdminStats stats={stats} dailySummary={dailySummary} />
        </section>

        {/* Registration Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-dark flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary-red" />
              Register New Student
            </h2>
            <p className="text-gray-500">Add a new student to the university digital wallet system</p>
          </div>
          <Card className="bg-white border-none shadow-lg">
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
              <Input
                label="Student ID"
                placeholder="e.g. S103"
                value={regData.studentId}
                onChange={(e) => setRegData({...regData, studentId: e.target.value})}
                required
              />
              <Input
                label="Full Name"
                placeholder="Student Name"
                value={regData.name}
                onChange={(e) => setRegData({...regData, name: e.target.value})}
                required
              />
              <Input
                label="Security PIN (4 digits)"
                type="password"
                maxLength={4}
                placeholder="••••"
                value={regData.pin}
                onChange={(e) => setRegData({...regData, pin: e.target.value})}
                required
              />
              <div className="flex flex-col justify-end">
                <Input
                  label="Initial Balance ($)"
                  type="number"
                  placeholder="0.00"
                  value={regData.initialBalance}
                  onChange={(e) => setRegData({...regData, initialBalance: e.target.value})}
                  required
                />
              </div>
              <div className="lg:col-span-4 flex items-center justify-between pt-2">
                {regMessage && (
                  <p className={`text-sm font-bold ${regMessage.type === 'success' ? 'text-green-600' : 'text-primary-red'}`}>
                    {regMessage.text}
                  </p>
                ) || <span></span>}
                <Button type="submit" disabled={regLoading} className="px-8 shadow-md">
                  {regLoading ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </Card>
        </section>

        <section>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark">Student Management</h2>
              <p className="text-gray-500">Monitor balances and manage account locks</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-primary-red sm:text-sm transition-all shadow-sm"
                  placeholder="Search name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="block w-full sm:w-44 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-red focus:border-primary-red sm:text-sm rounded-xl transition-all shadow-sm bg-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="unlocked">Active Only</option>
                <option value="locked">Locked Only</option>
              </select>
            </div>
          </div>
          
          <Card className="p-0">
            <StudentList students={filteredStudents} onUpdate={fetchAdminData} />
            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No students found matching your criteria.
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
};

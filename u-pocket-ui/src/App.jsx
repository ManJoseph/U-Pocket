import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('upocket_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAdmin(parsed.studentId === 'ADMIN001'); // Simple admin check for demo
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (data) => {
    const userData = {
      studentId: data.studentId,
      name: data.name,
    };
    setUser(userData);
    setIsAdmin(userData.studentId === 'ADMIN001');
    localStorage.setItem('upocket_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('upocket_user');
  };

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={
            user ? (
              isAdmin ? <Navigate to="/admin" /> : <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/admin" 
          element={
            user && isAdmin ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Register from './pages/Register';
import DemoSetup from './pages/DemoSetup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import TraderProfile from './pages/TraderProfile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo-setup" element={<DemoSetup />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/trader/:traderId" element={
          <ProtectedRoute>
            <TraderProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
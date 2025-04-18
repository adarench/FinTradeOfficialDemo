import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import DemoSetup from './pages/DemoSetup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import TraderProfile from './pages/TraderProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/demo-setup" element={<DemoSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/trader/:traderId" element={<TraderProfile />} />
    </Routes>
  );
}

export default App;
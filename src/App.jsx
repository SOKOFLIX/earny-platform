import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase'; 
import { LayoutDashboard, Settings, DollarSign, Crown, LogOut, Rocket } from 'lucide-react';

// Import your page components
import Dashboard from './pages/Dashboard';
import LessonView from './pages/LessonView';
// import LandingPage from './pages/LandingPage';
// import LessonView from './pages/LessonView';
// import ConfirmedSales from './pages/ConfirmedSales';
// import ProfileSettings from './pages/ProfileSettings';
// import PremiumUpsell from './pages/PremiumUpsell';

// Placeholder components (until we write the real code for them)
const LandingPage = () => <div className="p-10 text-white">Landing Page (Will build next)</div>;
const ConfirmedSales = () => <div className="p-10 text-white">Sales Tracker</div>;
const ProfileSettings = () => <div className="p-10 text-white">Profile Settings</div>;
const PremiumUpsell = () => <div className="p-10 text-white">The Earny Way (Premium)</div>;

// --- GLOBAL LAYOUT (Sidebar Only) ---
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#131b2c] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 h-20 flex items-center space-x-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Rocket className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">Earny</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Learning</p>
          <Link to="/dashboard" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold text-sm">Learning Path</span>
          </Link>
          
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mt-8 mb-4">Store Management</p>
          <Link to="/sales" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/sales' ? 'bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <DollarSign className="w-5 h-5" />
            <span className="font-bold text-sm">Confirmed Sales</span>
          </Link>
          <Link to="/premium" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/premium' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-purple-900/20 hover:text-purple-300'}`}>
            <Crown className="w-5 h-5" />
            <span className="font-bold text-sm">The Earny Way</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/settings" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm">Profile Settings</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

// --- APP ROUTER ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // For testing purposes, we will bypass the login screen temporarily 
  // so you can see the new Dashboard design immediately.
  // We will hook the Landing Page back up once we design it!
  const isDev = true; 

  if (isLoading) {
    return <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#1cb0f6]"></div></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(!user && !isDev) ? <LandingPage /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/lesson/:dayId" element={<DashboardLayout><LessonView /></DashboardLayout>} />
        <Route path="/sales" element={<DashboardLayout><ConfirmedSales /></DashboardLayout>} />
        <Route path="/premium" element={<DashboardLayout><PremiumUpsell /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><ProfileSettings /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Play, Pause, CheckCircle2, Circle, LayoutDashboard, 
  Map, Users, ChevronRight, Menu, X, Rocket, ArrowRight, 
  Globe2, ShieldCheck, Zap, MapPin, LogOut
} from 'lucide-react';

// 1. Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeiDPqbf23P2_O6iex-eZZ6752NRoDZbc",
  authDomain: "earny-477d3.firebaseapp.com",
  projectId: "earny-477d3",
  storageBucket: "earny-477d3.firebasestorage.app",
  messagingSenderId: "741319438211",
  appId: "1:741319438211:web:d3144e11f41641532b10b6",
  measurementId: "G-F77PJ7QVSK"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'dropshipping-course-app';

// Course Data Structure
const CURRICULUM = {
  1: {
    day: 1,
    title: "What is Dropshipping?",
    description: "Welcome to Day 1 of our 90-day Masterclass. Today, we break down exactly what dropshipping is, how the cash flows, and set realistic expectations.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
    tasks: [
      { id: "d1_t1", text: "Listen to the daily audio overview" },
      { id: "d1_t2", text: "Join the exclusive Discord community" },
      { id: "d1_t3", text: "Set up a dedicated business Gmail account" }
    ],
    summary: "Dropshipping is an e-commerce model where you sell products without holding inventory. You act as the middleman. A customer buys from your site, you pay the supplier, and the supplier ships it.\n\nThe catch? Competition is high. Your success depends on your marketing, branding, and ability to build trust."
  },
  2: {
    day: 2,
    title: "The Winning Product Formula",
    description: "Today we hunt. Learn the criteria for a product that actually sells in South Africa and globally.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    tasks: [
      { id: "d2_t1", text: "Install product research browser extensions" },
      { id: "d2_t2", text: "Identify 3 potential problem-solving products" }
    ],
    summary: "A winning product solves a problem, has a 'wow' factor, and offers good profit margins."
  }
};

export default function DropCourseApp() {
  const [user, setUser] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [currentDay, setCurrentDay] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // Monitor Auth State (No Auto-Login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Data when user exists
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'tracker');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompletedTasks(docSnap.data().tasks || {});
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  const toggleTask = async (taskId) => {
    if (!user) return;
    const updatedTasks = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updatedTasks);
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'tracker');
      await setDoc(docRef, { tasks: updatedTasks }, { merge: true });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const totalDays = 90;
  const completedDaysCount = Object.keys(CURRICULUM).reduce((count, dayKey) => {
    const day = CURRICULUM[dayKey];
    return day.tasks.every(task => completedTasks[task.id]) ? count + 1 : count;
  }, 0);

  const lesson = CURRICULUM[currentDay];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LANDING PAGE (Unauthenticated)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30">
        {/* Navigation */}
        <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md fixed top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Earny</span>
            </div>
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors rounded-full"
            >
              {isLoggingIn ? "Entering..." : "Student Login"}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center mt-20">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wide mb-8">
              <span className="text-green-400">●</span>
              <span className="text-gray-300">Registration Open for South Africans</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
              The Dropshipping Blueprint <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Built for Mzansi.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              A free, 90-day interactive curriculum that takes you from total beginner to launching a profitable Shopify store. Learn to source globally, integrate local payment gateways like Yoco, and earn in Rands or Dollars.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Start the 90-Day Challenge <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-6">
            <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <Globe2 className="w-8 h-8 text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Sourcing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Learn the exact strategies to source high-quality products from reliable suppliers, shipped directly to your customers without holding any stock.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <MapPin className="w-8 h-8 text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Local Context</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Tailored for South African entrepreneurs. We cover Yoco, PayFast integrations, scaling locally vs internationally, and navigating the ZAR exchange rate.</p>
            </div>
            <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <Zap className="w-8 h-8 text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Daily Execution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">No fluff. Every day unlocks a new lesson with specific action items. Follow along day-by-day to launch your store by Month 2.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/5 py-10 text-center text-gray-600 text-sm">
          <p>© 2026 Earny. Built for South African Entrepreneurs.</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW: DASHBOARD (Authenticated)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex overflow-hidden selection:bg-indigo-500/30">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/10 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-20 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Rocket className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Earny</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 text-white rounded-lg border border-white/5 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium text-sm">90-Day Curriculum</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Map className="w-4 h-4" />
            <span className="font-medium text-sm">My Store Progress</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Users className="w-4 h-4" />
            <span className="font-medium text-sm">Community (Discord)</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/10 bg-[#050505]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-bold text-white">{completedDaysCount}/{totalDays} Days</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${(completedDaysCount / totalDays) * 100}%` }}
            />
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">
              Phase 1: Fundamentals
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
              Live Sync
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Day {lesson.day}
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-6 leading-tight">
                {lesson.title}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
                {lesson.description}
              </p>
            </div>

            {/* Audio Player (Minimalist) */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex items-center gap-6">
              <button 
                onClick={togglePlay}
                className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Audio Overview</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-white" style={{ width: `${audioProgress}%` }} />
                </div>
                <audio ref={audioRef} src={lesson.audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">Lesson Notes</h3>
                <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                  {lesson.summary.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8">
                    <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Pro Tip</h4>
                    <p className="text-sm text-gray-400 m-0">Don't get stuck on finding the perfect product. Action over perfection. The goal of this week is simply to understand the mechanics.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">Action Items</h3>
                <div className="space-y-3">
                  {lesson.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full flex items-start text-left space-x-3 p-4 rounded-xl transition-all duration-200 border
                          ${isDone ? 'bg-white/5 border-white/20 text-gray-500' : 'bg-[#0a0a0a] border-white/10 text-gray-300 hover:border-white/30'}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-gray-600" />}
                        </div>
                        <span className={`text-sm leading-snug ${isDone ? 'line-through decoration-gray-600 opacity-60' : ''}`}>
                          {task.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {currentDay === 1 ? (
                  <button onClick={() => setCurrentDay(2)} className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-200 text-black rounded-xl font-bold transition-colors mt-8">
                    <span>Proceed to Day 2</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={() => setCurrentDay(1)} className="w-full flex items-center justify-center px-6 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-xl font-bold transition-colors mt-8">
                    <span>Back to Day 1</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
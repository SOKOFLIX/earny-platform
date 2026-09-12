import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Play, Pause, CheckCircle2, Circle, LayoutDashboard, 
  Map, Users, Headphones, ChevronRight, Menu, X, Rocket
} from 'lucide-react';

// 1. Initialize Firebase OUTSIDE the component
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
    description: "Welcome to Day 1 of our 90-day Dropshipping Masterclass. Today, we break down exactly what dropshipping is, how the cash flows, and set realistic expectations for the next 3 months.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder audio
    tasks: [
      { id: "d1_t1", text: "Listen to the daily audio overview" },
      { id: "d1_t2", text: "Join the exclusive Discord community" },
      { id: "d1_t3", text: "Set up a dedicated business Gmail account" }
    ],
    summary: `
      Dropshipping is an e-commerce model where you sell products without holding inventory. 
      You act as the middleman. A customer buys from your site, you pay the supplier, and the supplier ships it.
      
      The catch? Competition is high. Your success depends on your marketing, branding, and ability to build trust.
    `
  },
  2: {
    day: 2,
    title: "The Winning Product Formula",
    description: "Today we hunt. Learn the criteria for a product that actually sells in 2026.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    tasks: [
      { id: "d2_t1", text: "Install product research browser extensions" },
      { id: "d2_t2", text: "Identify 3 potential problem-solving products" }
    ],
    summary: 'A winning product solves a problem, has a "wow" factor, and offers good profit margins.'
  }
};

export default function DropCourseApp() {
  // Authentication & Data State
  const [user, setUser] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State
  const [currentDay, setCurrentDay] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // 2. Auth Effect - Must run first
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Data Fetching Effect - Depends on user
  useEffect(() => {
    if (!user) return;

    // Follows Strict Rule 1: /artifacts/{appId}/users/{userId}/{collectionName}
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'tracker');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompletedTasks(docSnap.data().tasks || {});
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Audio Player Logic
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  // Task Logic
  const toggleTask = async (taskId) => {
    if (!user) return;

    const updatedTasks = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId]
    };

    // Optimistic UI update
    setCompletedTasks(updatedTasks);

    // Save to Firebase
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'tracker');
      await setDoc(docRef, { tasks: updatedTasks }, { merge: true });
    } catch (error) {
      console.error("Error saving task:", error);
      // Revert on error could be implemented here
    }
  };

  // Progress Calculation
  const totalDays = 90;
  const completedDaysCount = Object.keys(CURRICULUM).reduce((count, dayKey) => {
    const day = CURRICULUM[dayKey];
    const allTasksCompleted = day.tasks.every(task => completedTasks[task.id]);
    return allTasksCompleted ? count + 1 : count;
  }, 0);

  const lesson = CURRICULUM[currentDay];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              DropCourse
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">90-Day Curriculum</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800/30 hover:text-white rounded-xl transition-colors">
            <Map className="w-5 h-5" />
            <span className="font-medium">My Store Progress</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800/30 hover:text-white rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Community (Discord)</span>
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Overall Progress</span>
            <span className="text-xs font-bold text-indigo-400">{completedDaysCount}/{totalDays} Days</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedDaysCount / totalDays) * 100}%` }}
            />
          </div>
          {user && (
            <p className="mt-4 text-xs text-gray-500 truncate">
              ID: {user.uid}
            </p>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold hidden sm:block text-gray-200">
              Module 1: Fundamentals
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5">
              <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
              <span className="text-xs font-medium text-gray-300">
                {user ? 'Progress Saving Active' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* Lesson Header */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                <span>Day {lesson.day}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                {lesson.title}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
                {lesson.description}
              </p>
            </div>

            {/* Custom Audio Player */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>
                
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-indigo-400">
                      <Headphones className="w-4 h-4" />
                      <span className="text-sm font-semibold uppercase tracking-wider">AI Voice Overview</span>
                    </div>
                    {/* Hidden actual audio element */}
                    <audio 
                      ref={audioRef} 
                      src={lesson.audioUrl} 
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                  
                  {/* Custom Progress Bar */}
                  <div className="h-3 w-full bg-gray-950/50 rounded-full overflow-hidden cursor-pointer relative border border-gray-700/50">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              
              {/* Lesson Text Content */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-semibold text-white border-b border-gray-800 pb-2">Lesson Notes</h3>
                <div className="prose prose-invert prose-indigo max-w-none text-gray-300 leading-relaxed">
                  {lesson.summary.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                  <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 mt-8">
                    <h4 className="text-white font-medium mb-2">Pro Tip:</h4>
                    <p className="text-sm text-gray-400 m-0">Don't get stuck on finding the "perfect" product. Action over perfection. The goal of this week is simply to understand the mechanics.</p>
                  </div>
                </div>
              </div>

              {/* Action Items / Checklist */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white border-b border-gray-800 pb-2">Daily Action Items</h3>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl">
                  <p className="text-sm text-gray-400 mb-4">Complete these tasks to mark Day {lesson.day} as finished.</p>
                  
                  <div className="space-y-3">
                    {lesson.tasks.map((task) => {
                      const isDone = !!completedTasks[task.id];
                      return (
                        <button
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`
                            w-full flex items-start text-left space-x-3 p-3 rounded-xl transition-all duration-200 border
                            ${isDone 
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-gray-300' 
                              : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'}
                          `}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <span className={`text-sm ${isDone ? 'line-through decoration-indigo-500/50 opacity-70' : ''}`}>
                            {task.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next Day Button Placeholder */}
                {currentDay === 1 && (
                  <button 
                    onClick={() => setCurrentDay(2)}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-100 hover:bg-white text-gray-900 rounded-xl font-bold transition-all shadow-lg shadow-white/5 mt-6"
                  >
                    <span>Proceed to Day 2</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                {currentDay === 2 && (
                  <button 
                    onClick={() => setCurrentDay(1)}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all mt-6 border border-gray-700"
                  >
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
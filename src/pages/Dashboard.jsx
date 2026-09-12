import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  BookOpen, 
  Store, 
  MessageSquare, 
  LogOut, 
  ChevronRight, 
  Banknote, 
  User as UserIcon, 
  Crown 
} from "lucide-react";

// Import all your components
import LessonView from "./LessonView";
import ConfirmedSales from "./ConfirmedSales";
import ProfileSettings from "./ProfileSettings";
import PremiumUpsell from "./PremiumUpsell";
import { curriculum } from "../data/curriculum";
// If you extracted StoreSetup into its own file, import it here:
// import StoreSetup from "../components/StoreSetup";

// Quick inline StoreSetup placeholder if you kept it in the same file earlier
const StoreSetup = () => (
  <div className="p-8 md:p-12"><h2 className="text-3xl font-bold">Store Architecture</h2><p className="text-white/60">Store setup component loaded.</p></div>
);

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [completedCount, setCompletedCount] = useState(0);

  const totalTasks = curriculum.reduce((acc, lesson) => acc + lesson.actionItems.length, 0);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "progress", "tracker");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const tasks = docSnap.data().tasks || {};
        const count = Object.values(tasks).filter(Boolean).length;
        setCompletedCount(count);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const NavButton = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors rounded-md ${
        activeTab === id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {activeTab === id && <ChevronRight className="w-3 h-3" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col justify-between shrink-0">
        <div className="overflow-y-auto">
          <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
            <span className="text-xl font-bold tracking-tight">EARNY.</span>
          </div>
          
          <nav className="p-4 space-y-6">
            {/* Core Execution */}
            <div>
              <div className="px-3 mb-2 text-xs font-medium text-white/40 uppercase tracking-widest">Execution</div>
              <div className="space-y-1">
                <NavButton id="curriculum" icon={BookOpen} label="Curriculum" />
                <NavButton id="store" icon={Store} label="Store Architecture" />
              </div>
            </div>

            {/* Growth & Tracking */}
            <div>
              <div className="px-3 mb-2 text-xs font-medium text-white/40 uppercase tracking-widest">Growth</div>
              <div className="space-y-1">
                <NavButton id="sales" icon={Banknote} label="Sales Ledger" />
                <NavButton id="upsell" icon={Crown} label="Inner Circle" />
              </div>
            </div>

            {/* Account & Community */}
            <div>
              <div className="px-3 mb-2 text-xs font-medium text-white/40 uppercase tracking-widest">Account</div>
              <div className="space-y-1">
                <NavButton id="profile" icon={UserIcon} label="Settings" />
                <a 
                  href="https://discord.com" 
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Discord Access</span>
                  </div>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Progress & User Actions */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#0a0a0a]">
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/60 mb-2 font-medium uppercase tracking-widest">
              <span>Completion</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1 bg-white/10 w-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>
          
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {activeTab === "curriculum" && <LessonView user={user} />}
        {activeTab === "store" && <StoreSetup />}
        {activeTab === "sales" && <ConfirmedSales />}
        {activeTab === "upsell" && <PremiumUpsell />}
        {activeTab === "profile" && <ProfileSettings user={user} />}
      </main>
    </div>
  );
}
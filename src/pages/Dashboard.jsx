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
  Crown,
  ShoppingCart, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Lock 
} from "lucide-react";

// Import your components
import LessonView from "./LessonView";
import ConfirmedSales from "./ConfirmedSales";
import ProfileSettings from "./ProfileSettings";
import PremiumUpsell from "./PremiumUpsell";
import { curriculum } from "../data/curriculum.js";

// --- INLINE STORE SETUP COMPONENT ---
const StoreSetup = () => {
  const [setupProgress, setSetupProgress] = useState({
    shopifyLinked: false,
    yocoVerified: false,
    payfastVerified: false,
    cjDropshipping: true, 
    autoDS: false,
    courierGuy: false,
    buffaloLogistics: false,
  });

  const toggleStep = (key) => {
    setSetupProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const StepItem = ({ label, stateKey, isRequired = false }) => {
    const isDone = setupProgress[stateKey];
    return (
      <button 
        onClick={() => toggleStep(stateKey)}
        className="w-full flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors group text-left"
      >
        <div className="flex items-center gap-3">
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : (
            <Circle className="w-4 h-4 text-white/30 group-hover:text-white/50" />
          )}
          <span className={`text-sm ${isDone ? 'text-white/50 line-through' : 'text-white/90'}`}>
            {label}
          </span>
        </div>
        {isRequired && !isDone && (
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1">Required</span>
        )}
      </button>
    );
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-[#0a0a0a] text-xs font-medium text-white/60 uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          <span>Operational Dashboard</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Store Architecture</h2>
        <p className="text-white/60 font-light max-w-2xl text-lg">
          Track your backend infrastructure. Connect your storefront, payment gateways, and logistics partners to prepare for launch.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-white/60" />
            <h3 className="font-semibold tracking-tight">Shopify Core</h3>
          </div>
          <div className="p-2">
            <StepItem label="Create Shopify Partner Account" stateKey="shopifyLinked" isRequired />
            <StepItem label="Connect Custom Domain (.co.za or .com)" stateKey="domainConnected" isRequired />
            <StepItem label="Configure Store Policies (TOS, Refunds)" stateKey="policiesDone" isRequired />
          </div>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-white/60" />
            <h3 className="font-semibold tracking-tight">Payment Gateways (ZAR)</h3>
          </div>
          <div className="p-2">
            <StepItem label="Submit FICA Documents to Yoco" stateKey="yocoVerified" isRequired />
            <StepItem label="Install Yoco Payment Gateway App" stateKey="yocoInstalled" isRequired />
            <StepItem label="Create PayFast Merchant Account" stateKey="payfastVerified" />
          </div>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Package className="w-5 h-5 text-white/60" />
            <h3 className="font-semibold tracking-tight">Sourcing & Fulfillment</h3>
          </div>
          <div className="p-2">
            <StepItem label="Connect CJdropshipping App" stateKey="cjDropshipping" isRequired />
            <StepItem label="Configure AutoDS Automation" stateKey="autoDS" />
          </div>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Truck className="w-5 h-5 text-white/60" />
            <h3 className="font-semibold tracking-tight">Local Logistics (Mzansi)</h3>
          </div>
          <div className="p-2">
            <StepItem label="Register with The Courier Guy (BobGo)" stateKey="courierGuy" />
            <StepItem label="Set up Buffalo Logistics for imports" stateKey="buffaloLogistics" />
          </div>
        </div>
      </div>
    </div>
  );
};
// --- END STORE SETUP COMPONENT ---


export default function Dashboard({ user, profile }) {
  // Logic: If they are a high earner, default their tab to 'upsell', otherwise 'curriculum'
  const isHighEarner = profile?.revenue === "R100,000+";
  const [activeTab, setActiveTab] = useState(isHighEarner ? "upsell" : "curriculum");
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
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Personalized Top Header */}
        <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between shrink-0 bg-[#050505]/80 backdrop-blur-md z-10">
          <div className="flex flex-col justify-center h-full">
            <span className="text-sm font-medium text-white/90">
              Welcome back, {profile?.name?.split(' ')[0] || "Hustler"}.
            </span>
            <span className="text-xs text-white/40 uppercase tracking-widest mt-1">
              {isHighEarner ? "Inner Circle Candidate" : "90-Day Masterclass"}
            </span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "curriculum" && <LessonView user={user} />}
          {activeTab === "store" && <StoreSetup />}
          {activeTab === "sales" && <ConfirmedSales />}
          {activeTab === "upsell" && <PremiumUpsell />}
          {activeTab === "profile" && <ProfileSettings user={user} profile={profile} />}
        </div>
      </main>
    </div>
  );
}
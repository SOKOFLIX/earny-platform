import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  ArrowRight, 
  User, 
  ShoppingCart, 
  TrendingUp, 
  Loader2, 
  MessageSquare, 
  Target, 
  Link as LinkIcon,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    discordHandle: "",
    goal: "",
    hasStore: null,
    revenue: "",
    storeUrl: "",
  });

  const handleNext = () => setStep(step + 1);

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const profileData = {
        ...formData,
        onboardingComplete: true,
        uid: user.uid,
        email: user.email || "guest",
        createdAt: new Date().toISOString()
      };
      
      const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "profile", "data");
      await setDoc(docRef, profileData, { merge: true });
      
      onComplete(profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
    }
  };

  const totalSteps = formData.hasStore ? 5 : 4;
  const progressPercentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      
      {/* Ambient Emerald Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
        
        {/* Top Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <span>Step {step} of {totalSteps}</span>
            <span>{progressPercentage}% Completed</span>
          </div>
          <div className="h-1.5 bg-white/10 w-full overflow-hidden rounded-full">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        </div>

        {/* STEP 1: Identity & Discord */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Student Activation</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Who is stepping in?</h2>
              <p className="text-white/60 font-light text-sm">Configure your student identity and connect your Discord handle for community privileges.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Victor Soko" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Discord Handle</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    value={formData.discordHandle}
                    onChange={(e) => setFormData({...formData, discordHandle: e.target.value})}
                    placeholder="e.g. victor#1234" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!formData.name.trim() || !formData.discordHandle.trim()}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 text-black font-bold rounded-xl w-full hover:bg-emerald-400 transition-all disabled:opacity-40 disabled:bg-white/10 disabled:text-white/40 shadow-lg shadow-emerald-500/10 cursor-pointer mt-4"
            >
              <span>Continue to Objective</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: The Goal */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">What is your primary objective?</h2>
              <p className="text-white/60 font-light text-sm">This helps us customize your daily roadmap milestones.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              {[
                "Replace my 9-5 income with e-commerce", 
                "Build a predictable secondary income stream", 
                "Scale my existing South African brand", 
                "Master high-ticket global dropshipping"
              ].map((goalOption) => (
                <button 
                  key={goalOption}
                  onClick={() => { setFormData({...formData, goal: goalOption}); handleNext(); }}
                  className={`p-4 border rounded-xl transition-all text-left flex items-center justify-between group cursor-pointer ${
                    formData.goal === goalOption 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : 'border-white/10 bg-[#050505] text-white/80 hover:border-emerald-500/40 hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="font-medium text-sm">{goalOption}</span>
                  <Target className="w-4 h-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Experience */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Have you built a Shopify store before?</h2>
              <p className="text-white/60 font-light text-sm">Be honest—we tailor your backend architecture checklist based on your level.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-2">
              <button 
                onClick={() => { setFormData({...formData, hasStore: false}); handleNext(); }} 
                className="p-5 border border-white/10 bg-[#050505] rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-base font-semibold text-white">No, I'm a complete beginner</div>
                  <div className="text-xs text-white/50 mt-1">I need step-by-step guidance from day one.</div>
                </div>
              </button>
              
              <button 
                onClick={() => { setFormData({...formData, hasStore: true}); handleNext(); }}
                className="p-5 border border-white/10 bg-[#050505] rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-base font-semibold text-white">Yes, I have store experience</div>
                  <div className="text-xs text-white/50 mt-1">I have experimented with Shopify or ads before.</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Store Details (Conditional for Store Owners) */}
        {step === 4 && formData.hasStore && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Current Scale & Metrics</h2>
              <p className="text-white/60 font-light text-sm">Where does your business currently stand?</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Store URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="url" 
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                    placeholder="https://yourstore.co.za" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">All-Time Revenue (ZAR)</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {["R0 - R10,000", "R10,000 - R100,000", "R100,000+"].map((tier) => (
                    <button 
                      key={tier}
                      onClick={() => setFormData({...formData, revenue: tier})}
                      className={`p-3.5 border rounded-xl transition-all text-left font-medium text-sm cursor-pointer ${
                        formData.revenue === tier 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' 
                          : 'border-white/10 bg-[#050505] text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!formData.revenue}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 text-black font-bold rounded-xl w-full hover:bg-emerald-400 transition-all disabled:opacity-40 disabled:bg-white/10 disabled:text-white/40 shadow-lg shadow-emerald-500/10 cursor-pointer mt-4"
            >
              <span>Verify Metrics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* FINAL STEP: Confirmation */}
        {((step === 4 && !formData.hasStore) || step === 5) && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400 text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Profile Configured.</h2>
            <p className="text-white/60 font-light text-sm max-w-sm mx-auto leading-relaxed">
              {formData.revenue === "R100,000+" 
                ? "Your revenue metrics qualify you for priority Inner Circle access. Let's scale." 
                : "Your 90-day masterclass architecture is fully unlocked. Time to execute."}
            </p>
            <button 
              onClick={handleComplete}
              disabled={isSaving}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 text-black font-bold rounded-xl w-full hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer mt-6"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <span>Enter Dashboard</span>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
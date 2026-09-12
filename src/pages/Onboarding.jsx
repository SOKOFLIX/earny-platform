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
  CheckCircle2
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

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Emerald Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        <div className="mb-8 flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-widest">
          <span>Step {step} of {totalSteps}</span>
          <div className="h-px bg-emerald-500/20 flex-1 ml-4" />
        </div>

        {/* STEP 1: Identity & Discord */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">Who is stepping in?</h2>
              <p className="text-white/60 font-light text-lg">Let's set up your student profile and community access.</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name (e.g. Victor Soko)" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-base p-4 pl-12 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  autoFocus
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="text" 
                  value={formData.discordHandle}
                  onChange={(e) => setFormData({...formData, discordHandle: e.target.value})}
                  placeholder="Discord Username (e.g. victor#1234)" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-base p-4 pl-12 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!formData.name.trim() || !formData.discordHandle.trim()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-black font-bold w-full hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:bg-white/10 disabled:text-white/40"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: The Goal */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">What is the objective?</h2>
              <p className="text-white/60 font-light text-lg">Define your primary reason for taking this masterclass.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {["Replace my 9-5 income", "Build a secondary income stream", "Scale my existing brand", "Learn high-income digital skills"].map((goalOption) => (
                <button 
                  key={goalOption}
                  onClick={() => { setFormData({...formData, goal: goalOption}); handleNext(); }}
                  className="p-5 border border-white/10 bg-[#0a0a0a] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-center justify-between group"
                >
                  <span className="font-medium">{goalOption}</span>
                  <Target className="w-5 h-5 text-white/20 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Experience */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">Have you built a Shopify store before?</h2>
              <p className="text-white/60 font-light text-lg">We tailor your backend metrics based on this.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setFormData({...formData, hasStore: false}); handleNext(); }} 
                className="p-6 border border-white/10 bg-[#0a0a0a] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-start gap-4"
              >
                <ShoppingCart className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-white">No, I'm a complete beginner</div>
                  <div className="text-sm text-white/50 mt-1">I have never launched a store.</div>
                </div>
              </button>
              <button 
                onClick={() => { setFormData({...formData, hasStore: true}); handleNext(); }}
                className="p-6 border border-white/10 bg-[#0a0a0a] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-start gap-4"
              >
                <TrendingUp className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-white">Yes, I've built one</div>
                  <div className="text-sm text-white/50 mt-1">I have experience with Shopify and dropshipping.</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Store Details (Conditional) */}
        {step === 4 && formData.hasStore && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">Store Metrics</h2>
              <p className="text-white/60 font-light text-lg">Help us understand your current scale.</p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="url" 
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                  placeholder="https://yourstore.co.za" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-base p-4 pl-12 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/60 uppercase tracking-widest">All-Time Revenue (ZAR)</label>
                <div className="grid grid-cols-1 gap-3">
                  {["R0 - R10,000", "R10,000 - R100,000", "R100,000+"].map((tier) => (
                    <button 
                      key={tier}
                      onClick={() => setFormData({...formData, revenue: tier})}
                      className={`p-4 border transition-all text-left font-medium ${formData.revenue === tier ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-[#0a0a0a] text-white/70 hover:bg-white/5 hover:text-white'}`}
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
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-black font-bold w-full hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:bg-white/10 disabled:text-white/40"
            >
              <span>Verify Metrics</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* FINAL STEP: Confirmation */}
        {(step === 4 && !formData.hasStore) || step === 5 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">Profile Configured.</h2>
            <p className="text-white/60 font-light text-lg max-w-md mx-auto">
              {formData.revenue === "R100,000+" 
                ? "Your revenue metrics qualify you for the Inner Circle. Let's scale." 
                : "Your 90-day masterclass is unlocked. It is time to execute."}
            </p>
            <button 
              onClick={handleComplete}
              disabled={isSaving}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-black font-bold w-full hover:bg-emerald-400 transition-all disabled:opacity-50 mt-8"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <span>Enter Dashboard</span>}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ArrowRight, User, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    experience: "",
    hasStore: null,
    revenue: "",
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
      
      // Save to Firestore
      const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "profile", "data");
      await setDoc(docRef, profileData, { merge: true });
      
      onComplete(profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        <div className="mb-8 flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-widest">
          <span>Step {step} of {formData.hasStore ? "4" : "3"}</span>
          <div className="h-px bg-white/20 flex-1 ml-4" />
        </div>

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">What should we call you?</h2>
              <p className="text-white/60 font-light text-lg">Let's set up your student profile.</p>
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name" 
                className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-lg p-4 pl-12 focus:outline-none focus:border-white/40 transition-colors"
                autoFocus
              />
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold w-full hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">Have you built a Shopify store before?</h2>
              <p className="text-white/60 font-light text-lg">Be honest. We need to know where you are starting from.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setFormData({...formData, hasStore: false}); setStep(4); }} // Skip revenue if no
                className="p-6 border border-white/10 bg-[#0a0a0a] hover:bg-white/5 transition-all text-left flex items-start gap-4"
              >
                <ShoppingCart className="w-6 h-6 text-white/50 mt-1 shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-white">No, I'm a complete beginner</div>
                  <div className="text-sm text-white/50 mt-1">I have never launched a store.</div>
                </div>
              </button>
              <button 
                onClick={() => { setFormData({...formData, hasStore: true}); handleNext(); }}
                className="p-6 border border-white/10 bg-[#0a0a0a] hover:bg-white/5 transition-all text-left flex items-start gap-4"
              >
                <TrendingUp className="w-6 h-6 text-white/50 mt-1 shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-white">Yes, I've built one</div>
                  <div className="text-sm text-white/50 mt-1">I have experience with Shopify and dropshipping.</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Revenue (Only if they have built a store) */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">What is your all-time revenue?</h2>
              <p className="text-white/60 font-light text-lg">This determines your placement in the curriculum.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {["R0 - R10,000", "R10,000 - R100,000", "R100,000+"].map((tier) => (
                <button 
                  key={tier}
                  onClick={() => setFormData({...formData, revenue: tier})}
                  className={`p-5 border transition-all text-left font-medium text-lg ${formData.revenue === tier ? 'border-white bg-white/10 text-white' : 'border-white/10 bg-[#0a0a0a] text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <button 
              onClick={handleComplete}
              disabled={!formData.revenue || isSaving}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold w-full hover:bg-gray-200 transition-all disabled:opacity-50 mt-4"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Finalize Profile</span>}
            </button>
          </div>
        )}

        {/* STEP 4: Beginner Completion */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">Profile Configured.</h2>
            <p className="text-white/60 font-light text-lg max-w-md mx-auto">
              Your 90-day masterclass is unlocked. It is time to execute.
            </p>
            <button 
              onClick={handleComplete}
              disabled={isSaving}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold w-full hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Enter Dashboard</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  MessageSquare, 
  Target, 
  TrendingUp,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function ProfileSettings({ user, profile }) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    discordHandle: profile?.discordHandle || "",
    storeUrl: profile?.storeUrl || "",
    goal: profile?.goal || "",
    revenue: profile?.revenue || "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    try {
      const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "profile", "data");
      await setDoc(docRef, formData, { merge: true });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12 pb-24 relative">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <header className="space-y-3 border-b border-white/10 pb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          <span>Student Records</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">Account Settings</h2>
        <p className="text-white/60 font-light text-base max-w-xl">
          Manage your student profile, update your business metrics, and keep your Discord community access synced.
        </p>
      </header>

      <form className="space-y-10 relative z-10" onSubmit={handleSave}>
        
        {/* SECTION 1: Personal Details */}
        <div className="space-y-6 p-8 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl transition-all hover:border-white/20">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center justify-between">
            <span>Personal & Community Identity</span>
            <span className="text-[10px] text-white/40">Secured via Firebase</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="email" 
                  value={user?.email === "guest" ? "Guest Session (Unlinked)" : user?.email}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl text-white/30 text-sm p-4 pl-11 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Discord Username</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={formData.discordHandle}
                  onChange={(e) => setFormData({...formData, discordHandle: e.target.value})}
                  placeholder="username#0000" 
                  className="w-full bg-[#050505] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Business Metrics */}
        <div className="space-y-6 p-8 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl transition-all hover:border-white/20">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-3">
            Business & Revenue Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Shopify Store URL</label>
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
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Primary Objective</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <select 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl text-white text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a goal...</option>
                  <option value="Replace my 9-5 income with e-commerce">Replace my 9-5 income with e-commerce</option>
                  <option value="Build a predictable secondary income stream">Build a predictable secondary income stream</option>
                  <option value="Scale my existing South African brand">Scale my existing South African brand</option>
                  <option value="Master high-ticket global dropshipping">Master high-ticket global dropshipping</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">All-Time Revenue Range (ZAR)</label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <select 
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl text-white text-sm p-4 pl-11 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>No revenue reported yet</option>
                  <option value="R0 - R10,000">R0 - R10,000</option>
                  <option value="R10,000 - R100,000">R10,000 - R100,000</option>
                  <option value="R100,000+">R100,000+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 flex items-center gap-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="group flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-bold text-sm rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
          
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold animate-in fade-in slide-in-from-left-2 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile synced successfully</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
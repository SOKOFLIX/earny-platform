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
  CheckCircle2
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
      await setDoc(docRef, formData, { merge: true }); // Merge ensures we don't overwrite other fields like onboardingComplete
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12 pb-24">
      <header className="space-y-4 border-b border-white/10 pb-8 relative">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Account Settings</h2>
        <p className="text-white/60 font-light text-lg max-w-2xl">
          Manage your student profile, update your business metrics, and keep your Discord access synced.
        </p>
      </header>

      <form className="space-y-10" onSubmit={handleSave}>
        
        {/* SECTION 1: Personal Details */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2">
            Personal & Community
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3.5 pl-11 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="email" 
                  value={user?.email === "guest" ? "Guest Session (Unlinked)" : user?.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 text-white/40 text-sm p-3.5 pl-11 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Discord Username</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={formData.discordHandle}
                  onChange={(e) => setFormData({...formData, discordHandle: e.target.value})}
                  placeholder="username#0000" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3.5 pl-11 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Business Metrics */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2">
            Business Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Shopify Store URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="url" 
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                  placeholder="https://yourstore.co.za" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3.5 pl-11 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Primary Goal</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <select 
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm p-3.5 pl-11 focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Select a goal...</option>
                  <option value="Replace my 9-5 income">Replace my 9-5 income</option>
                  <option value="Build a secondary income stream">Build a secondary income stream</option>
                  <option value="Scale my existing brand">Scale my existing brand</option>
                  <option value="Learn high-income digital skills">Learn high-income digital skills</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">All-Time Revenue Range (ZAR)</label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <select 
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm p-3.5 pl-11 focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
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
        <div className="pt-8 flex items-center gap-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="group flex items-center gap-2 px-8 py-3 bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
          
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
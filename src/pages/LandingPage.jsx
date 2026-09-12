import { useState } from "react";
import { auth } from "../firebase";
import { signInAnonymously, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ArrowRight, Globe, MapPin, Zap, Loader2, ShieldCheck, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null);

  const handleAnonymousLogin = async () => {
    setIsLoggingIn(true);
    setLoginMethod("guest");
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Guest Login failed:", error);
      setIsLoggingIn(false);
      setLoginMethod(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginMethod("google");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login failed:", error);
      setIsLoggingIn(false);
      setLoginMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden text-white font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Ambient Emerald Glow Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full border-b border-white/10 px-8 py-6 flex justify-between items-center z-10 bg-[#050505]/80 backdrop-blur-md sticky top-0">
        <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
          <span>EARNY.</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAnonymousLogin}
            disabled={isLoggingIn}
            className="text-xs font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
            {isLoggingIn && loginMethod === "guest" ? "Authenticating..." : "Guest Access"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Built for South African Entrepreneurs</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.95]">
            The 90-Day <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-emerald-400">
              E-Commerce Masterclass.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Stop watching generic tutorials. Build a high-converting automated brand, master global product sourcing, and earn in ZAR & USD with Shopify, Yoco, and PayFast.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto w-full">
            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto flex-1 group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-70 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isLoggingIn && loginMethod === "google" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign In with Google</span>
                </>
              )}
            </button>

            {/* Guest Access Button */}
            <button 
              onClick={handleAnonymousLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto flex-1 group relative inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/10 bg-[#0a0a0a] text-white font-bold rounded-xl hover:bg-white/5 hover:border-emerald-500/40 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoggingIn && loginMethod === "guest" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entering...</span>
                </>
              ) : (
                <>
                  <span>Guest Access</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modular Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 w-full px-4">
          {[
            { 
              icon: Globe, 
              title: "Global Sourcing Engine", 
              desc: "Direct integration strategies with CJdropshipping and AutoDS for automated fulfillment." 
            },
            { 
              icon: ShieldCheck, 
              title: "Local Payment Gateways", 
              desc: "Seamless integration with Yoco and PayFast for instant ZAR processing and FICA compliance." 
            },
            { 
              icon: Zap, 
              title: "Daily Execution Plan", 
              desc: "Zero fluff. Actionable milestones, daily audio briefings, and live progress tracking." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 border border-white/10 bg-[#0a0a0a] rounded-2xl hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof / Trust Banner */}
        <div className="mt-24 max-w-4xl mx-auto w-full p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.05] via-[#0a0a0a] to-[#0a0a0a] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Mzansi Masterclass Cohort</div>
            <h4 className="text-xl font-bold tracking-tight">Ready to launch your automated storefront?</h4>
          </div>
          <button 
            onClick={handleGoogleLogin}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shrink-0 cursor-pointer"
          >
            Get Instant Access
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-8 text-center text-xs text-white/40">
        <p>© 2026 Earny Platform. Optimized for South African E-Commerce Execution.</p>
      </footer>
    </div>
  );
}
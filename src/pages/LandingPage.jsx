import { useState } from "react";
import { auth } from "../firebase";
import { signInAnonymously, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ArrowRight, Globe, MapPin, Zap, Loader2 } from "lucide-react";

export default function LandingPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null); // Tracks which button is loading

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
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full border-b border-white/10 px-8 py-6 flex justify-between items-center z-10">
        <div className="text-xl font-bold tracking-tight text-white">EARNY.</div>
        <button 
          onClick={handleAnonymousLogin}
          disabled={isLoggingIn}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest"
        >
          {isLoggingIn && loginMethod === "guest" ? "Authenticating..." : "Guest Access"}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/80 uppercase tracking-widest mb-4">
            <MapPin className="w-3 h-3" />
            <span>Built for South Africa</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
            The 90-Day <br />
            <span className="text-white/40">Dropshipping Masterclass.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto font-light leading-relaxed">
            Stop watching tutorials. Start executing. Learn how to source globally and earn in ZAR/USD using Shopify, Yoco, and PayFast. No fluff, just daily action.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-200 transition-all disabled:opacity-70"
            >
              {isLoggingIn && loginMethod === "google" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  {/* Custom minimalist Google 'G' using SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Secondary Anonymous Login */}
            <button 
              onClick={handleAnonymousLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 bg-transparent text-white font-semibold rounded-none hover:bg-white/5 transition-all disabled:opacity-70"
            >
              {isLoggingIn && loginMethod === "guest" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entering...</span>
                </>
              ) : (
                <>
                  <span>Guest Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 pb-20 w-full px-4">
          {[
            { icon: Globe, title: "Global Sourcing", desc: "Find winning products worldwide." },
            { icon: MapPin, title: "Local Context", desc: "Optimized for the Mzansi market." },
            { icon: Zap, title: "Daily Execution", desc: "Step-by-step daily action items." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-colors">
              <feature.icon className="w-6 h-6 text-white/50 mb-4" />
              <h3 className="text-white font-medium mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-[#888888]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
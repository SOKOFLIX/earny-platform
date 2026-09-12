import { useState } from "react";
import { auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { ArrowRight, Globe, MapPin, Zap, Loader2 } from "lucide-react";

export default function LandingPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
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
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest"
        >
          {isLoggingIn ? "Authenticating..." : "Student Login"}
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

          <div className="pt-8">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-200 transition-all disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entering Platform...</span>
                </>
              ) : (
                <>
                  <span>Start the 90-Day Challenge</span>
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
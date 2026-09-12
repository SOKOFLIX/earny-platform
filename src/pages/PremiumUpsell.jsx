import { Crown, CheckCircle2, Zap, ArrowRight, ShieldCheck, Flame } from "lucide-react";

export default function PremiumUpsell() {
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 pb-24 relative overflow-hidden text-white font-sans">
      
      {/* Ambient Emerald Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <header className="space-y-4 border-b border-white/10 pb-8 relative z-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Crown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exclusive Tier</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
          The Inner Circle <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-emerald-400">
            Private Mastermind.
          </span>
        </h2>
        <p className="text-white/60 font-light text-base md:text-lg leading-relaxed">
          Designed for store owners generating R100k+ or founders ready to scale rapidly with private supplier routes, direct ad account sharing, and weekly 1-on-1 strategy calls.
        </p>
      </header>

      {/* Main Pricing & Perk Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-stretch">
        
        {/* Left Col: Perks List */}
        <div className="lg:col-span-2 p-8 md:p-10 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center justify-between">
              <span>What's Included in the Inner Circle</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Direct WhatsApp access to top SA media buyers",
                "Verified private supplier sheets (Fast shipping)",
                "Pre-built high-converting Shopify store themes",
                "Weekly live Q&A strategy and ad breakdown calls",
                "Exclusive FICA & local payment gateway setups",
                "Private Discord channels for high-earning founders"
              ].map((perk, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-[#050505] hover:border-emerald-500/30 transition-all">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-white/90">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/40 pt-4 border-t border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict vetting process. Limited to 50 active South African founders.</span>
          </div>
        </div>

        {/* Right Col: Action Box */}
        <div className="p-8 md:p-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] via-[#0a0a0a] to-[#0a0a0a] shadow-2xl flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Application Tier</div>
            <div className="text-4xl font-extrabold tracking-tight text-white">R 4,950 <span className="text-xs font-normal text-white/40">/ month</span></div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Billed monthly. Cancel anytime with zero lock-in contracts. Includes all base 90-day masterclass modules.
            </p>
          </div>

          <div className="space-y-3">
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-emerald-500 text-black font-bold text-sm rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Apply for Inner Circle</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="text-center">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Instant Telegram / Discord Review</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
import { Crown, TrendingUp, Layers, Globe, Lock, ArrowRight } from "lucide-react";

export default function PremiumUpsell() {
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 pb-24 relative overflow-hidden">
      
      {/* Background glow for premium feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <header className="space-y-4 border-b border-white/10 pb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 text-xs font-medium text-white uppercase tracking-widest">
          <Crown className="w-3 h-3" />
          <span>Application Only</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          The Inner Circle.
        </h2>
        <p className="text-white/60 font-light max-w-2xl text-lg">
          You've made your first sales. You've proven the model works. Now, it's time to transition from a dropshipper to a brand owner. 
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Sales Pitch & Features */}
        <div className="space-y-8">
          <div className="p-6 border border-white/10 bg-[#0a0a0a] flex items-start gap-4">
            <Lock className="w-5 h-5 text-white/40 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold tracking-tight text-white mb-2">Revenue Prerequisite</h3>
              <p className="text-sm text-white/60 font-light">
                This program is exclusively for students who have generated confirmed revenue using the free Earny 90-Day Masterclass. Do not apply if you have not launched your store.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">What you unlock</h3>
            
            {[
              { icon: TrendingUp, title: "Advanced Media Buying", desc: "Scaling Facebook and TikTok ads past R10k/day without breaking profitability." },
              { icon: Layers, title: "Custom Theme Architecture", desc: "Premium, conversion-optimized Shopify development to elevate your brand identity." },
              { icon: Globe, title: "Private Sourcing Agents", desc: "Cut out CJ Dropshipping. Get 5-day shipping lines to Mzansi with custom packaging." }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 border border-white/10 bg-[#0a0a0a] flex items-center justify-center shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold tracking-tight text-white">{feature.title}</h4>
                  <p className="text-sm text-white/60 font-light mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <div className="p-8 border border-white/20 bg-[#0a0a0a] flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Scale to 7 Figures</h3>
            <p className="text-white/60 font-light mb-8">
              Stop competing on price. Start building equity. Submit your store URL and current revenue metrics to apply for 1-on-1 scaling mentorship.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm text-white/60">Status</span>
                <span className="text-sm font-medium">Accepting Applications</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm text-white/60">Format</span>
                <span className="text-sm font-medium">1-on-1 + Private Group</span>
              </div>
            </div>
          </div>
          
          <button className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-200 transition-all">
            <span>Apply for Mentorship</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
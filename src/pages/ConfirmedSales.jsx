import { Banknote, TrendingUp, ShoppingCart, ArrowUpRight } from "lucide-react";

export default function ConfirmedSales() {
  // Placeholder data - would eventually sync with Shopify API/Firestore
  const metrics = [
    { label: "Total Revenue (ZAR)", value: "R 0.00", icon: Banknote },
    { label: "Confirmed Orders", value: "0", icon: ShoppingCart },
    { label: "Average Order Value", value: "R 0.00", icon: TrendingUp },
  ];

  const recentSales = [
    // Empty state for new students
  ];

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Sales Ledger</h2>
        <p className="text-white/60 font-light max-w-2xl text-lg">
          Track your Shopify conversions. Your first sale is the hardest—everything after is just math and scaling.
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-6 border border-white/10 bg-[#0a0a0a] flex flex-col justify-between h-32">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-xs font-semibold uppercase tracking-widest">{metric.label}</span>
              <metric.icon className="w-4 h-4" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-white">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Sales Table / Empty State */}
      <div className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold tracking-tight">Recent Transactions</h3>
          <button className="text-xs font-medium uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
            <span>Sync Shopify</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        
        {recentSales.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-2">
              <ShoppingCart className="w-5 h-5 text-white/40" />
            </div>
            <h4 className="text-lg font-medium text-white">No sales recorded yet</h4>
            <p className="text-sm text-white/50 max-w-sm font-light">
              Keep executing the daily action items. Once your store goes live and traffic starts flowing, your orders will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            {/* Table would go here when data exists */}
          </div>
        )}
      </div>
    </div>
  );
}
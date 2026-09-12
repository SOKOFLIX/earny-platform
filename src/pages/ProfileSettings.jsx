import { User, Mail, Link as LinkIcon, MessageSquare } from "lucide-react";

export default function ProfileSettings({ user }) {
  return (
    <div className="p-8 md:p-12 max-w-3xl mx-auto space-y-12 pb-24">
      <header className="space-y-4 border-b border-white/10 pb-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Account Settings</h2>
        <p className="text-white/60 font-light text-lg">
          Manage your student profile and Discord community link.
        </p>
      </header>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Profile Details */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="e.g. Victor Soko" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3 pl-10 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="email" 
                  defaultValue={user?.email || ""}
                  disabled
                  className="w-full bg-white/5 border border-white/10 text-white/50 text-sm p-3 pl-10 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Platform Links</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Shopify Store URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="url" 
                  placeholder="https://yourstore.co.za" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3 pl-10 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Discord Username</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="username#0000" 
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder-white/30 text-sm p-3 pl-10 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button className="px-8 py-3 bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
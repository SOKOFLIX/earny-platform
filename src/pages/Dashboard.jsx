import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Star, Zap, Flame, Trophy } from 'lucide-react';
// import Lottie from "lottie-react"; 
// import chestAnimation from "../assets/chest.json"; // We will use this later!

export default function Dashboard() {
  // Mock data for the first 10 days of the path
  const currentDay = 4;
  const pathNodes = Array.from({ length: 10 }, (_, i) => {
    const dayNumber = i + 1;
    let state = 'locked';
    if (dayNumber < currentDay) state = 'completed';
    if (dayNumber === currentDay) state = 'active';

    return {
      day: dayNumber,
      state: state,
      isMilestone: dayNumber % 5 === 0, // Every 5th day is a milestone (like a chest)
      // Math to make the path zig-zag left and right
      offsetX: Math.sin(i * 0.8) * 60 
    };
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0b0f19] text-white">
      
      {/* CENTER: The Gamified Path */}
      <div className="flex-1 flex flex-col items-center py-12 px-4 overflow-y-auto relative">
        
        {/* Section Header */}
        <div className="w-full max-w-lg mb-10 bg-[#1cb0f6] rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_0_#1899d6]">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide text-white">Phase 1: Setup</h2>
            <p className="text-[#a5e1fb] font-bold">The Foundations</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl"><Zap className="w-8 h-8 text-white fill-current" /></div>
        </div>

        {/* The Path Container */}
        <div className="relative w-full max-w-md flex flex-col items-center py-10">
          
          {/* Vertical SVG Line connecting nodes */}
          <div className="absolute top-0 bottom-0 left-1/2 -ml-3 w-6 bg-[#2a3042] rounded-full z-0" />

          {/* Render the Nodes */}
          {pathNodes.map((node) => (
            <div 
              key={node.day} 
              className="relative z-10 my-6 flex flex-col items-center justify-center group"
              style={{ transform: `translateX(${node.offsetX}px)` }}
            >
              {/* Active Node "START" Tooltip */}
              {node.state === 'active' && (
                <div className="absolute -top-14 animate-bounce bg-white text-black font-black uppercase tracking-wider text-sm py-2 px-4 rounded-xl shadow-xl after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-ml-2 after:border-t-8 after:border-t-white after:border-x-8 after:border-x-transparent">
                  Start Day {node.day}
                </div>
              )}

              {/* The Node Button */}
              <Link 
                to={node.state !== 'locked' ? `/lesson/${node.day}` : '#'}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all
                  ${node.state === 'completed' ? 'bg-[#58cc02] border-[#58a700] hover:bg-[#46a302]' : ''}
                  ${node.state === 'active' ? 'bg-[#ffc800] border-[#e5b400] scale-110 shadow-[0_0_40px_rgba(255,200,0,0.4)] hover:bg-[#e5b400]' : ''}
                  ${node.state === 'locked' ? 'bg-[#2a3042] border-[#202533] cursor-not-allowed opacity-80' : ''}
                  ${node.isMilestone && node.state === 'locked' ? 'bg-[#845ec2] border-[#6b4ca6]' : ''}
                `}
              >
                {/* Node Icons */}
                {node.state === 'completed' && <Check className="w-10 h-10 text-white" strokeWidth={4} />}
                {node.state === 'active' && <Star className="w-10 h-10 text-white fill-current" />}
                {node.state === 'locked' && !node.isMilestone && <Lock className="w-8 h-8 text-[#4b5563]" strokeWidth={3} />}
                
                {/* Milestone Chest (Placeholder for Lottie) */}
                {node.isMilestone && node.state === 'locked' && (
                  <Trophy className="w-10 h-10 text-white/50" />
                  // Here is where you will put the Lottie animation!
                  // <Lottie animationData={chestAnimation} loop={true} className="w-16 h-16" />
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Stats & Quests (Hidden on mobile) */}
      <div className="hidden lg:flex w-80 flex-col p-6 border-l border-white/10 bg-[#0b0f19]">
        
        {/* User Stats Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-[#ff9600] font-black text-xl">
            <Flame className="w-6 h-6 fill-current" /> <span>4</span>
          </div>
          <div className="flex items-center space-x-2 text-[#58cc02] font-black text-xl">
            <Zap className="w-6 h-6 fill-current" /> <span>120</span>
          </div>
        </div>

        {/* Daily Quests Box */}
        <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-200">Daily Quests</h3>
            <span className="text-[#1cb0f6] text-sm font-bold cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="space-y-4">
            {/* Quest 1 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ffc800]/20 rounded-xl flex justify-center items-center">
                <Star className="w-6 h-6 text-[#ffc800] fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">Find 3 Winning Products</p>
                <div className="h-2.5 w-full bg-[#2a3042] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffc800] w-[30%]" />
                </div>
              </div>
            </div>
            
            {/* Quest 2 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#1cb0f6]/20 rounded-xl flex justify-center items-center">
                <Zap className="w-6 h-6 text-[#1cb0f6] fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">Complete Day 4 Lesson</p>
                <div className="h-2.5 w-full bg-[#2a3042] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1cb0f6] w-[0%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Upsell Teaser */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/30 rounded-2xl p-5">
          <h3 className="font-black text-white mb-2 italic">THE EARNY WAY</h3>
          <p className="text-sm text-indigo-200 mb-4">Ready to scale your store with a dedicated mentor?</p>
          <Link to="/premium" className="block w-full py-2 bg-white text-indigo-900 font-black text-center rounded-xl uppercase tracking-wider text-sm hover:scale-105 transition-transform">
            Unlock Premium
          </Link>
        </div>

      </div>
    </div>
  );
}
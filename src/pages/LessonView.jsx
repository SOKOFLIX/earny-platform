import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Play, Pause, CheckCircle2, Circle, Lightbulb, Volume2, Loader2 } from "lucide-react";
import { curriculum } from "../data/curriculum.js";

// Minimalist Premium Audio Player
const AudioPlayer = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) setProgress((current / duration) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-white/10 bg-[#0a0a0a] w-full max-w-md group hover:border-emerald-500/30 transition-colors">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <button 
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 bg-emerald-500 text-black rounded-none hover:bg-emerald-400 transition-colors shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
      </button>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Volume2 className="w-3 h-3" />
          <span>Daily Briefing</span>
        </div>
        <div className="h-1.5 bg-white/10 w-full overflow-hidden rounded-r-full">
          <div 
            className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default function LessonView({ user }) {
  const [activeDay, setActiveDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const currentLesson = curriculum.find(c => c.day === activeDay) || curriculum[0];

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "progress", "tracker");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCompletedTasks(docSnap.data().tasks || {});
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [user]);

  const handleTaskToggle = async (taskId) => {
    const newState = !completedTasks[taskId];
    const updatedTasks = { ...completedTasks, [taskId]: newState };
    
    setCompletedTasks(updatedTasks);

    try {
      const docRef = doc(db, "artifacts", "earny-platform", "users", user.uid, "progress", "tracker");
      await setDoc(docRef, { tasks: updatedTasks }, { merge: true });
    } catch (error) {
      console.error("Error saving progress:", error);
      setCompletedTasks(completedTasks); // Revert on failure
    }
  };

  return (
    <div className="flex h-full">
      {/* Day Selector Navigation (Inner Sidebar) */}
      <div className="w-64 border-r border-white/10 bg-[#050505] p-6 overflow-y-auto hidden md:block shrink-0">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Curriculum</h3>
        <div className="space-y-1">
          {curriculum.map((lesson) => {
            const isActive = activeDay === lesson.day;
            return (
              <button
                key={lesson.day}
                onClick={() => setActiveDay(lesson.day)}
                className={`w-full text-left px-4 py-3 text-sm transition-all border-l-2 ${
                  isActive 
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium" 
                    : "border-transparent text-white/50 hover:text-white hover:bg-white/[0.02] hover:border-white/20"
                }`}
              >
                Day {lesson.day}: {lesson.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 md:p-12 space-y-12">
          
          {/* Header */}
          <header className="space-y-4">
            <div className="inline-block px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Day {currentLesson.day} of 90
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              {currentLesson.title}
            </h1>
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-2xl">
              {currentLesson.description}
            </p>
          </header>

          {/* Audio Player */}
          <section>
            <AudioPlayer url={currentLesson.audioUrl} title={currentLesson.title} />
          </section>

          {/* Lesson Notes */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold tracking-tight border-b border-white/10 pb-4">
              Lesson Notes
            </h2>
            <div className="space-y-4 text-white/80 font-light leading-relaxed">
              {currentLesson.notes.map((note, idx) => (
                <p key={idx}>{note}</p>
              ))}
            </div>
          </section>

          {/* Premium Pro Tip Callout */}
          <section className="p-6 border border-emerald-500/20 bg-[#0a0a0a] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <div className="flex items-start gap-4 pl-2">
              <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold tracking-tight text-emerald-400 mb-2 uppercase tracking-widest">Pro Tip</h3>
                <p className="text-sm text-white/80 font-light leading-relaxed">{currentLesson.proTip}</p>
              </div>
            </div>
          </section>

          {/* Action Items */}
          <section className="space-y-6 pb-20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold tracking-tight">Daily Action Items</h2>
              {isLoadingProgress && (
                <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Syncing...</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {currentLesson.actionItems.map((item) => {
                const isCompleted = !!completedTasks[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTaskToggle(item.id)}
                    className={`w-full flex items-start gap-4 p-5 border text-left transition-all duration-300 group ${
                      isCompleted 
                        ? "border-emerald-500/30 bg-emerald-500/5 opacity-80" 
                        : "border-white/10 bg-[#0a0a0a] hover:border-emerald-500/50 hover:bg-[#111]"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/30 group-hover:text-emerald-500/50 transition-colors" />
                      )}
                    </div>
                    <span className={`text-sm md:text-base font-light transition-all ${
                      isCompleted ? "line-through text-white/40" : "text-white/90 group-hover:text-white"
                    }`}>
                      {item.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
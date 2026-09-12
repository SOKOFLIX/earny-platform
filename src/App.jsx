import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import { Loader2 } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user has completed onboarding
        try {
          const docRef = doc(db, "artifacts", "earny-platform", "users", currentUser.uid, "profile", "data");
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && docSnap.data().onboardingComplete) {
            setProfile(docSnap.data());
          } else {
            setProfile(null); // Triggers onboarding
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  // SPA Routing Logic
  if (!user) {
    return <LandingPage />;
  }

  if (user && !profile) {
    return <Onboarding user={user} onComplete={(data) => setProfile(data)} />;
  }

  return <Dashboard user={user} profile={profile} />;
}
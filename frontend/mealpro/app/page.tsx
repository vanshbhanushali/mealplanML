"use client";

import { useState, useEffect } from "react";
import FoodScanner from "./components/FoodScanner";
import MealPlanner from "./components/MealPlanner";
import AuthModal from "./components/AuthModal";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // Check if user is already logged in on load
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      {/* Navbar (Absolute Top) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-40">
        <span className="font-bold text-xl tracking-tighter">SMARTMEAL</span>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm hidden md:inline">
              Hello, <span className="text-white font-bold">{user}</span>
            </span>
            <button
              onClick={handleLogout}
              className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-sm font-medium transition-colors"
          >
            <UserIcon size={16} /> Login
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="z-10 text-center space-y-8 px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          SMART MEAL
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-lg">
          AI-Powered Nutrition Tracking & Personalized Meal Planning.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 items-center">
          <FoodScanner />

          {/* Only allow Planning if logged in (Optional Rule) - or just show it */}
          <div className="relative group">
            {!user && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Login to save plans
              </div>
            )}
            <MealPlanner />
          </div>
        </div>
      </div>

      {/* Auth Modal Overlay */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLoginSuccess={(u) => setUser(u)}
        />
      )}
    </main>
  );
}

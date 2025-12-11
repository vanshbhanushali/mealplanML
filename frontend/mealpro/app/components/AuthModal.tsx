"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, X, ArrowRight, Loader2 } from "lucide-react";

export default function AuthModal({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      if (isLogin) {
        // LOGIN FLOW
        const response = await axios.post(
          "http://127.0.0.1:8000/login",
          formData
        );

        // Save Token
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("username", username);

        onLoginSuccess(username);
        onClose();
      } else {
        // REGISTER FLOW
        await axios.post("http://127.0.0.1:8000/register", {
          username,
          password,
          calorie_goal: calorieGoal,
        });

        // Auto-login after register
        setIsLogin(true);
        setError("Account created! Please log in.");
        setLoading(false); // Stop loading to let them see the message
        return;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      if (isLogin) setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Smart Meal"}
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            {isLogin
              ? "Login to access your personalized plans."
              : "Create an account to start tracking."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-zinc-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Calorie Goal (e.g. 2000)"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(Number(e.target.value))}
                    className="w-full bg-black/50 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : isLogin ? (
                "Login"
              ) : (
                "Create Account"
              )}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

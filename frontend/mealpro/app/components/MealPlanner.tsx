"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Utensils,
  Flame,
  X,
  ChevronRight,
  ChefHat,
} from "lucide-react";

export default function MealPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [calories, setCalories] = useState(2000);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      // Talking to your Python Backend
      const response = await axios.post("http://127.0.0.1:8000/generate-plan", {
        target_calories: Number(calories),
      });
      setPlan(response.data.plan);
    } catch (error) {
      console.error("Failed to generate plan", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-full font-bold hover:bg-zinc-700 hover:border-zinc-500 transition-all shadow-lg"
      >
        <Calendar size={20} />
        Generate Weekly Plan
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-zinc-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ChefHat className="text-purple-500" /> AI Meal Architect
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Controls */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full">
            <label className="block text-zinc-400 text-sm mb-2 font-mono">
              DAILY CALORIE TARGET
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-3xl font-bold p-4 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full md:w-auto px-8 py-5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "CALCULATING..." : "GENERATE PLAN"}
            {!loading && <ChevronRight />}
          </button>
        </div>

        {/* Results Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {plan &&
              Object.entries(plan).map(([day, meals]: [string, any], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-purple-500/30 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{day}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-mono ${
                        Math.abs(meals.total_calories - calories) < 100
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {meals.total_calories} kcal
                    </span>
                  </div>

                  <div className="space-y-4">
                    <MealCard type="Breakfast" food={meals.breakfast} />
                    <MealCard type="Lunch" food={meals.lunch} />
                    <MealCard type="Dinner" food={meals.dinner} />
                    {/* Snacks Section */}
                    {meals.snacks && meals.snacks.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <p className="text-zinc-500 text-[10px] uppercase mb-2">
                          Snacks & Extras
                        </p>
                        <div className="space-y-2">
                          {meals.snacks.map((snack: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-xs text-zinc-400"
                            >
                              <span>{snack.name.replace(/_/g, " ")}</span>
                              <span className="font-mono text-zinc-600">
                                {snack.calories}cal
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual food items
function MealCard({ type, food }: { type: string; food: any }) {
  return (
    <div className="bg-black/40 p-3 rounded-lg border border-zinc-800/50">
      <div className="flex items-center justify-between mb-1">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">
          {type}
        </span>
        <Flame size={12} className="text-orange-500" />
      </div>
      <p className="text-zinc-200 font-medium capitalize truncate">
        {food.name.replace(/_/g, " ")}
      </p>
      <div className="flex gap-2 mt-2 text-[10px] text-zinc-500 font-mono">
        <span>{food.calories}cal</span>
        <span>{food.protein}p</span>
        <span>{food.carbs}c</span>
      </div>
    </div>
  );
}

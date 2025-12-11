"use client";

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, CheckCircle, Loader2, ScanLine } from "lucide-react";

export default function FoodScanner() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Function to convert base64 to file for the backend
  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setLoading(true);

      try {
        const file = dataURLtoFile(imageSrc, "meal.jpg");
        const formData = new FormData();
        formData.append("file", file);

        // SEND TO BACKEND
        const response = await axios.post(
          "http://127.0.0.1:8000/analyze-food",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setResult(response.data);
      } catch (error) {
        console.error("Error scanning food:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [webcamRef]);

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
      >
        <Camera size={20} />
        Track Meal (AI)
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h3 className="text-white font-mono text-lg flex items-center gap-2">
            <ScanLine className="text-blue-500" /> AI Vision
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Camera Area */}
        <div className="relative aspect-square bg-black group">
          {!image ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              {/* Scanning Overlay Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 transition-colors pointer-events-none z-10">
                <motion.div
                  className="w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ position: "absolute" }}
                />
              </div>
            </>
          ) : (
            <img
              src={image}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Processing Loading State */}
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <span className="text-blue-400 font-mono text-sm">
                ANALYZING PIXELS...
              </span>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div className="p-6">
          {!result && !loading && !image && (
            <button
              onClick={capture}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              SCAN FOOD
            </button>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <h4 className="text-white font-bold text-lg capitalize">
                    {result.food_detected.replace(/_/g, " ")}
                  </h4>
                  <p className="text-zinc-400 text-xs">Confidence: High</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <span className="block text-zinc-500 text-xs uppercase">
                    Cal
                  </span>
                  <span className="text-white font-mono">
                    {result.nutrition_data?.calories || "--"}
                  </span>
                </div>
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <span className="block text-zinc-500 text-xs uppercase">
                    Prot
                  </span>
                  <span className="text-blue-400 font-mono">
                    {result.nutrition_data?.protein || "--"}
                  </span>
                </div>
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <span className="block text-zinc-500 text-xs uppercase">
                    Carb
                  </span>
                  <span className="text-green-400 font-mono">
                    {result.nutrition_data?.carbs || "--"}
                  </span>
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full mt-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm"
              >
                Scan Again
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

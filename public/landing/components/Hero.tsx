"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleShorten = () => {
    // Redirect to main app with the URL pre-filled
    const appUrl = url 
      ? `http://localhost:3000?url=${encodeURIComponent(url)}`
      : 'http://localhost:3000';
    window.location.href = appUrl;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-6xl lg:text-6xl font-bold tracking-tighter mb-6">
            The Intelligence Layer
            <br />
            <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              for all your Links
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Transform every link into an intelligent gateway. Real-time analytics,
          AI-powered routing, and seamless brand experiences.
        </motion.p>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className={`glass rounded-full p-2 flex items-center gap-2 transition-all duration-300 ${
              isFocused ? "ring-2 ring-brand-purple/50 glow-purple" : ""
            }`}
          >
            <div className="flex items-center pl-4 text-gray-400">
              <Link2 size={20} />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="Paste your long URL here..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-2 py-3"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShorten}
              className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-full hover:bg-brand-purple/90 transition-colors flex items-center gap-2"
            >
              Shorten
              <ArrowRight size={18} />
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500 mt-4"
          >
            No credit card required • Free forever • Cancel anytime
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "10M+", label: "Links Created" },
            { value: "99.9%", label: "Uptime" },
            { value: "150+", label: "Countries" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-purple">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

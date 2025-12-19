"use client";

import { motion } from "framer-motion";

const companies = [
  "CONTACT US TO PUT YOUR BRAND HERE",
  "CONTACT US TO PUT YOUR BRAND HERE",
  "CONTACT US TO PUT YOUR BRAND HERE",
  "CONTACT US TO PUT YOUR BRAND HERE",
  "CONTACT US TO PUT YOUR BRAND HERE",
  "CONTACT US TO PUT YOUR BRAND HERE",
];

export default function SocialProof() {
  return (
    <section className="py-16 px-4 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Trusted by teams at
          </p>
        </motion.div>

        {/* Scrolling Logo Strip */}
        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-scroll">
            {/* First set */}
            {companies.map((company, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 text-2xl font-bold text-gray-600 hover:text-gray-400 transition-colors cursor-pointer tracking-tighter"
              >
                {company}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {companies.map((company, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 text-2xl font-bold text-gray-600 hover:text-gray-400 transition-colors cursor-pointer tracking-tighter"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Add CSS animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 30s linear infinite;
          }

          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}

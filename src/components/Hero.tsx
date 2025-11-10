// src/components/Hero.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="relative py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          AskMyPDF — Chat with your PDFs instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Upload PDFs, search their content and get high-quality AI answers that cite the document.
        </motion.p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard">
            <button className="px-6 py-3 rounded-full bg-indigo-600 text-white shadow-lg">
              Try it free
            </button>
          </Link>

          <Link href="/pricing">
            <button className="px-6 py-3 rounded-full border border-gray-300">
              Pricing
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

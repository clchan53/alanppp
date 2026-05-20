"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center bg-black px-6 text-center text-white overflow-hidden">
      {/* 標題動畫 */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl"
      >
        生活細節。
        <br />
        <span className="text-gray-400">重新定義。</span>
      </motion.h1>

      {/* 副標題動畫 */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl text-lg font-medium tracking-wide text-gray-300 sm:text-xl"
      >
        紀錄日常點滴，分享科技與生活嘅交集。
      </motion.p>

      {/* 三粒大按鈕：數學、英文 與 中文 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex flex-col md:flex-row gap-5 justify-center items-center"
      >
        <Link 
          href="/game"
          className="rounded-full bg-blue-500 px-8 py-4 text-2xl font-bold text-white transition-transform hover:scale-110 inline-block shadow-xl border-4 border-blue-400 w-64 md:w-auto"
        >
          數學挑戰 🍄
        </Link>

        <Link 
          href="/english"
          className="rounded-full bg-orange-500 px-8 py-4 text-2xl font-bold text-white transition-transform hover:scale-110 inline-block shadow-xl border-4 border-orange-400 w-64 md:w-auto"
        >
          英文挑戰 🔤
        </Link>

        <Link 
          href="/chinese"
          className="rounded-full bg-green-600 px-8 py-4 text-2xl font-bold text-white transition-transform hover:scale-110 inline-block shadow-xl border-4 border-green-500 w-64 md:w-auto"
        >
          中文挑戰 📝
        </Link>
      </motion.div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import Link from "next/link"; // 1. 先喺最頂 import 呢個組件

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center bg-black px-6 text-center text-white overflow-hidden">
      {/* 標題動畫：從下方向上滑動並淡入 */}
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

      {/* 副標題動畫：延遲出現 */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl text-lg font-medium tracking-wide text-gray-300 sm:text-xl"
      >
        紀錄日常點滴，分享科技與生活嘅交集。
      </motion.p>

      {/* 按鈕：由 button 改為 Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10"
      >
        <Link 
          href="https://www.google.com" 
          target="_blank" // 呢句係等佢喺新分頁打開，唔會整走你個網
          rel="noopener noreferrer" // 安全性設定，開外鏈必加
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 inline-block"
        >
          閱讀最新文章
        </Link>
      </motion.div>
    </section>
  );
}

{/* 按鈕：連去內部嘅遊戲頁面 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10"
      >
        <Link 
          href="/game" // 改成指向你啱啱整嘅 /game 路徑
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 inline-block"
        >
          開始數學挑戰 🚀
        </Link>
      </motion.div>}
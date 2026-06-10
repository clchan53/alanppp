"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔭 4大科學範疇資料庫
const SCIENCE_DB = {
  life: {
    title: "生命與環境 🐌",
    color: "bg-green-500",
    hover: "hover:bg-green-600",
    border: "border-green-300",
    questions: [
      { q: "這是一隻蝸牛，請觀察一下，牠有沒有殼？", emoji: "🐌", options: ["有殼", "沒有殼"], ans: "有殼" },
      { q: "麻雀是香港常見的動物，牠是生物還是非生物？", emoji: "🐦", options: ["生物", "非生物"], ans: "生物" },
      { q: "玩具車會移動，但它需要入電池。它是生物嗎？", emoji: "🚗", options: ["不是生物", "是生物"], ans: "不是生物" },
      { q: "我們用什麼「感官」來觀察彩虹的顏色？", emoji: "🌈", options: ["眼睛 (視覺)", "耳朵 (聽覺)"], ans: "眼睛 (視覺)" },
      { q: "小狗有生命，牠需要喝水和吃東西嗎？", emoji: "🐶", options: ["需要", "不需要"], ans: "需要" }
    ]
  },
  matter: {
    title: "物質與能量 🧲",
    color: "bg-blue-500",
    hover: "hover:bg-blue-600",
    border: "border-blue-300",
    questions: [
      { q: "我們想看見窗外的風景，窗戶應該是什麼特性的？", emoji: "🪟", options: ["透光", "不透光"], ans: "透光" },
      { q: "不小心打翻了水，用什麼物料抹枱最好？", emoji: "🧻", options: ["吸水紙巾", "防水膠片"], ans: "吸水紙巾" },
      { q: "用力把積木向前「推」，積木的位置會怎樣改變？", emoji: "🧱", options: ["向前移動", "向後移動"], ans: "向前移動" },
      { q: "下雨了，雨傘必須具備什麼特性才能保護我們？", emoji: "☂️", options: ["防水", "吸水"], ans: "防水" },
      { q: "用手摸摸石頭，它的感覺是怎樣的？", emoji: "🪨", options: ["堅硬", "柔軟"], ans: "堅硬" }
    ]
  },
  earth: {
    title: "地球與太空 ⛅",
    color: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    border: "border-yellow-300",
    questions: [
      { q: "今天天上有很多烏雲，還滴着水，這是什麼天氣？", emoji: "🌧️", options: ["雨天", "晴天"], ans: "雨天" },
      { q: "天氣非常炎熱，太陽很猛烈，我們出門應該戴什麼？", emoji: "☀️", options: ["太陽眼鏡", "厚頸巾"], ans: "太陽眼鏡" },
      { q: "樹葉被吹得搖來搖去，風箏也飛得很高，這是什麼天氣？", emoji: "🌬️", options: ["大風", "無風"], ans: "大風" },
      { q: "天氣轉冷了，我們的衣著應該怎樣改變？", emoji: "❄️", options: ["穿厚毛衣", "穿短袖衫"], ans: "穿厚毛衣" },
      { q: "天文台掛了黑色暴雨警告，我們應該去哪裏？", emoji: "⛈️", options: ["留在室內", "去公園玩"], ans: "留在室內" }
    ]
  },
  stem: {
    title: "小小工程師 💡",
    color: "bg-purple-500",
    hover: "hover:bg-purple-600",
    border: "border-purple-300",
    questions: [
      { q: "界定問題：工程師想做一個「有圖案」的燈罩，第一步要怎樣做？", emoji: "📝", options: ["畫設計圖", "隨便亂做"], ans: "畫設計圖" },
      { q: "製作模型：我們應該用什麼工具，在厚卡紙上剪出圖案？", emoji: "✂️", options: ["剪刀", "膠水"], ans: "剪刀" },
      { q: "應用科學：為了讓燈光透出來，燈罩的圖案部分應該貼上什麼物料？", emoji: "🏮", options: ["透光的玻璃紙", "不透光的黑紙"], ans: "透光的玻璃紙" },
      { q: "裝嵌工具：把玻璃紙貼上紙板，需要用到什麼？", emoji: "🧴", options: ["膠水", "放大鏡"], ans: "膠水" },
      { q: "改良設計：如果開燈後發現光線太暗，我們應該怎樣做？", emoji: "🔄", options: ["換更透光的紙", "放棄不做了"], ans: "換更透光的紙" }
    ]
  }
};

type ZoneType = keyof typeof SCIENCE_DB;

export default function ScienceGame() {
  const [activeZone, setActiveZone] = useState<ZoneType | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);

  const playSound = (type: "coin" | "bump" | "success") => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 當進入新題目時自動發聲
  useEffect(() => {
    if (activeZone && !isFinished && feedback === "idle") {
      const currentQ = SCIENCE_DB[activeZone].questions[qIndex];
      setTimeout(() => speak(currentQ.q), 400);
    }
  }, [activeZone, qIndex, isFinished]);

  const handleStartZone = (zone: ZoneType) => {
    setActiveZone(zone);
    setQIndex(0);
    setScore(0);
    setIsFinished(false);
    setFeedback("idle");
  };

  const handleAnswer = (selectedOpt: string) => {
    if (feedback !== "idle" || !activeZone) return;

    const currentQ = SCIENCE_DB[activeZone].questions[qIndex];

    if (selectedOpt === currentQ.ans) {
      playSound("coin");
      setFeedback("correct");
      setScore((s) => s + 1);

      setTimeout(() => {
        if (qIndex + 1 >= SCIENCE_DB[activeZone].questions.length) {
          playSound("success");
          setIsFinished(true);
          speak("恭喜你！完成咗呢個科學任務！");
        } else {
          setQIndex((prev) => prev + 1);
          setFeedback("idle");
        }
      }, 1500);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  // --- 視圖 A：科學大堂 ---
  if (!activeZone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F0FDFA] rounded-3xl p-6 shadow-inner relative select-none">
        <h2 className="text-4xl font-black text-teal-700 mb-8 tracking-wide">小學科學探險島 🔭</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {(Object.keys(SCIENCE_DB) as ZoneType[]).map((key) => {
            const zone = SCIENCE_DB[key];
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartZone(key)}
                className={`py-8 px-6 text-white rounded-3xl border-b-8 shadow-md flex flex-col items-center justify-center gap-3 transition-all ${zone.color} ${zone.hover} ${zone.border}`}
              >
                <span className="text-3xl font-black">{zone.title}</span>
                <span className="text-lg font-bold bg-white/20 px-4 py-1 rounded-full">共 5 題挑戰</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 視圖 B：問答進行中 ---
  const currentZoneData = SCIENCE_DB[activeZone];
  const currentQ = currentZoneData.questions[qIndex];

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#F0FDFA] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none font-sans">
      
      {/* 導航列與計分 */}
      <div className="absolute top-6 left-6 z-10">
        <button onClick={() => { setActiveZone(null); window.speechSynthesis.cancel(); }} className="px-6 py-3 bg-white text-teal-600 font-bold rounded-full shadow-sm border-2 border-teal-200 hover:bg-teal-50">🔙 返回大本營</button>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-teal-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-3xl font-extrabold text-teal-600 font-mono tracking-tighter">{score} / 5</span>
      </div>

      <div className="text-center mb-8 z-10 w-full max-w-3xl mt-20 sm:mt-8">
        <h2 className={`text-2xl font-black mb-4 ${currentZoneData.color.replace('bg-', 'text-')}`}>
          {currentZoneData.title}
        </h2>
        
        {/* 進度條 */}
        {!isFinished && (
          <div className="w-full max-w-sm mx-auto bg-teal-100 rounded-full h-3 mb-8 relative overflow-hidden border border-teal-200">
            <div className={`h-full transition-all duration-300 ${currentZoneData.color}`} style={{ width: `${(qIndex / 5) * 100}%` }} />
          </div>
        )}

        <div className="bg-white border-4 border-teal-300 p-8 rounded-3xl shadow-md mb-8 relative flex flex-col items-center">
          <span className="text-8xl drop-shadow-md mb-6">{currentQ.emoji}</span>
          <p className="text-3xl font-bold text-gray-800 leading-relaxed mb-4">{currentQ.q}</p>
          <button onClick={() => speak(currentQ.q)} className="w-16 h-16 bg-teal-500 text-white rounded-full text-3xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all">🔊</button>
        </div>
      </div>

      {/* 選項區域 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl z-10 px-4">
        {currentQ.options.map((opt, i) => (
          <motion.button
            key={i}
            animate={feedback === "wrong" && opt !== currentQ.ans ? { x: [-10, 10, -10, 10, 0] } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className={`py-8 px-4 bg-white text-3xl font-black rounded-3xl border-b-8 shadow-sm transition-all text-gray-700
              ${activeZone === 'life' ? 'border-green-200 hover:bg-green-50' : 
                activeZone === 'matter' ? 'border-blue-200 hover:bg-blue-50' : 
                activeZone === 'earth' ? 'border-yellow-200 hover:bg-yellow-50' : 
                'border-purple-200 hover:bg-purple-50'}
            `}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* 通關結算畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🎖️</motion.div>
            <h1 className="text-5xl font-black text-teal-600 mb-6">任務大成功！</h1>
            <p className="text-3xl font-extrabold text-orange-500 mb-10">你已經掌握咗 {currentZoneData.title} 嘅知識喇！</p>
            <div className="flex gap-4">
              <button onClick={() => setActiveZone(null)} className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-black rounded-full shadow-md hover:bg-gray-300">返回大本營</button>
              <button onClick={() => handleStartZone(activeZone)} className="px-8 py-4 bg-teal-500 text-white text-xl font-black rounded-full shadow-[0_6px_0_0_#0F766E] hover:bg-teal-600 active:translate-y-1 active:shadow-none">再玩一次 🚀</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute text-9xl z-20 pointer-events-none">✅</motion.div>}
        {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute text-9xl z-20 pointer-events-none">❌</motion.div>}
      </AnimatePresence>
    </div>
  );
}
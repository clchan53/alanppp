"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- 數據庫 ---
// 錢幣資料庫 (價值以「角」作基本單位，避免小數點運算錯誤，10 = $1)
const MONEY_DB = [
  { id: "c10", value: 10, label: "$1", type: "coin", color: "bg-gray-300", border: "border-gray-400", shape: "rounded-full", size: "w-14 h-14", desc: "銀色圓形，好薄" },
  { id: "c20", value: 20, label: "$2", type: "coin", color: "bg-gray-300", border: "border-gray-400", shape: "rounded-[30%] scalloped", size: "w-16 h-16", desc: "銀色，波浪形邊緣 (好似花瓣咁)" },
  { id: "c50", value: 50, label: "$5", type: "coin", color: "bg-gray-300", border: "border-gray-500", shape: "rounded-full border-[6px]", size: "w-16 h-16", desc: "銀色圓形，特別厚身" },
  { id: "c100", value: 100, label: "$10", type: "coin", color: "bg-yellow-500", border: "border-gray-300 border-[6px]", shape: "rounded-full", size: "w-14 h-14", desc: "外圍銀色，中間金色" },
  { id: "n100", value: 100, label: "$10", type: "note", color: "bg-purple-200 text-purple-800", border: "border-purple-400", size: "w-28 h-14", desc: "紫色嘅十蚊紙幣 (花蟹)" },
  { id: "n200", value: 200, label: "$20", type: "note", color: "bg-blue-200 text-blue-800", border: "border-blue-400", size: "w-28 h-14", desc: "藍色嘅二十蚊紙幣" },
  { id: "n500", value: 500, label: "$50", type: "note", color: "bg-green-200 text-green-800", border: "border-green-400", size: "w-28 h-14", desc: "綠色嘅五十蚊紙幣" },
];

const SHOP_ITEMS = [
  { name: "蘋果", basePrice: 50, emoji: "🍎" }, { name: "圖書", basePrice: 280, emoji: "📘" },
  { name: "鉛筆", basePrice: 120, emoji: "✏️" }, { name: "扭蛋", basePrice: 200, emoji: "🥚" },
  { name: "牛奶", basePrice: 80, emoji: "🥛" }, { name: "擦膠", basePrice: 40, emoji: "🧽" },
];

const CHINESE_NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export default function HKMoneyGame() {
  const [activeTab, setActiveTab] = useState<"learn" | "shop" | "quiz">("shop");
  
  // 購物區狀態
  const [currentItem, setCurrentItem] = useState(SHOP_ITEMS[0]);
  const [priceFormat, setPriceFormat] = useState(0); // 0: $X, 1: X元, 2: 中文元
  const [wallet, setWallet] = useState<number[]>([]); // 存放已放入嘅錢 (以角為單位)
  const [shopFeedback, setShopFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  // 文字題狀態
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState(0);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  const playSound = (sound: "coin" | "bump") => {
    try { const audio = new Audio(`/${sound}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK"; utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- 輔助函數 ---
  const toDollars = (cents: number) => cents / 10;
  
  const getChineseNumber = (num: number) => {
    if (num <= 10) return CHINESE_NUMBERS[num];
    if (num < 20) return "十" + (num % 10 === 0 ? "" : CHINESE_NUMBERS[num % 10]);
    return CHINESE_NUMBERS[Math.floor(num / 10)] + "十" + (num % 10 === 0 ? "" : CHINESE_NUMBERS[num % 10]);
  };

  const formatPriceDisplay = (cents: number, formatType: number) => {
    const dollars = toDollars(cents);
    if (formatType === 0) return `$${dollars}`;
    if (formatType === 1) return `${dollars}元`;
    return `${getChineseNumber(dollars)}元`;
  };

  // --- 購物遊戲邏輯 ---
  const generateShopItem = () => {
    const item = SHOP_ITEMS[Math.floor(Math.random() * SHOP_ITEMS.length)];
    setCurrentItem(item);
    setPriceFormat(Math.floor(Math.random() * 3)); // 隨機抽 3 種價錢寫法
    setWallet([]);
    setShopFeedback("idle");
  };

  const addToWallet = (val: number) => {
    if (shopFeedback !== "idle") return;
    playSound("coin");
    setWallet((prev) => [...prev, val]);
  };

  const clearWallet = () => { setWallet([]); playSound("bump"); };

  const checkPayment = () => {
    const totalPaid = wallet.reduce((a, b) => a + b, 0);
    if (totalPaid === currentItem.basePrice) {
      playSound("coin");
      setShopFeedback("correct");
      speak("畀得啱！多謝晒！");
      setTimeout(generateShopItem, 2000);
    } else if (totalPaid > currentItem.basePrice) {
      playSound("bump");
      speak("哎呀，畀多咗喇！");
      setShopFeedback("wrong");
      setTimeout(() => setShopFeedback("idle"), 1500);
    } else {
      playSound("bump");
      speak("仲未夠錢喎！");
      setShopFeedback("wrong");
      setTimeout(() => setShopFeedback("idle"), 1500);
    }
  };

  // --- 文字題邏輯 ---
  const generateQuiz = () => {
    const isAddition = Math.random() > 0.5;
    const val1 = Math.floor(Math.random() * 10) + 1; // $1 - $10
    const val2 = Math.floor(Math.random() * 10) + 1;
    
    let qText = "";
    let ans = 0;

    if (isAddition) {
      qText = `媽媽給你 $${val1} 零用錢，爸爸又給你 $${val2}，你現在總共有多少錢？`;
      ans = val1 + val2;
    } else {
      const max = Math.max(val1, val2) + 5;
      const cost = Math.min(val1, val2);
      qText = `你有 $${max}，買了一件玩具要 $${cost}，找回多少錢？`;
      ans = max - cost;
    }

    setQuizQuestion(qText);
    setQuizAnswer(ans);

    const opts = new Set([ans]);
    while (opts.size < 4) {
      let wrong = ans + Math.floor(Math.random() * 7) - 3;
      if (wrong > 0 && wrong !== ans) opts.add(wrong);
    }
    setQuizOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setQuizFeedback("idle");
  };

  useEffect(() => {
    generateShopItem();
    generateQuiz();
  }, []);

  const handleQuizAnswer = (opt: number) => {
    if (quizFeedback !== "idle") return;
    if (opt === quizAnswer) {
      playSound("coin");
      setQuizFeedback("correct");
      speak("好叻呀，答啱咗！");
      setTimeout(generateQuiz, 1500);
    } else {
      playSound("bump");
      setQuizFeedback("wrong");
      setTimeout(() => setQuizFeedback("idle"), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFFBEB] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden">
      
      {/* 導航列 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button onClick={() => {setActiveTab("learn"); speak("認識錢幣");}} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "learn" ? "bg-yellow-500 text-white shadow-md scale-105" : "bg-white text-yellow-600 border-2 border-yellow-200"}`}>👀 認識錢幣</button>
        <button onClick={() => {setActiveTab("shop"); speak("購物天地");}} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "shop" ? "bg-orange-500 text-white shadow-md scale-105" : "bg-white text-orange-600 border-2 border-orange-200"}`}>🛒 購物天地</button>
        <button onClick={() => {setActiveTab("quiz"); speak("文字題挑戰");}} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "quiz" ? "bg-blue-500 text-white shadow-md scale-105" : "bg-white text-blue-600 border-2 border-blue-200"}`}>🧠 文字題挑戰</button>
      </div>

      {/* 模式一：認識錢幣 */}
      {activeTab === "learn" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-3xl font-black text-yellow-600 mb-6">點擊錢幣聽介紹啦！</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {MONEY_DB.map((money) => (
              <motion.div key={money.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => speak(`${money.label}。${money.desc}`)} className="flex flex-col items-center cursor-pointer">
                {/* 💡 前輩提示：如果要換成真圖片，可以將下面嘅 div 換成：
                  <img src={`/${money.id}.png`} alt={money.label} className="w-20 h-20 object-contain" />
                */}
                <div className={`flex items-center justify-center font-black text-2xl shadow-md border-2 ${money.size} ${money.shape} ${money.color} ${money.border}`}>
                  {money.label}
                </div>
                <span className="mt-3 font-bold text-gray-600">{money.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-yellow-100 rounded-2xl border-4 border-yellow-300 max-w-2xl text-center">
            <p className="text-2xl font-bold text-yellow-800">💡 小知識：<br/>原來 $2 同 $20 紙幣都係代表「二」！波浪邊緣係為咗方便盲人摸得出㗎！</p>
          </div>
        </motion.div>
      )}

      {/* 模式二：購物天地 */}
      {activeTab === "shop" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          
          {/* 商店物品與價錢牌 */}
          <div className="flex items-end justify-center gap-6 mb-8">
            <div className="text-[120px] drop-shadow-xl">{currentItem.emoji}</div>
            <div className="bg-white px-8 py-4 rounded-2xl border-4 border-orange-300 shadow-lg relative -left-4 mb-4">
              <span className="block text-gray-500 font-bold mb-1">{currentItem.name}</span>
              <span className="text-5xl font-black text-orange-600">
                {formatPriceDisplay(currentItem.basePrice, priceFormat)}
              </span>
            </div>
          </div>

          {/* 付款盤 (顯示小朋友放咗幾多錢) */}
          <div className="w-full bg-orange-50 border-4 border-dashed border-orange-300 rounded-3xl p-6 min-h-[150px] flex flex-col items-center relative mb-8">
            <h3 className="text-orange-400 font-bold mb-2 absolute top-2 left-4">🛒 你的付款盤</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <AnimatePresence>
                {wallet.map((val, i) => {
                  const mData = MONEY_DB.find(m => m.value === val);
                  return (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`flex items-center justify-center font-bold text-sm shadow-sm border ${mData?.size} ${mData?.shape} ${mData?.color} ${mData?.border}`}>
                      {mData?.label}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {wallet.length > 0 && (
              <div className="mt-4 text-2xl font-black text-orange-700">
                總共放入：${toDollars(wallet.reduce((a, b) => a + b, 0))}
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-4 mb-8">
            <button onClick={clearWallet} className="px-8 py-3 bg-red-500 text-white font-bold rounded-full text-xl hover:bg-red-400">重新拎過 🔄</button>
            <button onClick={checkPayment} className="px-10 py-3 bg-green-500 text-white font-black rounded-full text-2xl shadow-[0_6px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all">畀錢 💰</button>
          </div>

          {/* 銀包 (選擇硬幣) */}
          <div className="w-full bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 flex flex-wrap justify-center gap-4">
            {MONEY_DB.map((money) => (
              <motion.button key={money.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => addToWallet(money.value)} className={`flex items-center justify-center font-black text-xl shadow-md border-2 ${money.size} ${money.shape} ${money.color} ${money.border}`}>
                {money.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {shopFeedback === "correct" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">🎉</motion.div>}
            {shopFeedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">❌</motion.div>}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 模式三：文字題挑戰 */}
      {activeTab === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl flex flex-col items-center mt-10">
          <div className="bg-white border-4 border-blue-300 p-8 rounded-3xl shadow-lg w-full mb-10 relative">
            <button onClick={() => speak(quizQuestion)} className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500 text-white rounded-full text-3xl flex items-center justify-center shadow-md hover:scale-110 transition-transform">🔊</button>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 leading-relaxed text-center">
              {quizQuestion}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            {quizOptions.map((opt, i) => (
              <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizAnswer(opt)} className="py-6 bg-blue-100 border-b-8 border-blue-400 rounded-2xl text-4xl font-black text-blue-800 shadow-sm">
                ${opt}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {quizFeedback === "correct" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">✅</motion.div>}
            {quizFeedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute inset-0 m-auto w-40 h-40 text-[100px] z-20 flex items-center justify-center">❌</motion.div>}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
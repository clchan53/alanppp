"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- 錢幣數據庫 (基本單位改為「角」，1角=1, 1元=10) ---
const MONEY_DB = [
  { id: "c1", value: 1, label: "1角", type: "coin", color: "bg-amber-700 text-amber-100", border: "border-amber-900", shape: "rounded-full", size: "w-11 h-11 text-xs", desc: "黃銅色細小圓形" },
  { id: "c2", value: 2, label: "2角", type: "coin", color: "bg-amber-700 text-amber-100", border: "border-amber-900", shape: "rounded-[30%] scalloped", size: "w-12 h-12 text-xs", desc: "黃銅色波浪形邊緣" },
  { id: "c5", value: 5, label: "5角", type: "coin", color: "bg-amber-700 text-amber-100", border: "border-amber-900", shape: "rounded-full", size: "w-13 h-13 text-sm", desc: "黃銅色圓形，比1角大" },
  { id: "c10", value: 10, label: "$1", type: "coin", color: "bg-gray-300 text-gray-800", border: "border-gray-400", shape: "rounded-full", size: "w-14 h-14", desc: "銀色圓形" },
  { id: "c20", value: 20, label: "$2", type: "coin", color: "bg-gray-300 text-gray-800", border: "border-gray-400", shape: "rounded-[30%] scalloped", size: "w-16 h-16", desc: "銀色，波浪形邊緣" },
  { id: "c50", value: 50, label: "$5", type: "coin", color: "bg-gray-300 text-gray-800", border: "border-gray-500", shape: "rounded-full border-[4px]", size: "w-16 h-16", desc: "銀色圓形，特別厚身" },
  { id: "c100", value: 100, label: "$10", type: "coin", color: "bg-yellow-500 text-yellow-900", border: "border-gray-300 border-[4px]", shape: "rounded-full", size: "w-15 h-15", desc: "外圍銀色，中間金色" },
  { id: "n100", value: 100, label: "$10", type: "note", color: "bg-purple-200 text-purple-800", border: "border-purple-400", size: "w-28 h-14", desc: "預算十蚊紙幣" },
  { id: "n200", value: 200, label: "$20", type: "note", color: "bg-blue-200 text-blue-800", border: "border-blue-400", size: "w-28 h-14", desc: "藍色二十蚊紙幣" },
  { id: "n500", value: 500, label: "$50", type: "note", color: "bg-green-200 text-green-800", border: "border-green-400", size: "w-28 h-14", desc: "綠色五十蚊紙幣" },
];

// 豐富的商品素材庫，用來動態產生 100 題
const BASE_ITEMS = [
  { name: "糖果", emoji: "🍬" }, { name: "蘋果", emoji: "🍎" }, { name: "鉛筆", emoji: "✏️" },
  { name: "擦膠", emoji: "🧽" }, { name: "牛奶", emoji: "🥛" }, { name: "扭蛋", emoji: "🥚" },
  { name: "雪糕", emoji: "🍦", }, { name: "小汽車", emoji: "🚗" }, { name: "氣球", emoji: "🎈" },
  { name: "圖書", emoji: "📘" }, { name: "果汁", emoji: "🧃" }, { name: "棒棒糖", emoji: "🍭" },
  { name: "香蕉", emoji: "🍌" }, { name: "尺子", emoji: "📏" }, { name: "小熊公仔", emoji: "🧸" },
  { name: "西瓜", emoji: "🍉" }, { name: "蛋糕", emoji: "🍰" }, { name: "薯條", emoji: "🍟" },
  { name: "水杯", emoji: "🥤" }, { name: "麵包", emoji: "🍞" }, { name: "曲奇", emoji: "🍪" }
];

const CHINESE_NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

const PRAISES = [
  "Wow! 你成功通過了100題購物大挑戰！",
  "太厲害了！你現在是超級香港找續大師！🏆",
  "100分！連1角2角都難不倒你，太聰明了！",
  "爸爸媽媽為你感到無比驕傲！大成功！"
];

type ShopQuestion = { name: string; emoji: string; price: number; format: number };

export default function HKMoneyGame() {
  const [activeTab, setActiveTab] = useState<"learn" | "shop" | "quiz">("shop");
  
  // 100題不重覆購物車系統
  const [shopDeck, setShopDeck] = useState<ShopQuestion[]>([]);
  const [shopIndex, setShopIndex] = useState(0);
  const [wallet, setWallet] = useState<number[]>([]); 
  const [shopFeedback, setShopFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isShopFinished, setIsShopFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  // 文字題狀態
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState(0); // 單位：元
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

  // 數字轉繁體中文 (支援元同角)
  const getChineseNumber = (num: number) => {
    if (num <= 10) return CHINESE_NUMBERS[num];
    if (num < 20) return "十" + (num % 10 === 0 ? "" : CHINESE_NUMBERS[num % 10]);
    return CHINESE_NUMBERS[Math.floor(num / 10)] + "十" + (num % 10 === 0 ? "" : CHINESE_NUMBERS[num % 10]);
  };

  // 格式化價格顯示 (12.5 -> $12.5 / 12元5角 / 十二元五角)
  const formatPriceDisplay = (cents: number, formatType: number) => {
    const dollars = Math.floor(cents / 10);
    const remainingCents = cents % 10;

    if (formatType === 0) {
      return remainingCents === 0 ? `$${dollars}` : `$${dollars}.${remainingCents}`;
    }
    if (formatType === 1) {
      return remainingCents === 0 ? `${dollars}元` : `${dollars}元${remainingCents}角`;
    }
    // 中文寫法
    const dollarStr = dollars > 0 ? `${getChineseNumber(dollars)}元` : "";
    const centStr = remainingCents > 0 ? `${getChineseNumber(remainingCents)}角` : "";
    return dollarStr + centStr || "零元";
  };

  // 建立 100 條絕對不重覆、包含 1,2,5 角的隨機購物題目
  const initShopDeck = () => {
    const tempDeck: ShopQuestion[] = [];
    for (let i = 0; i < 100; i++) {
      // 順序循環抽取基礎物品，確保物品豐富均衡
      const base = BASE_ITEMS[i % BASE_ITEMS.length];
      
      // 隨機生成價格：元 (1 至 40 蚊)，角 (0 至 9 角)
      const random元 = Math.floor(Math.random() * 40) + 1;
      // 提高抽中「角」嘅機率，等小朋友多啲機會用到 1角, 2角, 5角
      const random角 = Math.random() > 0.15 ? Math.floor(Math.random() * 9) + 1 : 0; 
      const finalPrice = (random元 * 10) + random角;

      tempDeck.push({
        name: base.name,
        emoji: base.emoji,
        price: finalPrice,
        format: Math.floor(Math.random() * 3) // 隨機決定顯示格式
      });
    }
    setShopDeck(tempDeck);
    setShopIndex(0);
    setIsShopFinished(false);
    setWallet([]);
    setShopFeedback("idle");
  };

  useEffect(() => {
    initShopDeck();
    generateQuiz();
  }, []);

  // --- 購物天地點擊動作 ---
  const addToWallet = (val: number) => {
    if (shopFeedback !== "idle" || isShopFinished) return;
    playSound("coin");
    setWallet((prev) => [...prev, val]);
  };

  const clearWallet = () => { setWallet([]); playSound("bump"); };

  const checkPayment = () => {
    if (shopDeck.length === 0 || isShopFinished) return;
    
    const currentQuestion = shopDeck[shopIndex];
    const totalPaid = wallet.reduce((a, b) => a + b, 0);

    if (totalPaid === currentQuestion.price) {
      playSound("coin");
      setShopFeedback("correct");
      
      // 語音讀出正確答案
      const dollars = Math.floor(currentQuestion.price / 10);
      const remainingCents = currentQuestion.price % 10;
      const ttsText = `答對了！${currentQuestion.name}需要${dollars}元${remainingCents > 0 ? remainingCents + "角" : ""}`;
      speak(ttsText);

      setTimeout(() => {
        // 檢查係咪完成咗 100 題
        if (shopIndex + 1 >= shopDeck.length) {
          const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          setPraiseText(praise);
          setIsShopFinished(true);
          speak(praise);
        } else {
          setShopIndex((prev) => prev + 1);
          setWallet([]);
          setShopFeedback("idle");
        }
      }, 2000);

    } else {
      playSound("bump");
      setShopFeedback("wrong");
      if (totalPaid > currentQuestion.price) {
        speak("哎呀，放多咗錢喇！再數一次部。");
      } else {
        speak("錢仲未夠喎，再加啲散紙啦！");
      }
      setTimeout(() => setShopFeedback("idle"), 1500);
    }
  };

  // --- 文字題邏輯 (元角運算) ---
  const generateQuiz = () => {
    const isAddition = Math.random() > 0.5;
    const val1 = Math.floor(Math.random() * 15) + 1;
    const val2 = Math.floor(Math.random() * 10) + 1;
    
    let qText = "";
    let ans = 0;

    if (isAddition) {
      qText = `小明買文具用了 ${val1} 元，買糖果用了 ${val2} 元，他一共用了多少元？`;
      ans = val1 + val2;
    } else {
      const max = Math.max(val1, val2) + 5;
      const cost = Math.min(val1, val2);
      qText = `姐姐有零用錢 ${max} 元，買一條香蕉用了 ${cost} 元，還剩多少元？`;
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

  const handleQuizAnswer = (opt: number) => {
    if (quizFeedback !== "idle") return;
    if (opt === quizAnswer) {
      playSound("coin");
      setQuizFeedback("correct");
      speak(`好叻仔，答案正是 ${quizAnswer} 元！`);
      setTimeout(generateQuiz, 1800);
    } else {
      playSound("bump");
      setQuizFeedback("wrong");
      setTimeout(() => setQuizFeedback("idle"), 800);
    }
  };

  if (shopDeck.length === 0) return null;
  const currentShopItem = shopDeck[shopIndex];

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFFBEB] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative">
      
      {/* 導航分頁 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 z-10">
        <button onClick={() => {setActiveTab("learn"); speak("認識錢幣");}} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "learn" ? "bg-yellow-500 text-white shadow-md scale-105" : "bg-white text-yellow-600 border-2 border-yellow-200"}`}>👀 認識錢幣</button>
        <button onClick={() => {setActiveTab("shop"); speak("購物天地");}} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "shop" ? "bg-orange-500 text-white shadow-md scale-105" : "bg-white text-orange-600 border-2 border-orange-200"}`}>🛒 購物天地</button>
        <button onClick={() => {setActiveTab("quiz"); speak("文字題挑戰");}} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "quiz" ? "bg-blue-500 text-white shadow-md scale-105" : "bg-white text-blue-600 border-2 border-blue-200"}`}>🧠 文字題挑戰</button>
      </div>

      {/* 模式一：認識錢幣 */}
      {activeTab === "learn" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-2xl font-black text-yellow-600 mb-6 text-center">點擊錢幣聽聽形狀同厚度特徵！</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
            {MONEY_DB.map((money) => (
              <motion.div key={money.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => speak(`${money.label}。${money.desc}`)} className="flex flex-col items-center cursor-pointer p-2 bg-white rounded-2xl shadow-sm border border-yellow-100 min-w-[90px]">
                <div className={`flex items-center justify-center font-black text-lg shadow-inner border ${money.size} ${money.shape} ${money.color} ${money.border}`}>
                  {money.label}
                </div>
                <span className="mt-2 font-bold text-sm text-gray-600">{money.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-yellow-100 rounded-2xl border-2 border-yellow-300 max-w-xl text-center text-lg font-bold text-yellow-800 leading-relaxed">
            💡 錢幣小百科：<br/>香港有黃銅色嘅 1角、2角、5角硬幣。2角同$2硬幣一樣，為咗方便摸得出，都設計成特別嘅波浪形邊緣㗎！
          </div>
        </motion.div>
      )}

      {/* 模式二：購物天地 (全自動100題散紙挑戰) */}
      {activeTab === "shop" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          
          {/* 進度顯示條 */}
          <div className="w-full max-w-md bg-orange-100 rounded-full h-4 mb-6 relative overflow-hidden border border-orange-200 shadow-inner text-center flex items-center justify-center">
            <div className="bg-orange-500 h-full absolute left-0 top-0 transition-all duration-300" style={{ width: `${shopIndex + 1}%` }} />
            <span className="z-10 text-xs font-black text-orange-950">進度：第 {shopIndex + 1} / 100 題</span>
          </div>

          {/* 貨品與多樣化價格牌 */}
          <div className="flex items-center justify-center gap-4 mb-6 bg-white p-4 rounded-3xl shadow-sm border border-orange-100 w-full max-w-md">
            <div className="text-7xl drop-shadow-md">{currentShopItem.emoji}</div>
            <div className="flex flex-col align-left">
              <span className="text-gray-400 font-bold text-sm">請找出正確的散紙：</span>
              <span className="text-4xl font-black text-orange-600">
                {formatPriceDisplay(currentShopItem.price, currentShopItem.format)}
              </span>
            </div>
          </div>

          {/* 付款收銀盤 */}
          <div className="w-full max-w-lg bg-orange-50/60 border-4 border-dashed border-orange-300 rounded-3xl p-5 min-h-[140px] flex flex-col items-center relative mb-6">
            <h3 className="text-orange-400 font-bold text-xs absolute top-2 left-4">📥 你的收銀盤</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <AnimatePresence>
                {wallet.map((val, i) => {
                  const mData = MONEY_DB.find(m => m.value === val);
                  return (
                    <motion.div key={i} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} className={`flex items-center justify-center font-bold text-xs shadow-md border ${mData?.size} ${mData?.shape} ${mData?.color} ${mData?.border}`}>
                      {mData?.label}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {wallet.length > 0 && (
              <div className="mt-4 text-xl font-black text-orange-700">
                盤內金額：{formatPriceDisplay(wallet.reduce((a, b) => a + b, 0), 1)}
              </div>
            )}
          </div>

          {/* 收銀盤操作控制 */}
          <div className="flex gap-4 mb-6">
            <button onClick={clearWallet} className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-full text-md shadow-md hover:bg-red-400 active:translate-y-0.5">清空盤子 🔄</button>
            <button onClick={checkPayment} className="px-10 py-2.5 bg-green-500 text-white font-black rounded-full text-xl shadow-[0_5px_0_0_#156534] active:translate-y-1 active:shadow-none transition-all">確認找數 💰</button>
          </div>

          {/* 小朋友的散紙包 / 銀包 (點擊投入硬幣) */}
          <div className="w-full max-w-xl bg-white rounded-3xl p-5 shadow-md border-2 border-gray-100 flex flex-col gap-3">
            <span className="text-gray-400 font-bold text-xs text-center">👇 點擊下面硬幣或紙幣放進收銀盤：</span>
            
            {/* 硬幣列 (含 1角, 2角, 5角) */}
            <div className="flex flex-wrap justify-center gap-3 items-center">
              {MONEY_DB.filter(m => m.type === "coin").map((money) => (
                <motion.button key={money.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => addToWallet(money.value)} className={`flex items-center justify-center font-black text-sm shadow-md border-2 ${money.size} ${money.shape} ${money.color} ${money.border}`}>
                  {money.label}
                </motion.button>
              ))}
            </div>

            {/* 紙幣列 */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {MONEY_DB.filter(m => m.type === "note").map((money) => (
                <motion.button key={money.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToWallet(money.value)} className={`flex items-center justify-center font-bold text-sm shadow-md border-2 ${money.size} ${money.shape} ${money.color} ${money.border}`}>
                  {money.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 100題通關終極大讚美彈出視窗 */}
          <AnimatePresence>
            {isShopFinished && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🏆</motion.div>
                <h1 className="text-5xl font-black text-orange-600 mb-4">通關大成功！</h1>
                <p className="text-3xl font-extrabold text-teal-600 mb-10 max-w-md leading-relaxed">{praiseText}</p>
                <button onClick={initShopDeck} className="px-10 py-5 bg-orange-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#9A3412] hover:bg-orange-600 active:translate-y-1 active:shadow-none transition-all">再挑戰一輪 🚀</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 即時對錯回饋 */}
          <AnimatePresence>
            {shopFeedback === "correct" && !isShopFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.3 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-32 h-32 text-[90px] z-20 flex items-center justify-center">🎉</motion.div>}
            {shopFeedback === "wrong" && <motion.div initial={{ x: -15 }} animate={{ x: [0, -15, 15, -15, 15, 0] }} className="absolute inset-0 m-auto w-32 h-32 text-[90px] z-20 flex items-center justify-center">❌</motion.div>}
          </AnimatePresence>

        </motion.div>
      )}

      {/* 模式三：文字題挑戰 (文字理解元運算) */}
      {activeTab === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl flex flex-col items-center mt-6">
          <div className="bg-white border-4 border-blue-300 p-6 rounded-3xl shadow-md w-full mb-8 relative">
            <button onClick={() => speak(quizQuestion)} className="absolute -top-5 -right-5 w-14 h-14 bg-blue-500 text-white rounded-full text-2xl flex items-center justify-center shadow-md hover:scale-110 transition-transform">🔊</button>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed text-center p-2">
              {quizQuestion}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {quizOptions.map((opt, i) => (
              <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuizAnswer(opt)} className="py-5 bg-blue-50 border-b-8 border-blue-400 rounded-2xl text-3xl font-black text-blue-800 shadow-sm">
                {opt} 元
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {quizFeedback === "correct" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.3 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-32 h-32 text-[90px] z-20 flex items-center justify-center">✅</motion.div>}
            {quizFeedback === "wrong" && <motion.div initial={{ x: -15 }} animate={{ x: [0, -15, 15, -15, 15, 0] }} className="absolute inset-0 m-auto w-32 h-32 text-[90px] z-20 flex items-center justify-center">❌</motion.div>}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎤 自我介紹拆解大綱 (配對 Emoji 幫助幼兒圖像記憶)
const INTRO_CHUNKS = [
  { id: 1, emoji: "👋👦", text: "大家好！我叫陳爾樂，" },
  { id: 2, emoji: "🖐️🏫", text: "我今年五歲，我讀翠茵小宇宙國際幼稚園 K3 A。" },
  { id: 3, emoji: "👨‍👩‍👧‍👦", text: "我屋企有爸爸，媽媽，妹妹同埋我。" },
  { id: 4, emoji: "📖✏️", text: "我喺學校最鍾意上中文認字增潤班，" },
  { id: 5, emoji: "👩‍🏫🔠", text: "因為彭老師教我好多生字同埋四字詞語，" },
  { id: 6, emoji: "🤐🕊️", text: "例如無可奉告，不翼而飛。" },
  { id: 7, emoji: "🎲🏊", text: "我平時鍾意玩 boardgame 同埋游水。" },
  { id: 8, emoji: "🧑‍🔬🔬", text: "我大個想做科學家，" },
  { id: 9, emoji: "🛠️🤝", text: "我希望可以發明新工具，幫助有需要嘅人，" },
  { id: 10, emoji: "🙇‍♂️🎉", text: "多謝大家。" }
];

export default function SelfIntroGame() {
  const [activeTab, setActiveTab] = useState<"listen" | "puzzle" | "stage">("listen");

  // 聽讀模式狀態
  const [activeChunkId, setActiveChunkId] = useState<number | null>(null);

  // 拼圖模式狀態
  const [puzzlePool, setPuzzlePool] = useState<typeof INTRO_CHUNKS>([]);
  const [puzzleSelected, setPuzzleSelected] = useState<typeof INTRO_CHUNKS>([]);
  const [puzzleError, setPuzzleError] = useState(false);

  // 舞台模式狀態
  const [revealedHint, setRevealedHint] = useState<number | null>(null);

  const playSound = (type: "coin" | "bump" | "success" | "cheer") => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const speak = (text: string, rate: number = 0.8) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK";
      utterance.rate = rate; // 慢速方便跟讀
      window.speechSynthesis.speak(utterance);
    }
  };

  // 初始化拼圖
  const initPuzzle = () => {
    setPuzzlePool([...INTRO_CHUNKS].sort(() => Math.random() - 0.5));
    setPuzzleSelected([]);
    setPuzzleError(false);
  };

  useEffect(() => {
    if (activeTab === "puzzle") initPuzzle();
    window.speechSynthesis.cancel();
  }, [activeTab]);

  // 處理拼圖點擊
  const handlePuzzleClick = (chunk: typeof INTRO_CHUNKS[0]) => {
    const expectedId = puzzleSelected.length + 1;
    if (chunk.id === expectedId) {
      playSound("coin");
      const newSelected = [...puzzleSelected, chunk];
      setPuzzleSelected(newSelected);
      setPuzzlePool(puzzlePool.filter((c) => c.id !== chunk.id));
      speak(chunk.text, 0.9);

      if (newSelected.length === INTRO_CHUNKS.length) {
        setTimeout(() => playSound("success"), 1000);
      }
    } else {
      playSound("bump");
      setPuzzleError(true);
      setTimeout(() => setPuzzleError(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFF1F2] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative">
      
      {/* 導航分頁 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 z-10 w-full">
        <button onClick={() => setActiveTab("listen")} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "listen" ? "bg-rose-500 text-white shadow-md scale-105" : "bg-white text-rose-600 border-2 border-rose-200"}`}>👂 1. 聽讀彩排</button>
        <button onClick={() => setActiveTab("puzzle")} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "puzzle" ? "bg-red-500 text-white shadow-md scale-105" : "bg-white text-red-600 border-2 border-red-200"}`}>🧩 2. 記憶拼圖</button>
        <button onClick={() => setActiveTab("stage")} className={`px-5 py-2.5 rounded-full font-bold text-lg transition-all ${activeTab === "stage" ? "bg-amber-500 text-white shadow-md scale-105" : "bg-white text-amber-600 border-2 border-amber-200"}`}>🌟 3. 終極上台</button>
      </div>

      {/* 模式 1：聽讀彩排 */}
      {activeTab === "listen" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-2xl font-black text-rose-600 mb-6 text-center">點擊句子聽示範，然後自己大聲讀一次！</h2>
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg border-4 border-rose-200 w-full flex flex-col gap-4">
            {INTRO_CHUNKS.map((chunk) => (
              <motion.button
                key={chunk.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveChunkId(chunk.id); speak(chunk.text); }}
                className={`text-left text-2xl sm:text-3xl font-bold p-4 rounded-2xl transition-all flex gap-4 items-center
                  ${activeChunkId === chunk.id ? "bg-rose-100 text-rose-800 border-2 border-rose-300 shadow-sm" : "text-gray-600 hover:bg-gray-50 border-2 border-transparent"}
                `}
              >
                <span className="text-4xl">{chunk.emoji}</span>
                <span className="leading-relaxed">{chunk.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 模式 2：記憶拼圖 */}
      {activeTab === "puzzle" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-2xl font-black text-red-600 mb-4 text-center">請順序點擊句子，拼出完整嘅自我介紹！</h2>
          
          {/* 已拼好的區域 */}
          <div className="w-full bg-red-50 border-4 border-dashed border-red-300 min-h-[250px] p-6 rounded-3xl mb-8 flex flex-wrap gap-3 items-start content-start">
            <AnimatePresence>
              {puzzleSelected.map((chunk) => (
                <motion.div key={chunk.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-red-500 text-white px-5 py-3 rounded-2xl text-xl sm:text-2xl font-bold shadow-md flex items-center gap-2">
                  <span>{chunk.emoji}</span> {chunk.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {puzzleSelected.length === 0 && <span className="text-red-300 font-bold text-xl m-auto">點擊下方句子開始組合...</span>}
          </div>

          {/* 選擇池 */}
          <motion.div animate={puzzleError ? { x: [-10, 10, -10, 10, 0] } : {}} className="flex flex-wrap justify-center gap-4">
            <AnimatePresence mode="popLayout">
              {puzzlePool.map((chunk) => (
                <motion.button
                  key={chunk.id}
                  layoutId={`puzzle-${chunk.id}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePuzzleClick(chunk)}
                  className="bg-white border-b-8 border-red-200 hover:bg-red-50 px-6 py-4 rounded-3xl shadow-sm text-2xl font-bold text-gray-800 flex flex-col items-center gap-2 max-w-[90vw] sm:max-w-[400px]"
                >
                  <span className="text-4xl">{chunk.emoji}</span>
                  <span className="text-center truncate w-full">{chunk.text.substring(0, 8)}...</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {puzzleSelected.length === INTRO_CHUNKS.length && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-8 text-center">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-3xl font-black text-red-600">拼圖成功！記憶力超強！</h3>
              <button onClick={() => setActiveTab("stage")} className="mt-6 px-8 py-4 bg-amber-500 text-white rounded-full text-2xl font-bold shadow-md animate-bounce">挑戰終極上台 🌟</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 模式 3：終極上台 */}
      {activeTab === "stage" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl flex flex-col items-center">
          
          <div className="bg-amber-100 px-8 py-3 rounded-full border-4 border-amber-300 mb-8 shadow-sm text-center">
            <p className="text-xl font-bold text-amber-800">🌟 望住觀眾，挺直腰骨，大聲定定咁講！(唔記得可以篤吓圖案)</p>
          </div>

          {/* 舞台佈景 */}
          <div className="bg-gradient-to-b from-red-800 to-red-900 w-full p-6 sm:p-12 rounded-[40px] shadow-2xl border-8 border-amber-400 relative">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8">
              {INTRO_CHUNKS.map((chunk) => (
                <div key={chunk.id} className="flex flex-col items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRevealedHint(revealedHint === chunk.id ? null : chunk.id)}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full flex items-center justify-center text-5xl sm:text-6xl border-4 border-amber-300/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    {chunk.emoji}
                  </motion.button>
                  
                  {/* 提水字牌 */}
                  <AnimatePresence>
                    {revealedHint === chunk.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute z-20 bg-white p-4 rounded-2xl shadow-xl border-4 border-amber-400 max-w-[250px] text-center"
                        style={{ marginTop: "140px" }}
                      >
                        <p className="text-xl font-bold text-gray-800">{chunk.text}</p>
                        <button onClick={() => { speak(chunk.text); playSound("coin"); }} className="mt-2 w-full py-2 bg-amber-100 text-amber-700 rounded-lg font-bold">🔊 提水</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => playSound("cheer")}
              className="mt-12 mx-auto block px-10 py-4 bg-amber-400 text-red-900 text-2xl font-black rounded-full shadow-[0_6px_0_0_#B45309] hover:bg-amber-300 active:translate-y-1 active:shadow-none transition-all"
            >
              🎉 演講完畢！接受掌聲！
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
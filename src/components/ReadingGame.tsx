"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📚 故事書庫：包含原來的 1 篇，以及新增的 3 篇文章
const STORIES = [
  {
    title: "受傷的小鳥",
    paragraphs: [
      ["一天，欣怡打開窗，發現一隻小鳥躺在窗臺上。", "原來小鳥的翅膀受傷了，飛不起來。"],
      ["欣怡連忙叫媽媽來幫忙。", "媽媽幫小鳥包紮傷口，然後教欣怡餵小鳥吃麵包碎和喝水。", "接下來，在媽媽的指導下，欣怡每天都努力照顧小鳥。"],
      ["幾天後，小鳥康復了，牠在屋子裏飛來飛去。", "欣怡雖然捨不得小鳥，但她知道小鳥一定十分想家。", "欣怡打開窗，小鳥向欣怡和媽媽叫了幾聲，便張開翅膀，飛到藍藍的天空去。"]
    ]
  },
  {
    title: "好孩子",
    paragraphs: [
      ["上星期天，爸爸和弟弟坐巴士去探望外婆。"],
      ["有一個拿着拐杖的老伯伯上車，他彎着腰，一步一步慢慢地走進車廂，車廂裏坐滿了人，有的人在低頭玩手機，有的人在專心看書，有的人在看車窗外的風景。", "沒有人留意到老伯伯需要座位坐。", "弟弟看到後，馬上走上前，扶老伯伯到他的座位坐下。"],
      ["老伯伯坐下，微笑地摸摸弟弟的頭，稱讚他是個好孩子。", "爸爸看見了，也笑着向弟弟豎起大拇指。"]
    ]
  },
  {
    title: "小枕頭",
    paragraphs: [
      ["我有一個小枕頭，那是媽媽親手做給我的。"],
      ["小枕頭看上去非常普通，它正正方方的，像一大塊豆腐。", "輕輕抱着它，你會發現它不像其他枕頭那樣柔軟，反而還有點紮人呢！", "如果用力去抱它，你不僅會聽到「沙沙」的聲音，還會聞到一陣讓人心曠神怡的香味。", "為甚麼這個枕頭這麼奇怪呢？"],
      ["原來，這是媽媽特意用油柑葉做的。", "聽媽媽說，油柑葉有幫助睡眠的作用呢！"],
      ["自從有了它，我每晚都睡得特別香甜。", "這不但是因為油柑葉，還因為媽媽對我的愛與關懷。"]
    ]
  },
  {
    title: "金色的沙灘",
    paragraphs: [
      ["離我家不遠有一個金色的沙灘，我最喜歡去那裏玩。"],
      ["那裏的沙粒又細又軟。", "我喜歡光着腳走在沙灘上。", "這些沙粒可真是調皮呀！", "它們在我的腳底鑽呀鑽，弄得我癢癢的。", "我使勁地踏着它們，它們卻又從我的腳趾縫中溜了出來，怎麼也困不住。"],
      ["走得累了，我就坐在沙灘上，望着白雲自由自在地散步，聽着浪花輕聲地歌唱，聞着微風帶來大海的氣息。"],
      ["有時候，我還會在沙灘上撿貝殼。", "這些貝殼可真多變呀！", "它們有的像角錐，有的像扇子。", "只要把這些大貝殼放在耳邊，就能聽到裏面傳來澎湃的海浪聲呢！"],
      ["我愛那片金色的沙灘！"]
    ]
  }
];

export default function ReadingGame() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  
  const [activeSentence, setActiveSentence] = useState<string | null>(null);
  const [readSentences, setReadSentences] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // 成功音效 (只在完成整篇文章時播放)
  const playSound = (type: "success") => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // 🗣️ 廣東話發聲系統
  const speakSentence = (sentence: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "zh-HK"; 
      utterance.rate = 0.8; // 語速放慢，適合幼兒跟讀
      
      utterance.onstart = () => {
        setActiveSentence(sentence);
      };
      
      utterance.onend = () => {
        setActiveSentence(null);
        // 標記為已讀 (保持安靜無音效)
        setReadSentences((prev) => {
          const newSet = new Set(prev);
          if (!newSet.has(sentence)) {
            setScore(newSet.size + 1);
            newSet.add(sentence);
          }
          return newSet;
        });
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // 計算當前故事的總句數
  const currentStory = selectedStoryIndex !== null ? STORIES[selectedStoryIndex] : null;
  const totalSentences = currentStory 
    ? currentStory.paragraphs.reduce((acc, curr) => acc + curr.length, 0) 
    : 0;

  // 檢查是否完成整篇文章
  useEffect(() => {
    if (totalSentences > 0 && readSentences.size === totalSentences && !isFinished) {
      setTimeout(() => {
        playSound("success");
        setIsFinished(true);
      }, 1000);
    }
  }, [readSentences, totalSentences, isFinished]);

  const handleStartStory = (index: number) => {
    setSelectedStoryIndex(index);
    setReadSentences(new Set());
    setIsFinished(false);
    setScore(0);
    setActiveSentence(null);
    window.speechSynthesis.cancel();
  };

  const resetGame = () => {
    setReadSentences(new Set());
    setIsFinished(false);
    setScore(0);
    window.speechSynthesis.cancel();
    setActiveSentence(null);
  };

  // --- 視圖 A：故事書櫃 (選擇文章) ---
  if (selectedStoryIndex === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#FFFBEB] rounded-3xl p-6 shadow-inner relative select-none">
        <h2 className="text-4xl font-black text-amber-600 mb-2 tracking-wide">故事書櫃 📚</h2>
        <p className="text-lg font-bold text-amber-500 mb-10">請選擇一篇你想讀的文章：</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {STORIES.map((story, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartStory(index)}
              className="py-10 px-6 bg-white rounded-3xl border-b-8 border-amber-300 shadow-md flex flex-col items-center justify-center gap-4 hover:bg-amber-50 transition-all"
            >
              <span className="text-5xl drop-shadow-sm">📖</span>
              <span className="text-3xl font-black text-amber-800">〈{story.title}〉</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- 視圖 B：朗讀文章畫面 ---
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFFBEB] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none font-sans">
      
      {/* 導航列 */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => {
            window.speechSynthesis.cancel();
            setSelectedStoryIndex(null);
          }} 
          className="px-6 py-3 bg-white text-amber-600 font-bold rounded-full shadow-sm border-2 border-amber-200 hover:bg-amber-50 transition-colors"
        >
          🔙 返回書櫃
        </button>
      </div>

      {/* 右上角星星進度 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-amber-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-3xl font-extrabold text-amber-600 font-mono tracking-tighter">
          {score} / {totalSentences}
        </span>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mt-24 sm:mt-8 z-10">
        
        {/* 遊戲提示 */}
        <p className="text-lg text-amber-700 font-bold mb-8 bg-amber-100 px-6 py-2 rounded-full border-2 border-amber-200 shadow-sm">
          💡 點擊任何一句句子，聽聽電腦點讀，然後跟住讀啦！
        </p>

        {/* 故事書本體 */}
        <div className="bg-white w-full p-8 sm:p-12 rounded-3xl shadow-lg border-4 border-amber-200 relative">
          
          <h1 className="text-4xl sm:text-5xl font-black text-center text-gray-800 mb-10 tracking-wider">
            〈{currentStory?.title}〉
          </h1>

          <div className="flex flex-col gap-8 text-3xl sm:text-4xl leading-loose font-medium text-gray-700 tracking-wide">
            {currentStory?.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="indent-8">
                {paragraph.map((sentence, sIndex) => {
                  const isActive = activeSentence === sentence;
                  const isRead = readSentences.has(sentence);

                  return (
                    <motion.span
                      key={sIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => speakSentence(sentence)}
                      className={`inline-block cursor-pointer transition-all duration-300 rounded-2xl px-2 py-1 mx-1
                        ${isActive ? "bg-yellow-300 text-yellow-900 shadow-md font-bold scale-105" : 
                          isRead ? "text-gray-500 hover:bg-amber-50" : "hover:bg-amber-100"}
                      `}
                    >
                      {sentence}
                    </motion.span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 故事完成大獎勵畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">
              🎖️
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-black text-amber-500 mb-6 tracking-wider">故事小演說家！</h1>
            <p className="text-3xl font-extrabold text-orange-600 mb-10 max-w-md leading-relaxed">
              你好叻呀！已經讀完《{currentStory?.title}》整篇文章喇！
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedStoryIndex(null)}
                className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-black rounded-full shadow-md hover:bg-gray-300 transition-all"
              >
                返回書櫃 📚
              </button>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-amber-500 text-white text-xl font-black rounded-full shadow-[0_6px_0_0_#D97706] hover:bg-amber-600 active:translate-y-1 active:shadow-none transition-all"
              >
                再讀一次 🚀
              </button>
            </div>
            <div className="mt-8 flex gap-4 text-6xl">
              <span>🎉</span><span>📚</span><span>✨</span><span>📚</span><span>🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
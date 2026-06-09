"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📚 中文詞彙大數據庫 (配對簡單插圖)
const VOCAB_DB = [
  { word: "爸爸", emoji: "👨" }, { word: "媽媽", emoji: "👩" }, { word: "老師", emoji: "👩‍🏫" }, { word: "我們", emoji: "🧑‍🤝‍🧑" },
  { word: "上學", emoji: "🎒" }, { word: "哥哥", emoji: "👦" }, { word: "弟弟", emoji: "👶" }, { word: "小心", emoji: "⚠️" },
  { word: "水果", emoji: "🍎" }, { word: "公園", emoji: "🏞️" }, { word: "今天", emoji: "📅" }, { word: "太陽", emoji: "☀️" },
  { word: "生日", emoji: "🎂" }, { word: "同學", emoji: "🧒" }, { word: "書包", emoji: "🎒" }, { word: "美麗", emoji: "🌸" },
  { word: "朋友", emoji: "🤝" }, { word: "常常", emoji: "🔁" }, { word: "花兒", emoji: "🌺" }, { word: "星星", emoji: "⭐" },
  { word: "眼晴", emoji: "👀" }, { word: "大家", emoji: "👥" }, { word: "快樂", emoji: "😄" }, { word: "早上", emoji: "🌅" },
  { word: "學校", emoji: "🏫" }, { word: "唱歌", emoji: "🎤" }, { word: "工作", emoji: "💼" }, { word: "多少", emoji: "❓" },
  { word: "妹妹", emoji: "👧" }, { word: "姐姐", emoji: "👩" }, { word: "魚兒", emoji: "🐟" }, { word: "看見", emoji: "👁️" },
  { word: "回家", emoji: "🏠" }, { word: "樹木", emoji: "🌳" }, { word: "蝴蝶", emoji: "🦋" }, { word: "可愛", emoji: "🥰" },
  { word: "開心", emoji: "😁" }, { word: "孩子", emoji: "🧒" }, { word: "地方", emoji: "📍" }, { word: "東西", emoji: "📦" },
  { word: "好像", emoji: "💭" }, { word: "青蛙", emoji: "🐸" }, { word: "下課", emoji: "🏃" }, { word: "小息", emoji: "🥪" },
  { word: "謝謝", emoji: "🙏" }, { word: "游泳", emoji: "🏊" }, { word: "耳朵", emoji: "👂" }, { word: "晚上", emoji: "🌙" },
  { word: "春天", emoji: "🌷" }, { word: "顏色", emoji: "🎨" }, { word: "一會兒", emoji: "⏳" }, { word: "動物", emoji: "🦁" },
  { word: "身體", emoji: "🧍" }, { word: "糖果", emoji: "🍬" }, { word: "開學", emoji: "🏫" }, { word: "遊樂場", emoji: "🎠" },
  { word: "自己", emoji: "🙋" }, { word: "鼻子", emoji: "👃" }, { word: "高興", emoji: "😆" }, { word: "毛衣", emoji: "🧥" },
  { word: "蜜蜂", emoji: "🐝" }, { word: "雨點", emoji: "💧" }, { word: "食物", emoji: "🍔" }, { word: "寫字", emoji: "✍️" },
  { word: "新年", emoji: "🧨" }, { word: "喜歡", emoji: "❤️" }, { word: "說話", emoji: "🗣️" }, { word: "課室", emoji: "🪑" },
  { word: "年糕", emoji: "🥮" }, { word: "衣服", emoji: "👕" }, { word: "起來", emoji: "🧍" }, { word: "一起", emoji: "🫂" },
  { word: "出來", emoji: "🚪" }, { word: "電視", emoji: "📺" }, { word: "沒有", emoji: "❌" }, { word: "嘴巴", emoji: "👄" },
  { word: "玩耍", emoji: "🪀" }, { word: "點頭", emoji: "🙆" }, { word: "月亮", emoji: "🌙" }, { word: "再見", emoji: "👋" },
  { word: "跳舞", emoji: "💃" }, { word: "讀書", emoji: "📖" }, { word: "操場", emoji: "🏟️" }, { word: "時候", emoji: "⌚" },
  { word: "放學", emoji: "🎒" }, { word: "做工", emoji: "👷" }, { word: "清潔", emoji: "🧹" }, { word: "可以", emoji: "🆗" },
  { word: "生病", emoji: "🤒" }, { word: "頭髮", emoji: "💇" }, { word: "皮球", emoji: "⚽" }, { word: "休息", emoji: "🛏️" },
  { word: "為什麼", emoji: "❓" }, { word: "張開", emoji: "👐" }, { word: "對不起", emoji: "🙇" }, { word: "陽光", emoji: "☀️" },
  { word: "昨天", emoji: "🔙" }, { word: "秋天", emoji: "🍂" }, { word: "圖畫", emoji: "🖼️" }, { word: "兒童", emoji: "🧒" },
  { word: "尾巴", emoji: "🐕" }, { word: "長大", emoji: "📏" }, { word: "有趣", emoji: "🤩" }, { word: "美味", emoji: "😋" },
  { word: "洗澡", emoji: "🛁" }, { word: "故事", emoji: "📚" }, { word: "夏天", emoji: "🍉" }, { word: "房子", emoji: "🏠" },
  { word: "用功", emoji: "📖" }, { word: "走路", emoji: "🚶" }, { word: "哪裏", emoji: "🗺️" }, { word: "螞蟻", emoji: "🐜" },
  { word: "地板", emoji: "🪵" }, { word: "明亮", emoji: "💡" }, { word: "打掃", emoji: "🧹" }, { word: "健康", emoji: "💪" },
  { word: "跳繩", emoji: "🪢" }, { word: "開始", emoji: "🏁" }, { word: "起牀", emoji: "🛏️" }, { word: "過冬", emoji: "❄️" },
  { word: "音樂", emoji: "🎵" }, { word: "禮貌", emoji: "🤝" }, { word: "池塘", emoji: "🦆" }, { word: "漂亮", emoji: "✨" },
  { word: "窗子", emoji: "🪟" }, { word: "一定", emoji: "💯" }, { word: "以後", emoji: "🔜" }, { word: "肚子", emoji: "🤰" },
  { word: "回答", emoji: "🙋" }, { word: "客人", emoji: "👤" }, { word: "影子", emoji: "👥" }, { word: "帽子", emoji: "🧢" },
  { word: "臉兒", emoji: "😊" }, { word: "跌倒", emoji: "🤕" }, { word: "桌椅", emoji: "🪑" }, { word: "幫助", emoji: "🤝" },
  { word: "原來", emoji: "💡" }, { word: "燕子", emoji: "🐦" }, { word: "年紀", emoji: "👴" }, { word: "剪刀", emoji: "✂️" },
  { word: "連忙", emoji: "🏃" }, { word: "乾淨", emoji: "✨" }, { word: "奇妙", emoji: "🪄" }, { word: "節目", emoji: "📺" },
  { word: "舒服", emoji: "😌" }, { word: "應該", emoji: "✅" }, { word: "參加", emoji: "🙋" }, { word: "精神", emoji: "🌟" },
  { word: "輕輕", emoji: "🪶" }, { word: "脱落", emoji: "🍂" }, { word: "明白", emoji: "💡" }, { word: "白天", emoji: "☀️" },
  { word: "石頭", emoji: "🪨" }, { word: "馬上", emoji: "🐎" }, { word: "圖書館", emoji: "📚" }, { word: "地球", emoji: "🌍" },
  { word: "太空", emoji: "🚀" }, { word: "飛快", emoji: "🚀" }, { word: "生氣", emoji: "😠" }, { word: "清早", emoji: "🌅" },
  { word: "愛心", emoji: "💖" }, { word: "空氣", emoji: "🌬️" }, { word: "星期", emoji: "📅" }, { word: "美好", emoji: "🌈" },
  { word: "班長", emoji: "🎖️" }, { word: "國家", emoji: "🇭🇰" }, { word: "草地", emoji: "🌿" }, { word: "國王", emoji: "👑" },
  { word: "遊戲", emoji: "🎮" }, { word: "比賽", emoji: "🏆" }, { word: "學習", emoji: "📚" }, { word: "回來", emoji: "🔙" },
  { word: "海洋", emoji: "🌊" }, { word: "動作", emoji: "🏃" }, { word: "辛苦", emoji: "💦" }, { word: "可是", emoji: "🤔" },
  { word: "用心", emoji: "❤️" }, { word: "如果", emoji: "❓" }, { word: "外婆", emoji: "👵" }, { word: "禮物", emoji: "🎁" },
  { word: "吃飯", emoji: "🍚" }, { word: "所以", emoji: "➡️" }, { word: "種子", emoji: "🌱" }, { word: "後來", emoji: "🔜" },
  { word: "過去", emoji: "🔙" }, { word: "生活", emoji: "🏠" }, { word: "非常", emoji: "❗" }, { word: "知道", emoji: "🧠" },
  { word: "安靜", emoji: "🤫" }, { word: "害怕", emoji: "😨" }, { word: "泥土", emoji: "🟤" }, { word: "校服", emoji: "👔" },
  { word: "希望", emoji: "🌠" }, { word: "聲音", emoji: "🔊" }, { word: "生長", emoji: "🌱" }, { word: "努力", emoji: "💪" },
  { word: "發現", emoji: "🔍" }, { word: "別人", emoji: "👥" }, { word: "過來", emoji: "👋" }, { word: "奇怪", emoji: "👽" }
];

type WordItem = { word: string; emoji: string };

const ROUND_SIZE = 10; // 每次挑戰 10 題

export default function ChineseVocabGame() {
  const [deck, setDeck] = useState<WordItem[]>([]);
  const [target, setTarget] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);

  const playSound = (type: "coin" | "bump" | "success") => {
    try {
      const audio = new Audio(`/${type}.mp3`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-HK"; 
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const initGame = () => {
    // 從大字庫隨機抽出 10 個字作為今個回合的題目
    const shuffledDeck = [...VOCAB_DB].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    setDeck(shuffledDeck);
    setScore(0);
    setQuestionCount(0);
    setIsFinished(false);
    generateQuestion(shuffledDeck, 0);
  };

  const generateQuestion = (currentDeck: WordItem[], currentQIndex: number) => {
    if (currentQIndex >= currentDeck.length) {
      playSound("success");
      setIsFinished(true);
      return;
    }

    const currentTarget = currentDeck[currentQIndex];
    
    // 找出 3 個錯誤選項
    const wrongOptions = VOCAB_DB
      .filter((w) => w.word !== currentTarget.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const finalOptions = [currentTarget, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setTarget(currentTarget);
    setOptions(finalOptions);
    setFeedback("idle");
    
    // 稍微延遲播放語音，確保畫面已渲染
    setTimeout(() => speakWord(currentTarget.word), 400);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSelect = (selectedItem: WordItem) => {
    if (feedback !== "idle" || !target) return;

    if (selectedItem.word === target.word) {
      playSound("coin");
      setFeedback("correct");
      setScore((prev) => prev + 1);
      
      setTimeout(() => {
        const nextIndex = questionCount + 1;
        setQuestionCount(nextIndex);
        generateQuestion(deck, nextIndex);
      }, 1500);

    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  if (!target && !isFinished) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#FDF4FF] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none font-sans">
      
      {/* 右上角分數 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-fuchsia-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-3xl font-extrabold text-fuchsia-600 font-mono tracking-tighter">
          {score} / {ROUND_SIZE}
        </span>
      </div>

      <div className="text-center mb-8 z-10 w-full max-w-4xl mt-12 sm:mt-0">
        <h2 className="text-3xl font-black text-fuchsia-700 mb-4 tracking-wide">中文聽音辨字大挑戰 🎧</h2>
        
        {/* 進度條 */}
        {!isFinished && (
          <div className="w-full max-w-md mx-auto bg-fuchsia-100 rounded-full h-4 mb-8 relative overflow-hidden border border-fuchsia-200">
            <div className="bg-fuchsia-500 h-full transition-all duration-300" style={{ width: `${(questionCount / ROUND_SIZE) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-sm">進度：第 {questionCount + 1} 題</span>
          </div>
        )}

        {/* 🔊 朗讀按鈕 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => target && speakWord(target.word)}
          className="w-28 h-28 bg-fuchsia-500 rounded-full flex items-center justify-center text-6xl shadow-[0_8px_0_0_#A21CAF] active:translate-y-2 active:shadow-none transition-all mx-auto mb-6"
        >
          🔊
        </motion.button>

        <p className="text-xl font-bold text-fuchsia-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-fuchsia-200 shadow-sm">
          點擊大喇叭聽讀音，然後揀出正確的圖文卡！
        </p>
      </div>

      {/* 4選1 選項區域 */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl z-10 px-2">
        {options.map((item, index) => (
          <motion.button
            key={`${item.word}-${index}`}
            animate={feedback === "wrong" && item.word !== target?.word ? { x: [-10, 10, -10, 10, 0] } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(item)}
            className="py-8 px-4 bg-white rounded-3xl border-b-8 border-fuchsia-200 hover:bg-fuchsia-50 active:border-b-4 active:translate-y-1 transition-all shadow-md flex flex-col items-center justify-center gap-4"
          >
            {/* 簡單插圖 */}
            <span className="text-6xl drop-shadow-sm">{item.emoji}</span>
            {/* 中文字 */}
            <span className="text-4xl font-black text-gray-800 tracking-widest">{item.word}</span>
          </motion.button>
        ))}
      </div>

      {/* 通關大獎勵畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🏆</motion.div>
            <h1 className="text-6xl font-black text-fuchsia-600 mb-6">任務大成功！</h1>
            <p className="text-3xl font-extrabold text-orange-500 mb-10 max-w-md leading-relaxed">
              你好叻呀！認得晒啲字啦！
            </p>
            <button onClick={initGame} className="px-10 py-5 bg-fuchsia-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#A21CAF] hover:bg-fuchsia-600 active:translate-y-1 active:shadow-none transition-all">
              再挑戰 10 題 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 回饋大動畫 */}
      <AnimatePresence>
        {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute text-9xl z-20 pointer-events-none">✅</motion.div>}
        {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute text-9xl z-20 pointer-events-none">❌</motion.div>}
      </AnimatePresence>
    </div>
  );
}
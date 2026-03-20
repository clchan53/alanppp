"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD_LIST = [
  // 水果與食物
  { word: "APPLE", hint: "🍎", zh: "蘋果" }, { word: "BANANA", hint: "🍌", zh: "香蕉" },
  { word: "ORANGE", hint: "🍊", zh: "橙" }, { word: "GRAPE", hint: "🍇", zh: "提子" },
  { word: "PEAR", hint: "🍐", zh: "梨" }, { word: "PEACH", hint: "🍑", zh: "桃" },
  { word: "MANGO", hint: "🥭", zh: "芒果" }, { word: "STRAWBERRY", hint: "🍓", zh: "士多啤梨" },
  { word: "WATERMELON", hint: "🍉", zh: "西瓜" }, { word: "KIWI", hint: "🥝", zh: "奇異果" },
  { word: "LEMON", hint: "🍋", zh: "檸檬" }, { word: "CHERRY", hint: "🍒", zh: "車厘子" },
  { word: "MILK", hint: "🥛", zh: "牛奶" }, { word: "WATER", hint: "💧", zh: "水" },
  { word: "JUICE", hint: "🧃", zh: "果汁" }, { word: "BREAD", hint: "🍞", zh: "麵包" },
  { word: "CAKE", hint: "🍰", zh: "蛋糕" }, { word: "RICE", hint: "🍚", zh: "白飯" },
  { word: "EGG", hint: "🥚", zh: "雞蛋" }, { word: "APPLE PIE", hint: "🥧", zh: "蘋果批" },
  { word: "COOKIE", hint: "🍪", zh: "曲奇" }, { word: "ICE CREAM", hint: "🍦", zh: "雪糕" },

  // 動物
  { word: "CAT", hint: "🐱", zh: "貓咪" }, { word: "DOG", hint: "🐶", zh: "狗仔" },
  { word: "FISH", hint: "🐟", zh: "魚" }, { word: "BIRD", hint: "🐦", zh: "雀仔" },
  { word: "FROG", hint: "🐸", zh: "青蛙" }, { word: "LION", hint: "🦁", zh: "獅子" },
  { word: "BEAR", hint: "🐻", zh: "熊仔" }, { word: "DUCK", hint: "🦆", zh: "鴨仔" },

  // 顏色
  { word: "RED", hint: "🔴", zh: "紅色" }, { word: "BLUE", hint: "🔵", zh: "藍色" },
  { word: "GREEN", hint: "🟢", zh: "綠色" }, { word: "YELLOW", hint: "🟡", zh: "黃色" },
  { word: "BLACK", hint: "⚫", zh: "黑色" }, { word: "WHITE", hint: "⚪", zh: "白色" },
  { word: "PINK", hint: "🌸", zh: "粉紅色" }, { word: "PURPLE", hint: "🟣", zh: "紫色" },
  { word: "BROWN", hint: "🟤", zh: "啡色" },

  // 家人與人物
  { word: "MOM", hint: "👩", zh: "媽媽" }, { word: "DAD", hint: "👨", zh: "爸爸" },
  { word: "BROTHER", hint: "👦", zh: "兄弟" }, { word: "SISTER", hint: "👧", zh: "姊妹" },
  { word: "GRANDMA", hint: "👵", zh: "嫲嫲/婆婆" }, { word: "GRANDPA", hint: "👴", zh: "爺爺/公公" },
  { word: "BABY", hint: "👶", zh: "BB" }, { word: "FRIEND", hint: "🤝", zh: "朋友" },
  { word: "TEACHER", hint: "👩‍🏫", zh: "老師" }, { word: "BOY", hint: "👦", zh: "男仔" },
  { word: "GIRL", hint: "👧", zh: "女仔" }, { word: "MAN", hint: "👨", zh: "男人" },
  { word: "WOMAN", hint: "👩", zh: "女人" },

  // 物品與地方
  { word: "HOUSE", hint: "🏠", zh: "屋企" }, { word: "SCHOOL", hint: "🏫", zh: "學校" },
  { word: "CAR", hint: "🚗", zh: "車" }, { word: "BUS", hint: "🚌", zh: "巴士" },
  { word: "BED", hint: "🛏️", zh: "床" }, { word: "CHAIR", hint: "🪑", zh: "凳" },
  { word: "TABLE", hint: "🍽️", zh: "餐桌" }, { word: "BOOK", hint: "📖", zh: "書" },
  { word: "TOY", hint: "🧸", zh: "玩具" }, { word: "BALL", hint: "⚽", zh: "波" },
  { word: "DOLL", hint: "🎎", zh: "公仔" }, { word: "SHOES", hint: "👟", zh: "鞋" },
  { word: "HAT", hint: "🧢", zh: "帽" }, { word: "BAG", hint: "🎒", zh: "書包" },
  { word: "T-SHIRT", hint: "👕", zh: "T恤" }, { word: "CUP", hint: "🥤", zh: "水杯" },
  { word: "SPOON", hint: "🥄", zh: "匙羹" }, { word: "PLATE", hint: "🍽️", zh: "碟" },

  // 身體部位
  { word: "EYE", hint: "👁️", zh: "眼睛" }, { word: "NOSE", hint: "👃", zh: "鼻子" },
  { word: "MOUTH", hint: "👄", zh: "嘴巴" }, { word: "EAR", hint: "👂", zh: "耳仔" },
  { word: "HAND", hint: "🖐️", zh: "手" }, { word: "LEG", hint: "🦵", zh: "腳(腿)" },
  { word: "FOOT", hint: "🦶", zh: "腳掌" }, { word: "HEAD", hint: "👤", zh: "頭" },
  { word: "HAIR", hint: "💇", zh: "頭髮" }, { word: "FACE", hint: "👱", zh: "臉" },

  // 大自然
  { word: "SUN", hint: "☀️", zh: "太陽" }, { word: "MOON", hint: "🌙", zh: "月亮" },
  { word: "STAR", hint: "⭐", zh: "星星" }, { word: "CLOUD", hint: "☁️", zh: "雲" },
  { word: "RAIN", hint: "🌧️", zh: "雨" }, { word: "SNOW", hint: "❄️", zh: "雪" },
  { word: "TREE", hint: "🌳", zh: "樹" }, { word: "FLOWER", hint: "🌻", zh: "花" },
  { word: "GRASS", hint: "🌿", zh: "草" }, { word: "LEAF", hint: "🍃", zh: "樹葉" },

  // 動作 (動詞)
  { word: "RUN", hint: "🏃", zh: "跑步" }, { word: "JUMP", hint: "🦘", zh: "跳" },
  { word: "WALK", hint: "🚶", zh: "行路" }, { word: "EAT", hint: "😋", zh: "食嘢" },
  { word: "DRINK", hint: "🥤", zh: "飲水" }, { word: "SLEEP", hint: "😴", zh: "瞓覺" },
  { word: "PLAY", hint: "🎮", zh: "玩耍" }, { word: "READ", hint: "📖", zh: "閱讀" },
  { word: "DRAW", hint: "🖍️", zh: "畫畫" }, { word: "SING", hint: "🎤", zh: "唱歌" }
];

const MAX_MISTAKES = 6;
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-".split("");

export default function HangmanGame() {
  const [currentWord, setCurrentWord] = useState(WORD_LIST[0]);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  const playSound = (sound: "coin" | "bump") => {
    try {
      const audio = new Audio(`/${sound}.mp3`);
      audio.play().catch((e) => console.log("聲音播放被阻擋:", e));
    } catch (error) {
      console.log("無法播放聲音", error);
    }
  };

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; 
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const pickNewWord = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
  };

  useEffect(() => {
    pickNewWord();
  }, []);

  const isWinner = currentWord.word.split("").every((letter) => letter === " " || guessedLetters.has(letter));
  const isLoser = mistakes >= MAX_MISTAKES;

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || isWinner || isLoser) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (currentWord.word.includes(letter)) {
      playSound("coin"); 
      
      const checkWinner = currentWord.word.split("").every((l) => l === " " || newGuessed.has(l));
      if (checkWinner) {
        setScore((s) => s + 1);
        setTimeout(() => speakWord(currentWord.word), 500); 
      }
    } else {
      playSound("bump"); 
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= MAX_MISTAKES) {
        setScore((s) => Math.max(0, s - 1));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#FFF5E1] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      {/* 計分錶 */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/80 p-3 px-5 rounded-full border-4 border-yellow-400 z-10 shadow-md">
        <span className="text-4xl drop-shadow-sm">🌟</span>
        <span className="text-4xl font-extrabold text-orange-500 font-mono tracking-tighter">
          {score.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="text-center mb-6 z-10">
        <h2 className="text-3xl font-black text-orange-500 mb-4 tracking-wider">估生字遊戲</h2>
        <div className="flex gap-2 justify-center text-5xl mb-2">
          {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
            <motion.span 
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={i < mistakes ? "opacity-30 grayscale" : "drop-shadow-md"}
            >
              {i < mistakes ? "💔" : "❤️"}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 👇 更新：Emoji 與中文提示同時顯示 👇 */}
      <motion.div 
        key={currentWord.word}
        initial={{ scale: 0, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        className="flex flex-col items-center mb-8 z-10"
      >
        <span className="text-8xl md:text-9xl drop-shadow-xl mb-4">
          {currentWord.hint}
        </span>
        {/* 常駐顯示的中文提示 */}
        <span className="text-2xl md:text-3xl font-black text-orange-700 bg-orange-100 border-2 border-orange-300 px-6 py-2 rounded-full shadow-sm">
          {currentWord.zh}
        </span>
      </motion.div>
      {/* 👆 更新結束 👆 */}

      {/* 生字顯示區 */}
      <div className="flex gap-2 sm:gap-4 mb-10 z-10 flex-wrap justify-center px-4">
        {currentWord.word.split("").map((letter, index) => {
          if (letter === " ") {
            return <div key={index} className="w-4 sm:w-8"></div>;
          }

          return (
            <div 
              key={index} 
              className="w-12 h-16 sm:w-20 sm:h-24 bg-white border-b-8 border-orange-200 rounded-2xl flex items-center justify-center text-4xl sm:text-6xl font-black text-gray-800 shadow-sm"
            >
              {guessedLetters.has(letter) || isLoser ? (
                <motion.span
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={!guessedLetters.has(letter) && isLoser ? "text-red-500" : "text-green-500"}
                >
                  {letter}
                </motion.span>
              ) : (
                <span className="text-gray-300">_</span>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {(isWinner || isLoser) && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute z-30 bg-white/95 p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-orange-400 text-center"
          >
            <div className="text-8xl mb-4">{isWinner ? "🎉" : "😭"}</div>
            <h3 className="text-3xl sm:text-4xl font-black mb-8 text-gray-800">
              {isWinner ? "好叻仔！答對咗！" : "哎呀！唔緊要！"}
            </h3>
            
            <div className="flex gap-4">
              <button 
                onClick={() => speakWord(currentWord.word)}
                className="px-6 py-4 bg-blue-500 text-white text-xl font-bold rounded-full shadow-[0_6px_0_0_#2563EB] hover:bg-blue-400 active:translate-y-2 active:shadow-none transition-all flex items-center gap-2"
              >
                🔊 聽多次
              </button>
              <button 
                onClick={pickNewWord}
                className="px-6 py-4 bg-orange-500 text-white text-xl font-bold rounded-full shadow-[0_6px_0_0_#C05600] hover:bg-orange-400 active:translate-y-2 active:shadow-none transition-all flex items-center gap-2"
              >
                下一題 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl z-10 px-2 pb-8">
        {ALPHABETS.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && currentWord.word.includes(letter);
          const isWrong = isGuessed && !currentWord.word.includes(letter);

          let btnColor = "bg-white text-orange-600 border-orange-200 hover:bg-orange-100";
          if (isCorrect) btnColor = "bg-green-500 text-white border-green-700 opacity-60";
          if (isWrong) btnColor = "bg-gray-300 text-gray-500 border-gray-400 opacity-40";

          return (
            <motion.button
              key={letter}
              whileHover={!isGuessed && !isWinner && !isLoser ? { scale: 1.1 } : {}}
              whileTap={!isGuessed && !isWinner && !isLoser ? { scale: 0.9 } : {}}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || isWinner || isLoser}
              className={`w-10 h-14 sm:w-16 sm:h-20 text-xl sm:text-4xl font-black rounded-xl border-b-4 shadow-sm transition-colors ${btnColor}`}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
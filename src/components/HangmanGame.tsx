"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 小朋友專屬嘅簡單生字表
const WORDS = [
    "APPLE", "BANANA", "CAT", "DOG", "FISH", "BIRD", "FROG", "LION", "BEAR", "DUCK",
    "ORANGE", "GRAPE", "PEAR", "PEACH", "MANGO", "STRAWBERRY", "WATERMELON", "KIWI", "LEMON", "CHERRY",
    "RED", "BLUE", "GREEN", "YELLOW", "BLACK", "WHITE", "PINK", "PURPLE", "BROWN", "ORANGE (color)",
    "MOM", "DAD", "BROTHER", "SISTER", "GRANDMA", "GRANDPA", "BABY", "FRIEND", "TEACHER", "BOY",
    "GIRL", "MAN", "WOMAN", "HOUSE", "SCHOOL", "CAR", "BUS", "BED", "CHAIR", "TABLE", "BOOK",
    "TOY", "BALL", "DOLL", "SHOES", "HAT", "BAG", "T-SHIRT", "CUP", "SPOON", "PLATE",
    "EYE", "NOSE", "MOUTH", "EAR", "HAND", "LEG", "FOOT", "HEAD", "HAIR", "FACE",
    "SUN", "MOON", "STAR", "CLOUD", "RAIN", "SNOW", "TREE", "FLOWER", "GRASS", "LEAF",
    "MILK", "WATER", "JUICE", "BREAD", "CAKE", "RICE", "EGG", "APPLE PIE", "COOKIE", "ICE CREAM",
    "RUN", "JUMP", "WALK", "EAT", "DRINK", "SLEEP", "PLAY", "READ", "DRAW", "SING"
];
const MAX_MISTAKES = 10;
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function HangmanGame() {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);

  // 隨機揀字
  const pickNewWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
  };

  useEffect(() => {
    pickNewWord();
  }, []);

  const isWinner = word && word.split("").every((letter) => guessedLetters.has(letter));
  const isLoser = mistakes >= MAX_MISTAKES;

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || isWinner || isLoser) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      setMistakes((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#FFF5E1] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      {/* 標題與生命值 */}
      <div className="text-center mb-8 z-10">
        <h2 className="text-3xl font-black text-orange-500 mb-4 tracking-wider">估生字遊戲</h2>
        <div className="flex gap-2 justify-center text-4xl">
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

      {/* 生字顯示區 */}
      <div className="flex gap-3 sm:gap-4 mb-12 z-10 flex-wrap justify-center">
        {word.split("").map((letter, index) => (
          <div 
            key={index} 
            className="w-16 h-20 sm:w-20 sm:h-24 bg-white border-b-8 border-orange-200 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl font-black text-gray-800 shadow-sm"
          >
            {guessedLetters.has(letter) || isLoser ? (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={!guessedLetters.has(letter) && isLoser ? "text-red-500" : "text-green-500"}
              >
                {letter}
              </motion.span>
            ) : (
              <span className="text-gray-300">_</span>
            )}
          </div>
        ))}
      </div>

      {/* 遊戲結束提示 */}
      <AnimatePresence>
        {(isWinner || isLoser) && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute z-20 bg-white/95 p-8 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-orange-400"
          >
            <div className="text-8xl mb-4">{isWinner ? "🎉" : "😭"}</div>
            <h3 className="text-4xl font-black mb-6 text-gray-800">
              {isWinner ? "好叻仔！答對咗！" : `哎呀！答案係 ${word}`}
            </h3>
            <button 
              onClick={pickNewWord}
              className="px-8 py-4 bg-orange-500 text-white text-2xl font-bold rounded-full shadow-[0_6px_0_0_#C05600] hover:bg-orange-400 active:translate-y-2 active:shadow-none transition-all"
            >
              再玩一次 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 字母鍵盤 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl z-10 px-2">
        {ALPHABETS.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);

          let btnColor = "bg-white text-orange-600 border-orange-200 hover:bg-orange-100";
          if (isCorrect) btnColor = "bg-green-500 text-white border-green-600 opacity-50";
          if (isWrong) btnColor = "bg-gray-300 text-gray-500 border-gray-400 opacity-50";

          return (
            <motion.button
              key={letter}
              whileHover={!isGuessed ? { scale: 1.1 } : {}}
              whileTap={!isGuessed ? { scale: 0.9 } : {}}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || isWinner || isLoser}
              className={`w-12 h-14 sm:w-16 sm:h-20 text-2xl sm:text-4xl font-black rounded-xl border-b-4 shadow-sm transition-colors ${btnColor}`}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
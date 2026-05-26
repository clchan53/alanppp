"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 將你嘅句子整理成 問(Q) 與 答(A) 嘅組合
const DIALOGUES = [
  { q: "What is your favourite sport?", a: "I like swimming / badminton / cycling / football / skating / basketball." },
  { q: "What do you have in your school bag?", a: "I have my books, my message bag, my cup and towel box inside my school bag." },
  { q: "Where are your books?", a: "They are in my schoolbag." },
  { q: "What does your family do together?", a: "We eat dinner together. We play together." },
  { q: "Where is the eraser?", a: "It is on the table." },
  { q: "Where is the towel?", a: "It is behind the door." },
  { q: "What do you do in the park?", a: "I play on the monkey bars / slide / see-saw / swings." },
  { q: "How many friends do you have?", a: "I have many friends. I have... friends." },
  { q: "How many months are there in a year?", a: "There are twelve months." },
  { q: "Where is your friend?", a: "My friend is sitting beside me." },
  { q: "What do you do with your friends?", a: "We chat. We play games. We ride our bicycles. We go to the park." },
  { q: "What do you do on the weekend?", a: "I go shopping. I go swimming. I go to the park." },
  { q: "What do you enjoy doing in your free time?", a: "I enjoy reading books / watching television." }
];

export default function ReadAloud() {
  const [activeText, setActiveText] = useState("");

  // 🗣️ 英式口音發聲系統 (British English)
  const speakBritish = (text: string) => {
    if ("speechSynthesis" in window) {
      // 停止上一句嘅聲音，防止重疊
      window.speechSynthesis.cancel();
      
      // 將斜線 "/" 替換成 "or"，令電腦讀得自然啲
      const cleanText = text.replace(/\//g, " or ");
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-GB"; // 強制使用英式英文 (British)
      utterance.rate = 0.8;     // 語速稍微放慢，啱 5 歲聽
      utterance.pitch = 1.1;    // 聲調稍微提高少少，聽落精神啲

      // 嘗試尋找原生英式語音包，如果搵到就用，聽落會更逼真
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(v => v.lang === "en-GB" || v.lang === "en-UK");
      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      // 設定正在讀嘅句子，方便加特效
      setActiveText(text);
      utterance.onend = () => setActiveText("");

      window.speechSynthesis.speak(utterance);
    }
  };

  // 確保一載入頁面就準備好語音包
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F0FDF4] rounded-3xl p-4 sm:p-8 shadow-inner select-none">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-teal-600 mb-4 tracking-wider">English Chat 🗣️</h2>
        <p className="text-lg text-teal-500 font-bold">撳下聲音符號，聽下純正英式發音啦！</p>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {DIALOGUES.map((dialogue, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-md border-4 border-teal-100 flex flex-col gap-4">
            
            {/* 問題 (Q) */}
            <div className="flex items-start gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakBritish(dialogue.q)}
                className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-sm border-2 transition-colors
                  ${activeText === dialogue.q ? "bg-teal-400 border-teal-500 animate-pulse" : "bg-teal-100 border-teal-200 hover:bg-teal-200"}
                `}
              >
                🔊
              </motion.button>
              <p className={`text-2xl sm:text-3xl font-bold pt-2 transition-colors ${activeText === dialogue.q ? "text-teal-600" : "text-gray-700"}`}>
                <span className="text-teal-400 mr-2">Q:</span>{dialogue.q}
              </p>
            </div>

            {/* 分隔線 */}
            <hr className="border-teal-50 border-2 rounded-full mx-4" />

            {/* 答案 (A) */}
            <div className="flex items-start gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakBritish(dialogue.a)}
                className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-sm border-2 transition-colors
                  ${activeText === dialogue.a ? "bg-orange-400 border-orange-500 animate-pulse" : "bg-orange-100 border-orange-200 hover:bg-orange-200"}
                `}
              >
                🔊
              </motion.button>
              <p className={`text-2xl sm:text-3xl font-bold pt-2 transition-colors ${activeText === dialogue.a ? "text-orange-600" : "text-gray-700"}`}>
                <span className="text-orange-400 mr-2">A:</span>{dialogue.a}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
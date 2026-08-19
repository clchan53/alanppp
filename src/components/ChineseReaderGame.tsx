"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📖 通用課文數據庫
const LESSONS_DB = [
  {
    id: 1,
    title: "第一課 早操",
    emoji: "🏃",
    lines: [
      [
        { pinyin: "Xiǎo niǎo ér", text: "小鳥兒" }, { pinyin: "，", text: "，" },
        { pinyin: "qǐ de zǎo", text: "起得早" }, { pinyin: "，", text: "，" },
        { pinyin: "tiào lái tiào qù", text: "跳來跳去" }, { pinyin: "，", text: "，" },
        { pinyin: "zài shù zhī shang", text: "在樹枝上" }, { pinyin: "zuò zǎo cāo", text: "做早操" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Xiǎo mì fēng", text: "小蜜蜂" }, { pinyin: "，", text: "，" },
        { pinyin: "qǐ de zǎo", text: "起得早" }, { pinyin: "，", text: "，" },
        { pinyin: "fēi lái fēi qù", text: "飛來飛去" }, { pinyin: "，", text: "，" },
        { pinyin: "zài huā duǒ shang", text: "在花朵上" }, { pinyin: "zuò zǎo cāo", text: "做早操" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Xiǎo xué shēng", text: "小學生" }, { pinyin: "，", text: "，" },
        { pinyin: "qǐ de zǎo", text: "起得早" }, { pinyin: "，", text: "，" },
        { pinyin: "pǎo lái pǎo qù", text: "跑來跑去" }, { pinyin: "，", text: "，" },
        { pinyin: "zài yáng guāng xià", text: "在陽光下" }, { pinyin: "zuò zǎo cāo", text: "做早操" }, { pinyin: "。", text: "。" }
      ]
    ],
    quiz: [
      { q: "誰在樹枝上做早操？", ans: "小鳥兒", options: ["小鳥兒", "小蜜蜂", "小學生"] },
      { q: "小蜜蜂在哪裡做早操？", ans: "花朵上", options: ["花朵上", "樹枝上", "陽光下"] },
      { q: "小學生做什麼動作？", ans: "跑來跑去", options: ["跑來跑去", "跳來跳去", "飛來飛去"] }
    ]
  },
  {
    id: 2,
    title: "第二課 坐校車",
    emoji: "🚌",
    lines: [
      [
        { pinyin: "Shàng xué le", text: "上學了" }, { pinyin: "！", text: "！" },
        { pinyin: "Shàng xué le", text: "上學了" }, { pinyin: "！", text: "！" }
      ],
      [
        { pinyin: "Mā ma zǎo", text: "媽媽早" }, { pinyin: "！", text: "！" }
      ],
      [
        { pinyin: "Xiè xie mā ma jiào xǐng wǒ", text: "謝謝媽媽叫醒我" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Sòng wǒ zuò xiào chē", text: "送我坐校車" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Shàng xué le", text: "上學了" }, { pinyin: "！", text: "！" },
        { pinyin: "Shàng xué le", text: "上學了" }, { pinyin: "！", text: "！" }
      ],
      [
        { pinyin: "Sī jī shū shu hǎo", text: "司機叔叔好" }, { pinyin: "！", text: "！" }
      ],
      [
        { pinyin: "Xiè xie shū shu lái jiē wǒ", text: "謝謝叔叔來接我" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Sòng wǒ dào xué xiào", text: "送我到學校" }, { pinyin: "。", text: "。" }
      ]
    ],
    quiz: [
      { q: "是誰叫醒我？", ans: "媽媽", options: ["媽媽", "爸爸", "司機叔叔"] },
      { q: "媽媽送我坐什麼？", ans: "校車", options: ["校車", "的士", "巴士"] },
      { q: "誰來接我？", ans: "司機叔叔", options: ["司機叔叔", "老師", "校長"] },
      { q: "司機叔叔送我到哪裡？", ans: "學校", options: ["學校", "公園", "圖書館"] }
    ]
  },
  {
    id: 3,
    title: "第三課 誰伴我上學",
    emoji: "☔",
    lines: [
      [
        { pinyin: "Yí", text: "咦" }, { pinyin: "！", text: "！" },
        { pinyin: "Shì shéi zài tiān kōng zhōng chàng gē", text: "是誰在天空中唱歌" }, { pinyin: "？", text: "？" }
      ],
      [
        { pinyin: "Huā huā", text: "嘩嘩" }, { pinyin: "，", text: "，" }, 
        { pinyin: "huā huā", text: "嘩嘩" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Shì shéi zài chē chuāng shang wán shuǎ", text: "是誰在車窗上玩耍" }, { pinyin: "？", text: "？" }
      ],
      [
        { pinyin: "Dā dā", text: "嗒嗒" }, { pinyin: "，", text: "，" }, 
        { pinyin: "dā dā", text: "嗒嗒" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Shì shéi zài xiǎo sǎn shang tiào wǔ", text: "是誰在小傘上跳舞" }, { pinyin: "？", text: "？" }
      ],
      [
        { pinyin: "Shā shā", text: "沙沙" }, { pinyin: "，", text: "，" }, 
        { pinyin: "shā shā", text: "沙沙" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "À", text: "啊" }, { pinyin: "！", text: "！" },
        { pinyin: "Shì xiǎo yǔ diǎn a", text: "是小雨點啊" }, { pinyin: "！", text: "！" }
      ],
      [
        { pinyin: "Huó pō de xiǎo yǔ diǎn", text: "活潑的小雨點" }, 
        { pinyin: "bàn wǒ kuài lè de shàng xué", text: "伴我快樂地上學" }, { pinyin: "！", text: "！" }
      ]
    ],
    quiz: [
      { q: "是誰在天空中唱歌？", ans: "小雨點", options: ["小雨點", "小鳥兒", "小蜜蜂"] },
      { q: "小雨點在車窗上發出什麼聲音？", ans: "嗒嗒", options: ["嗒嗒", "嘩嘩", "沙沙"] },
      { q: "小雨點在小傘上做什麼？", ans: "跳舞", options: ["跳舞", "唱歌", "玩耍"] },
      { q: "誰伴我快樂地上學？", ans: "小雨點", options: ["小雨點", "媽媽", "司機叔叔"] }
    ]
  },
  {
    id: 4,
    title: "第四課 鈴聲響",
    emoji: "🔔",
    lines: [
      [
        { pinyin: "Líng shēng xiǎng", text: "鈴聲響" }, { pinyin: "，", text: "，" },
        { pinyin: "shàng kè le", text: "上課了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Jiào shì lǐ", text: "教室裏" }, { pinyin: "，", text: "，" },
        { pinyin: "zhōng wén lǎo shī jiāo shī gē", text: "中文老師教詩歌" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "yīng wén lǎo shī jiǎng gù shi", text: "英文老師講故事" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "shù xué lǎo shī shǔ shù zì", text: "數學老師數數字" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "wǒ men ān jìng shàng kè xué xīn zhī", text: "我們安靜上課學新知" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Líng shēng xiǎng", text: "鈴聲響" }, { pinyin: "，", text: "，" },
        { pinyin: "xià kè le", text: "下課了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Cāo chǎng shang", text: "操場上" }, { pinyin: "，", text: "，" },
        { pinyin: "zhēn rè nao", text: "真熱鬧" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "wǒ chī bǐng gān", text: "我吃餅乾" }, { pinyin: "，", text: "，" },
        { pinyin: "nǐ xià qí", text: "你下棋" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "dà jiā dōu xiào xī xī", text: "大家都笑嘻嘻" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Měi cì líng shēng xiǎng", text: "每次鈴聲響" }, { pinyin: "，", text: "，" },
        { pinyin: "jiù yǒu xīn qí shì", text: "就有新奇事" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Líng shēng zhēn shén qí", text: "鈴聲真神奇" }, { pinyin: "！", text: "！" }
      ]
    ],
    quiz: [
      { q: "中文老師在教室裏做什麼？", ans: "教詩歌", options: ["教詩歌", "講故事", "數數字"] },
      { q: "下課了，操場上感覺怎樣？", ans: "真熱鬧", options: ["真熱鬧", "很安靜", "很神奇"] },
      { q: "我在操場上做什麼？", ans: "吃餅乾", options: ["吃餅乾", "下棋", "跳舞"] },
      { q: "每次鈴聲響，就有什麼？", ans: "新奇事", options: ["新奇事", "笑嘻嘻", "好朋友"] }
    ]
  },
  {
    id: 5,
    title: "第五課 陪我玩耍的爸爸",
    emoji: "👨",
    lines: [
      [
        { pinyin: "Wǒ hé bà ba wán zhuō mí cáng", text: "我和爸爸玩捉迷藏" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "tā duǒ zài mián bèi li", text: "他躲在棉被裏" }, { pinyin: "，", text: "，" },
        { pinyin: "yí xià zi biàn bèi wǒ zhǎo dào", text: "一下子便被我找到" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "tā shuō yào zài wán yí cì", text: "他說要再玩一次" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Tā duǒ zài zhuō zi xià", text: "他躲在桌子下" }, { pinyin: "，", text: "，" },
        { pinyin: "duǒ zài shā fā hòu", text: "躲在沙發後" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "dōu bèi wǒ zhǎo dào le", text: "都被我找到了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Wǒ wán lèi le", text: "我玩累了" }, { pinyin: "，", text: "，" },
        { pinyin: "tā bào zhe wǒ", text: "他抱着我" }, { pinyin: "，", text: "，" },
        { pinyin: "mō mo wǒ de tóu", text: "摸摸我的頭" }, { pinyin: "，", text: "，" },
        { pinyin: "yì qǐ shuì jiào", text: "一起睡覺" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Wǒ hé bà ba sài pǎo", text: "我和爸爸賽跑" }, { pinyin: "，", text: "，" },
        { pinyin: "tā gè zi bǐ wǒ gāo", text: "他個子比我高" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "yí xià zi biàn pǎo dào zhōng diǎn", text: "一下子便跑到終點" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Wǒ men zài pǎo yí cì", text: "我們再跑一次" }, { pinyin: "，", text: "，" },
        { pinyin: "bà ba pǎo màn diǎn", text: "爸爸跑慢點" }, { pinyin: "，", text: "，" },
        { pinyin: "ràng wǒ shèng chū", text: "讓我勝出" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Wǒ pǎo lèi le", text: "我跑累了" }, { pinyin: "，", text: "，" },
        { pinyin: "tā bào zhe wǒ", text: "他抱着我" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "zuò gè guǐ liǎn", text: "做個鬼臉" }, { pinyin: "，", text: "，" },
        { pinyin: "hā hā dà xiào", text: "哈哈大笑" }, { pinyin: "。" , text: "。" }
      ],
      [
        { pinyin: "Bà ba cháng cháng péi wǒ wán shuǎ", text: "爸爸常常陪我玩耍" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Wǒ zuì xǐ huan bà ba le", text: "我最喜歡爸爸了" }, { pinyin: "。", text: "。" }
      ]
    ],
    quiz: [
      { q: "我和爸爸玩什麼遊戲？", ans: "捉迷藏", options: ["捉迷藏", "捉字數", "捉棋"] },
      { q: "爸爸個子比我怎樣？", ans: "高", options: ["高", "矮", "胖"] },
      { q: "我跑累了，爸爸對我做什麼？", ans: "做個鬼臉", options: ["做個鬼臉", "買雪糕", "講故事"] },
      { q: "我最喜歡誰？", ans: "爸爸", options: ["爸爸", "媽媽", "司機叔叔"] }
    ]
  },
  {
    id: 6,
    title: "第六課 好姐姐",
    emoji: "👧",
    lines: [
      [
        { pinyin: "Wǎn fàn hòu", text: "晚飯後" }, { pinyin: "，", text: "，" },
        { pinyin: "jiě jie fā xiàn zuò yè běn de fēng miàn shang", text: "姐姐發現作業本的封面上" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "yǒu jǐ tiáo wān wān qū qū de xiàn", text: "有幾條彎彎曲曲的線" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Jiě jie hěn hài pà", text: "姐姐很害怕" }, { pinyin: "，", text: "，" },
        { pinyin: "xiǎng kū", text: "想哭" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Liǎng suì de dì di zǒu guo lai", text: "兩歲的弟弟走過來" }, { pinyin: "，", text: "，" },
        { pinyin: "tā nà bái bái pàng pàng de xiǎo shǒu", text: "他那白白胖胖的小手" }
      ],
      [
        { pinyin: "wò zhe yì zhī yán sè bǐ", text: "握着一枝顏色筆" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Mā ma shuō", text: "媽媽說" }, { pinyin: "：", text: "：" }, { pinyin: "「", text: "「" },
        { pinyin: "Wǒ xiǎng shì dì di huà de", text: "我想是弟弟畫的" }, { pinyin: "。", text: "。" }, { pinyin: "」", text: "」" }
      ],
      [
        { pinyin: "Mā ma wèn jiě jie", text: "媽媽問姐姐" }, { pinyin: "：", text: "：" }, { pinyin: "「", text: "「" },
        { pinyin: "Nǐ rèn wéi zěn yàng zuò hǎo ne", text: "你認為怎樣做好呢" }, { pinyin: "？", text: "？" }, { pinyin: "」", text: "」" }
      ],
      [
        { pinyin: "Jiě jie kàn kan dì di", text: "姐姐看看弟弟" }, { pinyin: "，", text: "，" },
        { pinyin: "shuō", text: "說" }, { pinyin: "：", text: "：" }, { pinyin: "「", text: "「" }
      ],
      [
        { pinyin: "Wǒ huì gēn lǎo shī shuō duì bu qǐ", text: "我會跟老師說對不起" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "dì di xǐ huan huà huà", text: "弟弟喜歡畫畫" }, { pinyin: "，", text: "，" },
        { pinyin: "cái huà huā le", text: "才畫花了" }, { pinyin: "。", text: "。" }, { pinyin: "」", text: "」" }
      ],
      [
        { pinyin: "Dì di tīng le", text: "弟弟聽了" }, { pinyin: "，", text: "，" },
        { pinyin: "yě xué zhe shuō", text: "也學着說" }, { pinyin: "：", text: "：" }, { pinyin: "「", text: "「" },
        { pinyin: "Duì bu qǐ", text: "對不起" }, { pinyin: "。", text: "。" }, { pinyin: "」", text: "」" }
      ]
    ],
    quiz: [
      { q: "姐姐發現作業本的封面上，有什麼？", ans: "彎彎曲曲的線", options: ["彎彎曲曲的線", "直直的線", "顏色筆"] },
      { q: "兩歲的弟弟手裡握着什麼？", ans: "顏色筆", options: ["顏色筆", "作業本", "小雨點"] },
      { q: "姐姐會跟誰說對不起？", ans: "老師", options: ["老師", "媽媽", "弟弟"] },
      { q: "弟弟聽了，也學着說什麼？", ans: "對不起", options: ["對不起", "謝謝", "再見"] }
    ]
  },
  {
    id: 7,
    title: "第七課 魚",
    emoji: "🐟",
    lines: [
      [
        { pinyin: "Shù yè", text: "樹葉" }, { pinyin: "，", text: "，" },
        { pinyin: "luò le", text: "落了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Qiū tiān", text: "秋天" }, { pinyin: "，", text: "，" },
        { pinyin: "lái le", text: "來了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Tiān qì", text: "天氣" }, { pinyin: "，", text: "，" },
        { pinyin: "lěng le", text: "冷了" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Kě yú ér hái guāng zhe shēn zi", text: "可魚兒還光着身子" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Zài hé li yóu lái yóu qù", text: "在河裏游來游去" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Tā men zěn me jiù", text: "牠們怎麼就" }
      ],
      [
        { pinyin: "Bú pà zháo liáng", text: "不怕着涼" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Bú huì gǎn mào", text: "不會感冒" }, { pinyin: "？", text: "？" }
      ],
      [
        { pinyin: "É dà gē", text: "鵝大哥" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "É dà gē", text: "鵝大哥" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Hóng mào zi", text: "紅帽子" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Bái lǐng jīn", text: "白領巾" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Yáo yáo bǎi bǎi shàng shān pō", text: "搖搖擺擺上山坡" }, { pinyin: "。", text: "。" }
      ],
      [
        { pinyin: "Qǐng nǐ shù xià zuò yi zuò", text: "請你樹下坐一坐" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Wǒ lái wèn wen nǐ", text: "我來問問你" }, { pinyin: "：", text: "：" }
      ],
      [
        { pinyin: "「", text: "「" }, { pinyin: "É wū", text: "哦嗚" }, { pinyin: "，", text: "，" },
        { pinyin: "é wū", text: "哦嗚" }, { pinyin: "，", text: "，" }
      ],
      [
        { pinyin: "Chàng de shì shén me gē", text: "唱的是甚麼歌" }, { pinyin: "？", text: "？" }, { pinyin: "」", text: "」" }
      ]
    ],
    quiz: [
      { q: "秋天來了，天氣變得怎樣？", ans: "冷了", options: ["冷了", "熱了", "暖了"] },
      { q: "魚兒在河裏怎樣？", ans: "游來游去", options: ["游來游去", "飛來飛去", "跑來跑去"] },
      { q: "鵝大哥戴着什麼？", ans: "紅帽子", options: ["紅帽子", "白帽子", "黃帽子"] },
      { q: "鵝大哥怎樣上山坡？", ans: "搖搖擺擺", options: ["搖搖擺擺", "跑來跑去", "游來游去"] }
    ]
  }
];

type LessonType = typeof LESSONS_DB[0];

export default function ChineseReaderGame() {
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [activeTab, setActiveTab] = useState<"read" | "quiz">("read");
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 🗣️ 標準普通話發聲引擎
  const speak = (text: string, rate: number = 0.75) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // 過濾掉對話標點符號，避免引擎讀出「左引號」、「右引號」等
      const cleanText = text.replace(/[「」]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "zh-CN"; 
      utterance.rate = rate; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSound = (type: "coin" | "bump" | "success") => {
    try { const audio = new Audio(`/${type}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  // 測驗模式邏輯
  const handleAnswer = (selectedAns: string) => {
    if (feedback !== "idle" || !selectedLesson) return;
    
    const currentQ = selectedLesson.quiz[quizIndex];
    if (selectedAns === currentQ.ans) {
      playSound("coin");
      setFeedback("correct");
      setScore(s => s + 1);
      setTimeout(() => {
        if (quizIndex + 1 >= selectedLesson.quiz.length) {
          playSound("success");
          setIsFinished(true);
        } else {
          setQuizIndex(prev => prev + 1);
          setFeedback("idle");
        }
      }, 1500);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  useEffect(() => {
    window.speechSynthesis.cancel();
  }, [activeTab, selectedLesson]);

  // --- 視圖 A：目錄選單 ---
  if (!selectedLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
        <h2 className="text-3xl font-black text-gray-800 mb-8">請選擇課文 📚</h2>
        {/* 排版優化：更新為 lg:grid-cols-4，完美佈局 7 個選項 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {LESSONS_DB.map((lesson) => (
            <motion.button
              key={lesson.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedLesson(lesson);
                setActiveTab("read");
                setIsFinished(false);
                setScore(0);
                setQuizIndex(0);
              }}
              className="py-10 px-6 bg-white border-b-8 border-sky-300 rounded-3xl shadow-md hover:bg-sky-50 flex flex-col items-center gap-4 transition-all"
            >
              <span className="text-6xl">{lesson.emoji}</span>
              <span className="text-2xl font-black text-gray-800 text-center">{lesson.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- 視圖 B：課文與測驗 ---
  return (
    <div className="flex flex-col items-center min-h-[85vh] bg-[#F8FAFC] rounded-3xl p-4 sm:p-8 shadow-inner select-none font-sans overflow-hidden relative">
      
      {/* 頂部導航列 */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => { window.speechSynthesis.cancel(); setSelectedLesson(null); }} 
          className="px-6 py-3 bg-white text-sky-600 font-bold rounded-full shadow-sm border-2 border-sky-200 hover:bg-sky-50 transition-colors"
        >
          🔙 返回目錄
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-8 w-full z-10 mt-16 sm:mt-0">
        <button onClick={() => setActiveTab("read")} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "read" ? "bg-sky-500 text-white shadow-md scale-105" : "bg-white text-sky-600 border-2 border-sky-200"}`}>📖 1. 朗讀課文</button>
        <button onClick={() => { setActiveTab("quiz"); setQuizIndex(0); setScore(0); setIsFinished(false); }} className={`px-6 py-3 rounded-full font-bold text-xl transition-all ${activeTab === "quiz" ? "bg-indigo-500 text-white shadow-md scale-105" : "bg-white text-indigo-600 border-2 border-indigo-200"}`}>🧠 2. 課文理解</button>
      </div>

      {/* 模式 1：朗讀課文 */}
      {activeTab === "read" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col gap-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-black text-gray-800 mb-2">{selectedLesson.title}</h1>
            <p className="text-lg text-gray-500 font-bold">點擊句子，聽聽普通話怎麼讀</p>
          </div>

          {selectedLesson.lines.map((line, index) => {
            const fullText = line.map(segment => segment.text).join("");
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { setActiveLine(index); speak(fullText); }}
                className={`p-6 rounded-3xl border-b-8 shadow-sm transition-all flex flex-wrap items-end gap-x-2 gap-y-6 text-left w-full
                  ${activeLine === index ? "bg-sky-50 border-sky-300 ring-4 ring-sky-200" : "bg-white border-gray-200 hover:bg-gray-50"}
                `}
              >
                {line.map((segment, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-sm sm:text-base text-blue-600 font-mono mb-1 min-h-[24px]">
                      {segment.pinyin !== "，" && segment.pinyin !== "。" && segment.pinyin !== "！" && segment.pinyin !== "？" && segment.pinyin !== "：" && segment.pinyin !== "「" && segment.pinyin !== "」" ? segment.pinyin : ""}
                    </span>
                    <span className="text-3xl sm:text-5xl font-black text-gray-800 tracking-wide">{segment.text}</span>
                  </div>
                ))}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* 模式 2：課文理解 */}
      {activeTab === "quiz" && !isFinished && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-3xl flex flex-col items-center mt-8">
          <div className="bg-white p-8 rounded-3xl border-4 border-indigo-200 shadow-lg w-full text-center mb-8 relative">
            <button onClick={() => speak(selectedLesson.quiz[quizIndex].q)} className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-500 text-white rounded-full text-3xl shadow-md hover:scale-110 transition-transform">🔊</button>
            <h2 className="text-4xl font-black text-gray-800 leading-relaxed">{selectedLesson.quiz[quizIndex].q}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {selectedLesson.quiz[quizIndex].options.sort(() => Math.random() - 0.5).map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                className="py-8 px-4 bg-white border-b-8 border-indigo-200 rounded-3xl text-3xl font-black text-gray-700 hover:bg-indigo-50 shadow-sm"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 通關畫面 */}
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-[120px] mb-4">🏆</span>
            <h1 className="text-5xl font-black text-indigo-600 mb-6">課文完全掌握！</h1>
            <button onClick={() => setActiveTab("read")} className="px-10 py-5 bg-indigo-500 text-white text-2xl font-black rounded-full shadow-[0_8px_0_0_#4338CA] hover:bg-indigo-600 active:translate-y-1 active:shadow-none transition-all">返回朗讀 🚀</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">✅</motion.div>}
        {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">❌</motion.div>}
      </AnimatePresence>
    </div>
  );
}
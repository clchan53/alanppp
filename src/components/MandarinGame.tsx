"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎒 15個關卡普通話大數據庫 (每關 10 題，包含學校與日常生活)
const MANDARIN_GROUPS: Record<number, Array<{ word: string; pinyin: string; jyutping: string; context: string; emoji: string }>> = {
  1: [
    { word: "上課", pinyin: "shàng kè", jyutping: "上堂", context: "課堂開始時", emoji: "🎒" },
    { word: "起立", pinyin: "qǐ lì", jyutping: "企起身", context: "老師進入課室時", emoji: "🧍‍♂️" },
    { word: "請坐下", pinyin: "qǐng zuò xià", jyutping: "坐低", context: "敬禮後", emoji: "🪑" },
    { word: "舉手", pinyin: "jǔ shǒu", jyutping: "舉手", context: "發問或答問題前", emoji: "🙋‍♂️" },
    { word: "安靜", pinyin: "ān jìng", jyutping: "唔好傾偈", context: "老師要求集中注意力時", emoji: "🤫" },
    { word: "排隊", pinyin: "pái duì", jyutping: "排隊", context: "轉換課室或放學時", emoji: "🧑‍🤝‍🧑" },
    { word: "去洗手間", pinyin: "qù xǐ shǒu jiān", jyutping: "去廁所", context: "學生提出如廁要求時", emoji: "🚻" },
    { word: "喝水", pinyin: "hē shuǐ", jyutping: "飲水", context: "小息或口渴時", emoji: "💧" },
    { word: "下課", pinyin: "xià kè", jyutping: "落堂", context: "課堂結束時", emoji: "🔔" },
    { word: "謝謝老師", pinyin: "xiè xie lǎo shī", jyutping: "多謝老師", context: "下課敬禮時", emoji: "🙏" }
  ],
  2: [
    { word: "書包", pinyin: "shū bāo", jyutping: "書包", context: "執書包時", emoji: "🎒" },
    { word: "課本", pinyin: "kè běn", jyutping: "書本", context: "打開書本時", emoji: "📖" },
    { word: "鉛筆", pinyin: "qián bǐ", jyutping: "鉛筆", context: "準備寫字時", emoji: "✏️" },
    { word: "橡皮", pinyin: "xiàng pí", jyutping: "擦膠", context: "擦錯字時", emoji: "🧽" },
    { word: "尺子", pinyin: "chǐ zi", jyutping: "尺", context: "畫直線時", emoji: "📏" },
    { word: "桌子", pinyin: "zhuō zi", jyutping: "枱", context: "擺放物件時", emoji: "🪟" },
    { word: "椅子", pinyin: "yǐ zi", jyutping: "凳", context: "坐好時", emoji: "🪑" },
    { word: "黑板", pinyin: "hēi bǎn", jyutping: "黑板", context: "望住黑板時", emoji: "📋" },
    { word: "筆記本", pinyin: "bǐ jì běn", jyutping: "筆記簿", context: "抄寫記錄時", emoji: "📝" },
    { word: "筆袋", pinyin: "bǐ dài", jyutping: "筆袋", context: "收拾文具時", emoji: "👝" }
  ],
  3: [
    { word: "學校", pinyin: "xué xiào", jyutping: "學校", context: "返學到校時", emoji: "🏫" },
    { word: "課室", pinyin: "kè shì", jyutping: "課室", context: "上堂嘅地方", emoji: "🚪" },
    { word: "操場", pinyin: "cāo chǎng", jyutping: "操場", context: "小息玩耍嘅地方", emoji: "🏟️" },
    { word: "圖書館", pinyin: "tú shū guǎn", jyutping: "圖書館", context: "借書睇書時", emoji: "📚" },
    { word: "小息", pinyin: "xiǎo xī", jyutping: "小息", context: "食茶點休息時", emoji: "🥪" },
    { word: "做運動", pinyin: "zuò yùn dòng", jyutping: "做運動", context: "體育活動時", emoji: "🏃" },
    { word: "聽故事", pinyin: "tīng gù shi", jyutping: "聽故事", context: "老師講故事時", emoji: "🗣️" },
    { word: "做功課", pinyin: "zuò gōng kè", jyutping: "做功課", context: "溫習寫作業時", emoji: "✍️" },
    { word: "校長", pinyin: "xiào zhǎng", jyutping: "校長", context: "見到校長時", emoji: "👨‍🏫" },
    { word: "放學", pinyin: "fàng xué", jyutping: "放學", context: "收拾收拾回家時", emoji: "🏠" }
  ],
  4: [
    { word: "中文課", pinyin: "zhōng wén kè", jyutping: "中文堂", context: "認字讀書時", emoji: "🔤" },
    { word: "英文課", pinyin: "yīng wén kè", jyutping: "英文堂", context: "學英語時", emoji: "🅰️" },
    { word: "數學課", pinyin: "shù xué kè", jyutping: "數學堂", context: "數數目做加減時", emoji: "🔢" },
    { word: "常識課", pinyin: "cháng shí kè", jyutping: "常識堂", context: "學科學探險時", emoji: "🔬" },
    { word: "音樂課", pinyin: "yīn yuè kè", jyutping: "音樂堂", context: "唱歌玩樂器時", emoji: "🎵" },
    { word: "美術課", pinyin: "měi shù kè", jyutping: "畫畫堂", context: "畫畫創作時", emoji: "🎨" },
    { word: "膠水", pinyin: "jiāo shuǐ", jyutping: "膠水", context: "美勞剪貼時", emoji: "🧴" },
    { word: "剪刀", pinyin: "jiǎn dāo", jyutping: "剪刀", context: "做手工時", emoji: "✂️" },
    { word: "蠟筆", pinyin: "là bǐ", jyutping: "蠟筆", context: "塗顏色時", emoji: "🖍️" },
    { word: "白紙", pinyin: "bái zhǐ", jyutping: "白紙", context: "畫畫寫字時", emoji: "📄" }
  ],
  5: [
    { word: "老師好", pinyin: "lǎo shī hǎo", jyutping: "老師好", context: "見到老師打招呼", emoji: "👩‍🏫" },
    { word: "同學們好", pinyin: "tóng xué men hǎo", jyutping: "同學們好", context: "同大家打招呼", emoji: "🧒" },
    { word: "謝謝", pinyin: "xiè xie", jyutping: "多謝 / 唔該", context: "接受別人幫助時", emoji: "🙏" },
    { word: "對不起", pinyin: "duì bu qǐ", jyutping: "對唔住", context: "做錯事情時", emoji: "🙇" },
    { word: "沒關係", pinyin: "méi guān xi", jyutping: "唔緊要", context: "原諒別人時", emoji: "👌" },
    { word: "請幫忙", pinyin: "qǐng bāng mang", jyutping: "請幫忙", context: "需要人協助時", emoji: "🤝" },
    { word: "再見", pinyin: "zài jiàn", jyutping: "拜拜", context: "離校道別時", emoji: "👋" },
    { word: "早上好", pinyin: "zǎo shang hǎo", jyutping: "早晨", context: "朝早返學見到人", emoji: "🌅" },
    { word: "明天見", pinyin: "míng tiān jiàn", jyutping: "明天見", context: "放學同朋友講", emoji: "📅" },
    { word: "請進", pinyin: "qǐng jìn", jyutping: "請入嚟", context: "進入辦公室時", emoji: "🚪" }
  ],
  6: [
    { word: "朗讀", pinyin: "lǎng dú", jyutping: "朗讀", context: "大聲讀出課文時", emoji: "🗣️" },
    { word: "默書", pinyin: "mò shū", jyutping: "默書", context: "老師讀你寫出嚟", emoji: "📝" },
    { word: "背誦", pinyin: "bèi sòng", jyutping: "背書", context: "唔睇書背熟內容", emoji: "🧠" },
    { word: "寫字", pinyin: "xiě zì", jyutping: "寫字", context: "做抄寫功課時", emoji: "✍️" },
    { word: "造句", pinyin: "zào jù", jyutping: "造句", context: "用生字作句說話", emoji: "✏️" },
    { word: "聽寫", pinyin: "tīng xiě", jyutping: "聽寫", context: "聽老師讀音寫字", emoji: "👂" },
    { word: "閱讀", pinyin: "yuè dú", jyutping: "閱讀", context: "睇圖書或課文時", emoji: "📖" },
    { word: "預習", pinyin: "yù xí", jyutping: "預習", context: "上堂前先睇一次", emoji: "🔍" },
    { word: "溫習", pinyin: "wēn xí", jyutping: "溫習", context: "考試前複習所學", emoji: "📚" },
    { word: "改正", pinyin: "gǎi zhèng", jyutping: "改正", context: "寫錯字要更正時", emoji: "❌" }
  ],
  7: [
    { word: "筆畫", pinyin: "bǐ huà", jyutping: "筆畫", context: "學寫字嘅基本", emoji: "🖌️" },
    { word: "筆順", pinyin: "bǐ shùn", jyutping: "筆順", context: "寫字嘅先後次序", emoji: "🔢" },
    { word: "部首", pinyin: "bù shǒu", jyutping: "部首", context: "查字典分類常用", emoji: "🗂️" },
    { word: "漢字", pinyin: "hàn zì", jyutping: "中文字", context: "我哋寫嘅字", emoji: "🀄" },
    { word: "拼音", pinyin: "pīn yīn", jyutping: "拼音", context: "幫助中文字注音", emoji: "🔤" },
    { word: "生字", pinyin: "shēng zì", jyutping: "生字", context: "啱啱學嘅新字", emoji: "🆕" },
    { word: "詞語", pinyin: "cí yǔ", jyutping: "詞語", context: "兩個字加埋嘅詞", emoji: "🔠" },
    { word: "句子", pinyin: "jù zi", jyutping: "句子", context: "完整嘅一句話", emoji: "💬" },
    { word: "段落", pinyin: "duàn luò", jyutping: "段落", context: "幾句話合成一段", emoji: "📄" },
    { word: "課文", pinyin: "kè wén", jyutping: "課文", context: "書本入面嘅文章", emoji: "📑" }
  ],
  8: [
    { word: "逗號", pinyin: "dòu hào", jyutping: "逗號", context: "句子中間停頓 (，)", emoji: "⏸️" },
    { word: "句號", pinyin: "jù hào", jyutping: "句號", context: "句子完結時用 (。)", emoji: "🛑" },
    { word: "問號", pinyin: "wèn hào", jyutping: "問號", context: "問問題時用 (？)", emoji: "❓" },
    { word: "感嘆號", pinyin: "gǎn tàn hào", jyutping: "感嘆號", context: "表達強烈感情 (！)", emoji: "❗" },
    { word: "引號", pinyin: "yǐn hào", jyutping: "引號", context: "標示對話內容 (「」)", emoji: "🗨️" },
    { word: "頓號", pinyin: "dùn hào", jyutping: "頓號", context: "並排詞語中間 (、)", emoji: "🔽" },
    { word: "冒號", pinyin: "mào hào", jyutping: "冒號", context: "準備講話前 (：)", emoji: "🗯️" },
    { word: "書名號", pinyin: "shū míng hào", jyutping: "書名號", context: "寫書名時用 (《》)", emoji: "📕" },
    { word: "省略號", pinyin: "shěng liè hào", jyutping: "省略號", context: "仲有好多未講 (……)", emoji: "💭" },
    { word: "標點", pinyin: "biāo diǎn", jyutping: "標點符號", context: "幫助文章斷句", emoji: "✒️" }
  ],
  9: [
    { word: "太陽", pinyin: "tài yáng", jyutping: "太陽", context: "日頭天上發光", emoji: "☀️" },
    { word: "月亮", pinyin: "yuè liang", jyutping: "月亮", context: "夜晚天上發光", emoji: "🌙" },
    { word: "星星", pinyin: "xīng xing", jyutping: "星星", context: "夜晚天上閃閃發光", emoji: "⭐" },
    { word: "天空", pinyin: "tiān kōng", jyutping: "天空", context: "藍藍嘅天", emoji: "☁️" },
    { word: "白雲", pinyin: "bái yún", jyutping: "白雲", context: "天上白雪雪", emoji: "🌥️" },
    { word: "大樹", pinyin: "dà shù", jyutping: "大樹", context: "公園見到嘅樹", emoji: "🌳" },
    { word: "花朵", pinyin: "huā duǒ", jyutping: "花朵", context: "開得好靚嘅花", emoji: "🌸" },
    { word: "小草", pinyin: "xiǎo cǎo", jyutping: "小草", context: "綠色嘅草地", emoji: "🌿" },
    { word: "石頭", pinyin: "shí tou", jyutping: "石頭", context: "硬邦邦嘅石", emoji: "🪨" },
    { word: "泥土", pinyin: "ní tǔ", jyutping: "泥土", context: "種花用嘅泥", emoji: "🟤" }
  ],
  10: [
    { word: "小鳥", pinyin: "xiǎo niǎo", jyutping: "雀仔", context: "喺天度飛", emoji: "🐦" },
    { word: "小狗", pinyin: "xiǎo gǒu", jyutping: "狗仔", context: "汪汪叫", emoji: "🐶" },
    { word: "小貓", pinyin: "xiǎo māo", jyutping: "貓仔", context: "喵喵叫", emoji: "🐱" },
    { word: "金魚", pinyin: "jīn yú", jyutping: "金魚", context: "喺水度游", emoji: "🐠" },
    { word: "烏龜", pinyin: "wū guī", jyutping: "烏龜", context: "爬得好慢", emoji: "🐢" },
    { word: "父母", pinyin: "fù mǔ", jyutping: "父母", context: "爸爸媽媽", emoji: "👫" },
    { word: "朋友", pinyin: "péng you", jyutping: "朋友", context: "一齊玩嘅人", emoji: "🤝" },
    { word: "男孩", pinyin: "nán hái", jyutping: "男仔", context: "男孩子", emoji: "👦" },
    { word: "女孩", pinyin: "nǚ hái", jyutping: "女仔", context: "女孩子", emoji: "👧" },
    { word: "自己", pinyin: "zì jǐ", jyutping: "自己", context: "我自己", emoji: "🙋" }
  ],
  // 👇 新增的日常生活 5 關 👇
  11: [
    { word: "蘋果", pinyin: "píng guǒ", jyutping: "蘋果", context: "食飯後食水果", emoji: "🍎" },
    { word: "麵包", pinyin: "miàn bāo", jyutping: "麵包", context: "早餐食麵包", emoji: "🍞" },
    { word: "牛奶", pinyin: "niú nǎi", jyutping: "牛奶", context: "飲杯熱牛奶", emoji: "🥛" },
    { word: "雞蛋", pinyin: "jī dàn", jyutping: "雞蛋", context: "煮隻雞蛋食", emoji: "🥚" },
    { word: "米飯", pinyin: "mǐ fàn", jyutping: "白飯", context: "午餐食白飯", emoji: "🍚" },
    { word: "筷子", pinyin: "kuài zi", jyutping: "筷子", context: "用筷子夾餸", emoji: "🥢" },
    { word: "湯匙", pinyin: "tāng chí", jyutping: "湯羹", context: "用湯羹飲湯", emoji: "🥄" },
    { word: "碗", pinyin: "wǎn", jyutping: "碗", context: "裝飯用嘅碗", emoji: "🥣" },
    { word: "水杯", pinyin: "shuǐ bēi", jyutping: "水杯", context: "用水杯飲水", emoji: "🥤" },
    { word: "蔬菜", pinyin: "shū cài", jyutping: "蔬菜", context: "食多啲菜健康啲", emoji: "🥦" }
  ],
  12: [
    { word: "衣服", pinyin: "yī fu", jyutping: "衫", context: "著衫出街", emoji: "👕" },
    { word: "褲子", pinyin: "kù zi", jyutping: "褲", context: "著條長褲", emoji: "👖" },
    { word: "鞋子", pinyin: "xié zi", jyutping: "鞋", context: "著鞋出門", emoji: "👟" },
    { word: "襪子", pinyin: "wà zi", jyutping: "襪", context: "著鞋前要著襪", emoji: "🧦" },
    { word: "外套", pinyin: "wài tào", jyutping: "外套", context: "天冷著外套", emoji: "🧥" },
    { word: "帽子", pinyin: "mào zi", jyutping: "帽", context: "太陽曬戴帽", emoji: "🧢" },
    { word: "雨傘", pinyin: "yǔ sǎn", jyutping: "遮", context: "落雨要擔遮", emoji: "☂️" },
    { word: "裙子", pinyin: "qún zi", jyutping: "裙", context: "靚靚嘅裙", emoji: "👗" },
    { word: "手套", pinyin: "shǒu tào", jyutping: "手套", context: "天冷戴手套", emoji: "🧤" },
    { word: "睡衣", pinyin: "shuì yī", jyutping: "睡衣", context: "瞓覺著睡衣", emoji: "🥼" }
  ],
  13: [
    { word: "巴士", pinyin: "bā shì", jyutping: "巴士", context: "搭巴士返學", emoji: "🚌" },
    { word: "汽車", pinyin: "qì chē", jyutping: "私家車", context: "爸爸揸車", emoji: "🚗" },
    { word: "的士", pinyin: "dí shì", jyutping: "的士", context: "截的士返屋企", emoji: "🚕" },
    { word: "地鐵", pinyin: "dì tiě", jyutping: "地鐵", context: "搭地鐵過海", emoji: "🚇" },
    { word: "火車", pinyin: "huǒ chē", jyutping: "火車", context: "搭火車去旅行", emoji: "🚂" },
    { word: "飛機", pinyin: "fēi jī", jyutping: "飛機", context: "搭飛機去玩", emoji: "✈️" },
    { word: "船", pinyin: "chuán", jyutping: "船", context: "搭船去離島", emoji: "⛴️" },
    { word: "單車", pinyin: "dān chē", jyutping: "單車", context: "去公園踩單車", emoji: "🚲" },
    { word: "馬路", pinyin: "mǎ lù", jyutping: "馬路", context: "過馬路要小心", emoji: "🛣️" },
    { word: "紅綠燈", pinyin: "hóng lǜ dēng", jyutping: "紅綠燈", context: "睇紅綠燈過馬路", emoji: "🚥" }
  ],
  14: [
    { word: "房間", pinyin: "fáng jiān", jyutping: "房", context: "我自己嘅房", emoji: "🏠" },
    { word: "床", pinyin: "chuáng", jyutping: "床", context: "瞓覺嘅床", emoji: "🛏️" },
    { word: "被子", pinyin: "bèi zi", jyutping: "被", context: "凍要蓋被", emoji: "🛌" },
    { word: "枕頭", pinyin: "zhěn tou", jyutping: "枕頭", context: "枕住個頭睡覺", emoji: "😴" },
    { word: "電視", pinyin: "diàn shì", jyutping: "電視", context: "睇電視節目", emoji: "📺" },
    { word: "沙發", pinyin: "shā fā", jyutping: "梳化", context: "坐喺梳化休息", emoji: "🛋️" },
    { word: "冰箱", pinyin: "bīng xiāng", jyutping: "雪櫃", context: "雪糕放雪櫃", emoji: "🧊" },
    { word: "洗手間", pinyin: "xǐ shǒu jiān", jyutping: "洗手間", context: "去廁所洗手", emoji: "🚽" },
    { word: "門", pinyin: "mén", jyutping: "門", context: "出去要開門", emoji: "🚪" },
    { word: "窗戶", pinyin: "chuāng hu", jyutping: "窗", context: "打開窗吹風", emoji: "🪟" }
  ],
  15: [
    { word: "眼睛", pinyin: "yǎn jing", jyutping: "眼睛", context: "睇嘢嘅眼", emoji: "👀" },
    { word: "耳朵", pinyin: "ěr duo", jyutping: "耳仔", context: "聽聲音嘅耳仔", emoji: "👂" },
    { word: "鼻子", pinyin: "bí zi", jyutping: "鼻", context: "索吓氣味嘅鼻", emoji: "👃" },
    { word: "嘴巴", pinyin: "zuǐ ba", jyutping: "嘴", context: "講嘢同食嘢嘅嘴", emoji: "👄" },
    { word: "手", pinyin: "shǒu", jyutping: "手", context: "攞嘢嘅手", emoji: "✋" },
    { word: "腳", pinyin: "jiǎo", jyutping: "腳", context: "行路嘅腳", emoji: "🦶" },
    { word: "跑", pinyin: "pǎo", jyutping: "跑", context: "跑得好快", emoji: "🏃" },
    { word: "跳", pinyin: "tiào", jyutping: "跳", context: "跳得好高", emoji: "🤸" },
    { word: "笑", pinyin: "xiào", jyutping: "笑", context: "開心大笑", emoji: "😁" },
    { word: "哭", pinyin: "kū", jyutping: "喊", context: "傷心喊出嚟", emoji: "😭" }
  ]
};

const ALL_ITEMS = Object.values(MANDARIN_GROUPS).flat();

const LEVEL_TITLES = [
  "第一關：課堂指令 📢",
  "第二關：課室物件 ✏️",
  "第三關：校園生活 🏫",
  "第四關：學科文具 🎨",
  "第五關：禮貌社交 🤝",
  "第六關：中文任務 📚",
  "第七關：基礎概念 🀄",
  "第八關：標點符號 ✒️",
  "第九關：自然詞彙 🌳",
  "第十關：人物動物 🐶",
  "第十一關：食物餐具 🍎",
  "第十二關：衣服穿著 👕",
  "第十三關：交通工具 🚌",
  "第十四關：家居房間 🏠",
  "第十五關：身體動作 👀"
];

const PRAISES = [
  "太棒了！你已經準備好上小學啦！🎉",
  "非常厲害！普通話說得真好！🏆",
  "一百分！這一關完全難不倒你！⭐"
];

type CommandItem = typeof ALL_ITEMS[0];

export default function MandarinGame() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // 挑戰模式狀態
  const [quizPool, setQuizPool] = useState<CommandItem[]>([]);
  const [target, setTarget] = useState<CommandItem | null>(null);
  const [options, setOptions] = useState<CommandItem[]>([]);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");

  const playSound = (type: "coin" | "bump" | "success") => {
    try { const audio = new Audio(`/${type}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  const speakMandarin = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN"; 
      utterance.rate = 0.8;     
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateQuestion = (currentPool: CommandItem[], currentIndex: number) => {
    if (currentIndex >= 10) {
      playSound("success");
      setPraiseText(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
      setIsFinished(true);
      return;
    }

    const currentTarget = currentPool[currentIndex];
    const wrongOptions = ALL_ITEMS
      .filter((w) => w.word !== currentTarget.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const finalOptions = [currentTarget, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setTarget(currentTarget);
    setOptions(finalOptions);
    setFeedback("idle");
    
    setTimeout(() => speakMandarin(currentTarget.word), 400);
  };

  const handleStartLevel = (groupId: number) => {
    const groupWords = MANDARIN_GROUPS[groupId];
    const shuffled = [...groupWords].sort(() => Math.random() - 0.5); 
    
    setSelectedGroup(groupId);
    setQuizPool(shuffled);
    setScore(0);
    setQIndex(0);
    setIsFinished(false);
    setFeedback("idle");
    generateQuestion(shuffled, 0);
  };

  const handleSelect = (selectedItem: CommandItem) => {
    if (feedback !== "idle" || !target) return;

    if (selectedItem.word === target.word) {
      playSound("coin");
      setFeedback("correct");
      setScore((prev) => prev + 1);
      
      setTimeout(() => {
        const nextIndex = qIndex + 1;
        setQIndex(nextIndex);
        generateQuestion(quizPool, nextIndex);
      }, 1500);

    } else {
      playSound("bump");
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  if (selectedGroup === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#FFF7ED] rounded-3xl p-6 shadow-inner relative select-none">
        <h2 className="text-4xl font-black text-orange-700 mb-8 tracking-wide">小一普通話大冒險 🗺️</h2>
        {/* 排版已優化為 lg:grid-cols-5，方便顯示 15 個關卡 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
          {LEVEL_TITLES.map((title, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartLevel(index + 1)}
              className="py-6 px-3 bg-white text-orange-700 border-b-8 border-orange-300 shadow-md font-black text-lg sm:text-xl rounded-3xl hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2"
            >
              <span className="text-center">{title}</span>
              <span className="text-sm font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">10 題挑戰</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] bg-[#FFF7ED] rounded-3xl p-4 sm:p-8 shadow-inner select-none overflow-hidden relative font-sans">
      
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => { window.speechSynthesis.cancel(); setSelectedGroup(null); }} 
          className="px-6 py-3 bg-white text-orange-600 font-bold rounded-full shadow-sm border-2 border-orange-200 hover:bg-orange-50 transition-colors"
        >
          🔙 返回目錄
        </button>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-orange-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-3xl font-extrabold text-orange-600 font-mono tracking-tighter">{score} / 10</span>
      </div>

      {target && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl flex flex-col items-center mt-16 sm:mt-0">
          
          <h2 className="text-3xl font-black text-orange-700 mb-2 tracking-wide mt-4">{LEVEL_TITLES[selectedGroup - 1]}</h2>

          {!isFinished && (
            <div className="w-full max-w-sm mx-auto bg-orange-100 rounded-full h-3 mb-6 relative overflow-hidden border border-orange-200">
              <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${(qIndex / 10) * 100}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-orange-900 drop-shadow-sm">進度：{qIndex + 1} / 10</span>
            </div>
          )}

          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => speakMandarin(target.word)}
              className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-5xl shadow-[0_8px_0_0_#C2410C] active:translate-y-2 active:shadow-none transition-all mx-auto mb-4"
            >
              🔊
            </motion.button>
            
            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-orange-200 inline-block shadow-sm">
              <p className="text-lg font-bold text-orange-800">💡 提示情境：{target.context}</p>
              <p className="text-sm font-bold text-gray-400 mt-1">(廣東話意思：{target.jyutping})</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl px-2">
            {options.map((item, index) => (
              <motion.button
                key={`${item.word}-${index}`}
                animate={feedback === "wrong" && item.word !== target.word ? { x: [-10, 10, -10, 10, 0] } : {}}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(item)}
                className="py-6 px-4 bg-white text-gray-800 rounded-3xl border-b-8 border-orange-200 hover:bg-orange-50 active:border-b-4 active:translate-y-1 transition-all shadow-md flex flex-col items-center justify-center gap-2"
              >
                <span className="text-5xl drop-shadow-sm">{item.emoji}</span>
                <span className="text-2xl sm:text-3xl font-black">{item.word}</span>
                <span className="text-sm font-bold text-orange-500 font-mono bg-orange-50 px-2 py-0.5 rounded-md">{item.pinyin}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🎖️</motion.div>
                <h1 className="text-5xl sm:text-6xl font-black text-orange-500 mb-6">通關大成功！</h1>
                <p className="text-3xl font-extrabold text-orange-600 mb-10 max-w-md leading-relaxed">{praiseText}</p>
                <div className="flex gap-4">
                  <button onClick={() => setSelectedGroup(null)} className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-black rounded-full shadow-md hover:bg-gray-300">返回大堂</button>
                  <button onClick={() => handleStartLevel(selectedGroup)} className="px-8 py-4 bg-orange-500 text-white text-xl font-black rounded-full shadow-[0_6px_0_0_#C2410C] hover:bg-orange-600 active:translate-y-1 active:shadow-none">再挑戰一次 🚀</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">✅</motion.div>}
            {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute inset-0 m-auto w-32 h-32 text-[100px] z-20 flex items-center justify-center pointer-events-none">❌</motion.div>}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}
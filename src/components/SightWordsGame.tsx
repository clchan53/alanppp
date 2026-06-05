"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. 生字庫分組 (1st to 10th 100 Words) ---
const RAW_GROUPS: Record<number, string[]> = {
  1: ["a", "about", "all", "an", "and", "are", "as", "at", "be", "been", "but", "by", "called", "can", "come", "could", "day", "did", "do", "down", "each", "find", "first", "for", "from", "get", "go", "had", "has", "have", "he", "her", "him", "his", "how", "I", "if", "in", "into", "is", "it", "like", "long", "look", "made", "make", "many", "may", "more", "my", "no", "not", "now", "number", "of", "oil", "on", "one", "or", "other", "out", "part", "people", "said", "see", "she", "sit", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "time", "to", "two", "up", "use", "was", "water", "way", "we", "were", "what", "when", "which", "who", "will", "with", "words", "would", "write", "you", "your"],
  2: ["after", "again", "air", "also", "America", "animal", "another", "answer", "any", "around", "ask", "away", "back", "because", "before", "big", "boy", "came", "change", "different", "does", "end", "even", "follow", "form", "found", "give", "good", "great", "hand", "help", "here", "home", "house", "just", "kind", "know", "land", "large", "learn", "letter", "line", "little", "live", "man", "me", "means", "men", "most", "mother", "move", "much", "must", "name", "need", "new", "off", "old", "only", "our", "over", "page", "picture", "place", "play", "point", "put", "read", "right", "same", "say", "sentence", "set", "should", "show", "small", "sound", "spell", "still", "study", "such", "take", "tell", "things", "think", "three", "through", "too", "try", "turn", "us", "very", "want", "well", "went", "where", "why", "work", "world", "years"],
  3: ["above", "add", "almost", "along", "always", "began", "begin", "being", "below", "between", "book", "both", "car", "carry", "children", "city", "close", "country", "cut", "don’t", "earth", "eat", "enough", "every", "example", "eyes", "face", "family", "far", "father", "feet", "few", "food", "four", "girl", "got", "group", "grow", "hard", "head", "hear", "high", "idea", "important", "Indian", "it’s", "keep", "last", "late", "leave", "left", "let", "life", "light", "list", "might", "mile", "miss", "mountains", "near", "never", "next", "night", "often", "once", "open", "own", "paper", "plant", "real", "river", "run", "saw", "school", "sea", "second", "seem", "side", "something", "sometimes", "song", "soon", "start", "state", "stop", "story", "talk", "those", "thought", "together", "took", "tree", "under", "until", "walk", "watch", "while", "white", "without", "young"],
  4: ["across", "against", "area", "become", "best", "better", "birds", "black", "body", "certain", "cold", "color", "complete", "covered", "cried", "didn’t", "dog", "door", "draw", "during", "early", "easy", "ever", "fall", "farm", "fast", "field", "figure", "fire", "fish", "five", "friends", "ground", "happened", "heard", "himself", "hold", "horse", "hours", "however", "hundred", "I’ll", "king", "knew", "listen", "low", "map", "mark", "measure", "money", "morning", "music", "north", "notice", "numeral", "order", "passed", "pattern", "piece", "plan", "problem", "products", "pulled", "questions", "reached", "red", "remember", "rock", "room", "seen", "several", "ship", "short", "since", "sing", "slowly", "south", "space", "stand", "step", "sun", "sure", "table", "today", "told", "top", "toward", "town", "travel", "true", "unit", "upon", "usually", "voice", "vowel", "war", "waves", "whole", "wind", "wood"],
  5: ["able", "ago", "am", "among", "ball", "base", "became", "behind", "boat", "box", "bring", "brought", "building", "built", "cannot", "carefully", "check", "circle", "class", "clear", "common", "contain", "correct", "course", "dark", "decided", "deep", "done", "dry", "English", "equation", "explain", "fact", "feel", "filled", "finally", "fine", "fly", "force", "front", "full", "game", "gave", "government", "green", "half", "heat", "heavy", "hot", "inches", "include", "inside", "island", "known", "language", "less", "machine", "material", "minutes", "note", "nothing", "noun", "object", "ocean", "oh", "pair", "person", "plane", "power", "produce", "quickly", "ran", "rest", "road", "round", "rule", "scientists", "shape", "shown", "six", "size", "special", "stars", "stay", "stood", "street", "strong", "surface", "system", "ten", "though", "thousands", "understand", "verb", "wait", "warm", "week", "wheels", "yes", "yet"],
  6: ["anything", "arms", "beautiful", "believe", "beside", "bill", "blue", "brother", "can’t", "cause", "cells", "center", "clothes", "dance", "describe", "developed", "difference", "direction", "discovered", "distance", "divided", "drive", "drop", "edge", "eggs", "energy", "Europe", "exercise", "farmers", "felt", "finished", "flowers", "forest", "general", "gone", "grass", "happy", "heart", "held", "instruments", "interest", "job", "kept", "lay", "legs", "length", "love", "main", "matter", "meet", "members", "million", "mind", "months", "moon", "paint", "paragraph", "past", "perhaps", "picked", "present", "probably", "race", "rain", "raised", "ready", "reason", "record", "region", "represent", "return", "root", "sat", "shall", "sign", "simple", "site", "sky", "soft", "square", "store", "subject", "suddenly", "sum", "summer", "syllables", "teacher", "test", "third", "train", "wall", "weather", "west", "whether", "wide", "wild", "window", "winter", "wish", "written"],
  7: ["act", "Africa", "age", "already", "although", "amount", "angle", "appear", "baby", "bear", "beat", "bed", "bottom", "bright", "broken", "build", "buy", "care", "case", "cat", "century", "consonant", "copy", "couldn’t", "count", "cross", "dictionary", "died", "dress", "either", "everyone", "everything", "exactly", "factors", "fight", "fingers", "floor", "fraction", "free", "French", "gold", "hair", "hill", "hole", "hope", "ice", "instead", "iron", "jumped", "killed", "lake", "laughed", "lead", "let’s", "lot", "melody", "metal", "method", "middle", "milk", "moment", "nation", "natural", "outside", "per", "phrase", "poor", "possible", "pounds", "pushed", "quiet", "quite", "remain", "result", "ride", "rolled", "sail", "scale", "section", "sleep", "smiled", "snow", "soil", "solve", "someone", "son", "speak", "speed", "spring", "stone", "surprise", "tall", "temperature", "themselves", "tiny", "trip", "type", "village", "within", "wonder"],
  8: ["alone", "art", "bad", "bank", "bit", "break", "brown", "burning", "business", "captain", "catch", "caught", "cents", "child", "choose", "clean", "climbed", "cloud", "coast", "continued", "control", "cool", "cost", "decimal", "desert", "design", "direct", "drawing", "ears", "east", "else", "engine", "England", "equal", "experiment", "express", "feeling", "fell", "flow", "foot", "garden", "gas", "glass", "God", "grew", "history", "human", "hunting", "increase", "information", "itself", "joined", "key", "lady", "law", "least", "lost", "maybe", "mouth", "party", "pay", "period", "plains", "please", "practice", "president", "received", "report", "ring", "rise", "row", "save", "seeds", "sent", "separate", "serve", "shouted", "single", "skin", "statement", "stick", "straight", "strange", "students", "suppose", "symbols", "team", "touch", "trouble", "uncle", "valley", "visit", "wear", "whose", "wire", "woman", "wrote", "yard", "you’re", "yourself"],
  9: ["addition", "army", "bell", "belong", "block", "blood", "blow", "board", "bones", "branches", "cattle", "chief", "compare", "compound", "consider", "cook", "corner", "crops", "crowd", "current", "doctor", "dollars", "eight", "electric", "elements", "enjoy", "entered", "except", "exciting", "expect", "famous", "fit", "flat", "fruit", "fun", "guess", "hat", "hit", "indicate", "industry", "insects", "interesting", "Japanese", "lie", "lifted", "loud", "major", "mall", "meat", "mine", "modern", "movement", "necessary", "observe", "park", "particular", "planets", "poem", "pole", "position", "process", "property", "provide", "rather", "rhythm", "rich", "safe", "sand", "science", "sell", "send", "sense", "seven", "sharp", "shoulder", "sight", "silent", "soldiers", "spot", "spread", "stream", "string", "suggested", "supply", "swim", "terms", "thick", "thin", "thus", "tied", "tone", "trade", "tube", "value", "wash", "wasn’t", "weight", "wife", "wings", "won’t"],
  10: ["action", "actually", "adjective", "afraid", "agreed", "ahead", "allow", "apple", "arrived", "born", "bought", "British", "capital", "chance", "chart", "church", "column", "company", "conditions", "corn", "cotton", "cows", "create", "dead", "deal", "death", "details", "determine", "difficult", "division", "doesn’t", "effect", "entire", "especially", "evening", "experience", "factories", "fair", "fear", "fig", "forward", "France", "fresh", "Greek", "gun", "hoe", "huge", "isn’t", "led", "level", "located", "march", "match", "molecules", "northern", "nose", "office", "opposite", "oxygen", "plural", "prepared", "pretty", "printed", "radio", "repeated", "rope", "rose", "score", "seat", "settled", "shoes", "shop", "similar", "sir", "sister", "smell", "solution", "southern", "steel", "stretched", "substances", "suffix", "sugar", "tools", "total", "track", "triangle", "truck", "underline", "various", "view", "Washington"]
};

// --- 2. 翻譯字典 (你可以隨時喺度加返中文意思) ---
const DICTIONARY: Record<string, string> = {
  // 1st 100 Words
  "a": "一個", "about": "關於 / 大約", "all": "全部", "an": "一個", "and": "和 / 同埋", 
  "are": "是 / 係", "as": "如同", "at": "在 / 喺", "be": "是 / 成為", "been": "已經", 
  "but": "但是", "by": "被 / 在...旁邊", "called": "叫做", "can": "可以 / 識", "come": "過嚟", 
  "could": "能夠", "day": "日子", "did": "做咗", "do": "做", "down": "向下", 
  "each": "每一個", "find": "搵到", "first": "第一", "for": "為了 / 給", "from": "來自", 
  "get": "得到 / 攞到", "go": "去", "had": "有 (過去式)", "has": "有 (佢用)", "have": "有", 
  "he": "他 (男)", "her": "她 / 她的", "him": "他", "his": "他的", "how": "點樣", 
  "I": "我", "if": "如果", "in": "在...入面", "into": "進入", "is": "是 / 係", 
  "it": "它 / 牠", "like": "鍾意", "long": "長", "look": "望 / 睇", "made": "製造 (過去式)", 
  "make": "製造", "many": "好多", "may": "可以", "more": "更多", "my": "我的", 
  "no": "不 / 無", "not": "不是 / 無", "now": "依家", "number": "數字", "of": "的", 
  "oil": "油", "on": "在...上面", "one": "一", "or": "或者", "other": "其他", 
  "out": "出面", "part": "部分", "people": "人", "said": "講咗", "see": "睇到", 
  "she": "她 (女)", "sit": "坐", "so": "所以", "some": "一些", "than": "比", 
  "that": "那個", "the": "這 / 那", "their": "他們的", "them": "他們", "then": "然後", 
  "there": "嗰度", "these": "這些", "they": "他們", "this": "這個", "time": "時間", 
  "to": "去 / 到", "two": "二", "up": "向上", "use": "使用", "was": "是 (過去式)", 
  "water": "水", "way": "方法 / 路", "we": "我們", "were": "是 (過去式)", "what": "甚麼 / 咩", 
  "when": "幾時", "which": "邊個", "who": "誰 / 邊個", "will": "將會", "with": "同埋", 
  "words": "字", "would": "會 / 想", "write": "寫", "you": "你", "your": "你的",

  // 2nd 100 Words
  "after": "之後", "again": "再一次", "air": "空氣", "also": "也 / 都", "America": "美國", 
  "animal": "動物", "another": "另一個", "answer": "答案 / 回答", "any": "任何", "around": "周圍", 
  "ask": "問", "away": "離開", "back": "後面 / 返去", "because": "因為", "before": "之前", 
  "big": "大", "boy": "男仔", "came": "嚟咗", "change": "改變", "different": "唔同", 
  "does": "做 (佢用)", "end": "結束", "even": "甚至", "follow": "跟住", "form": "形成 / 表格", 
  "found": "搵到 (過去式)", "give": "畀", "good": "好", "great": "好棒 / 偉大", "hand": "手", 
  "help": "幫忙", "here": "呢度", "home": "屋企", "house": "屋", "just": "剛剛 / 只係", 
  "kind": "種類 / 善良", "know": "知道 / 識得", "land": "土地", "large": "大", "learn": "學習", 
  "letter": "信 / 字母", "line": "線 / 排隊", "little": "小", "live": "住 / 生活", "man": "男人", 
  "me": "我", "means": "意思係", "men": "男人 (眾數)", "most": "最多 / 大部分", "mother": "媽媽", 
  "move": "郁動 / 搬", "much": "好多", "must": "必須", "name": "名", "need": "需要", 
  "new": "新", "off": "關閉 / 離開", "old": "舊 / 老", "only": "只有", "our": "我們的", 
  "over": "結束 / 越過", "page": "頁", "picture": "圖畫", "place": "地方", "play": "玩", 
  "point": "指住 / 分數", "put": "放", "read": "閱讀", "right": "右邊 / 正確", "same": "一樣", 
  "say": "講", "sentence": "句子", "set": "設定 / 一套", "should": "應該", "show": "展示 / 表演", 
  "small": "細小", "sound": "聲音", "spell": "拼字", "still": "仍然", "study": "溫習", 
  "such": "如此", "take": "攞", "tell": "話畀...知", "things": "嘢 / 事物", "think": "諗", 
  "three": "三", "through": "穿過", "too": "太 / 都", "try": "嘗試", "turn": "轉", 
  "us": "我們", "very": "非常", "want": "想要", "well": "好 / 井", "went": "去咗", 
  "where": "邊度", "why": "點解", "work": "工作", "world": "世界", "years": "年",
  
  // 3rd 100 Words
  "above": "上面", "add": "加", "almost": "幾乎 / 差唔多", "along": "沿著", "always": "經常 / 總是",
  "began": "開始咗", "begin": "開始", "being": "存在 / 成為", "below": "下面", "between": "之間",
  "book": "書", "both": "兩個都", "car": "車", "carry": "拎住 / 搬", "children": "小朋友",
  "city": "城市", "close": "關閉 / 近", "country": "國家 / 鄉下", "cut": "切 / 剪", "don’t": "唔好 / 不",
  "earth": "地球 / 泥土", "eat": "食", "enough": "足夠", "every": "每一個", "example": "例子",
  "eyes": "眼睛", "face": "面", "family": "家庭", "far": "遠", "father": "爸爸",
  "feet": "腳", "few": "少數", "food": "食物", "four": "四", "girl": "女仔",
  "got": "得到咗", "group": "組別", "grow": "成長 / 種植", "hard": "硬 / 困難", "head": "頭",
  "hear": "聽", "high": "高", "idea": "主意", "important": "重要", "Indian": "印第安人 / 印度人",
  "it’s": "它是 / 牠是", "keep": "保持 / 保留", "last": "最後 / 上次", "late": "遲", "leave": "離開",
  "left": "左邊 / 留下", "let": "讓", "life": "生活 / 生命", "light": "光 / 輕", "list": "名單",
  "might": "可能", "mile": "英里", "miss": "錯過 / 想念", "mountains": "山", "near": "附近",
  "never": "從來唔", "next": "下一個", "night": "夜晚", "often": "經常", "once": "一次",
  "open": "打開", "own": "擁有 / 自己嘅", "paper": "紙", "plant": "植物", "real": "真實",
  "river": "河", "run": "跑", "saw": "睇到 / 鋸", "school": "學校", "sea": "海",
  "second": "第二 / 秒", "seem": "似乎", "side": "旁邊 / 面", "something": "某啲嘢", "sometimes": "有時候",
  "song": "歌", "soon": "好快", "start": "開始", "state": "州 / 狀態", "stop": "停止",
  "story": "故事", "talk": "講嘢", "those": "嗰啲", "thought": "諗法 / 諗過", "together": "一齊",
  "took": "攞咗", "tree": "樹", "under": "下面", "until": "直到", "walk": "行路",
  "watch": "手錶 / 觀看", "while": "當...嘅時候", "white": "白色", "without": "無", "young": "年輕",

  // 4th 100 Words
  "across": "穿過", "against": "反對 / 靠住", "area": "區域", "become": "變成", "best": "最好",
  "better": "更好", "birds": "雀仔", "black": "黑色", "body": "身體", "certain": "肯定 / 某啲",
  "cold": "凍", "color": "顏色", "complete": "完成", "covered": "覆蓋咗", "cried": "喊咗",
  "didn’t": "無做 / 沒有", "dog": "狗", "door": "門", "draw": "畫畫", "during": "喺...期間",
  "early": "早", "easy": "容易", "ever": "曾經", "fall": "跌倒 / 秋天", "farm": "農場",
  "fast": "快", "field": "田野", "figure": "數字 / 身形", "fire": "火", "fish": "魚",
  "five": "五", "friends": "朋友", "ground": "地面", "happened": "發生咗", "heard": "聽到咗",
  "himself": "他自己", "hold": "揸住", "horse": "馬", "hours": "小時 / 鐘頭", "however": "不過",
  "hundred": "一百", "I’ll": "我會", "king": "國王", "knew": "知道咗", "listen": "聽",
  "low": "低", "map": "地圖", "mark": "標記", "measure": "量度", "money": "錢",
  "morning": "朝早", "music": "音樂", "north": "北", "notice": "留意", "numeral": "數字",
  "order": "命令 / 訂購", "passed": "經過咗", "pattern": "圖案", "piece": "一塊", "plan": "計劃",
  "problem": "問題", "products": "產品", "pulled": "拉咗", "questions": "問題", "reached": "到達咗",
  "red": "紅色", "remember": "記得", "rock": "石頭", "room": "房間", "seen": "睇過",
  "several": "幾個", "ship": "船", "short": "短 / 矮", "since": "自從", "sing": "唱歌",
  "slowly": "慢慢地", "south": "南", "space": "空間 / 太空", "stand": "企", "step": "腳步",
  "sun": "太陽", "sure": "肯定", "table": "枱", "today": "今日", "told": "話咗",
  "top": "頂部", "toward": "向住", "town": "城鎮", "travel": "旅行", "true": "真實",
  "unit": "單位", "upon": "喺...上面", "usually": "通常", "voice": "聲音", "vowel": "元音",
  "war": "戰爭", "waves": "波浪", "whole": "整個", "wind": "風", "wood": "木頭",

  // 5th 100 Words
  "able": "能夠", "ago": "以前", "am": "是 (我用)", "among": "喺...之中", "ball": "波",
  "base": "基礎 / 底部", "became": "變成咗", "behind": "後面", "boat": "船", "box": "盒",
  "bring": "帶嚟", "brought": "帶咗嚟", "building": "建築物", "built": "起好咗", "cannot": "唔可以",
  "carefully": "小心地", "check": "檢查", "circle": "圓形", "class": "班級", "clear": "清楚",
  "common": "常見", "contain": "包含", "correct": "正確", "course": "課程 / 路線", "dark": "黑暗",
  "decided": "決定咗", "deep": "深", "done": "做完", "dry": "乾", "English": "英文",
  "equation": "方程式", "explain": "解釋", "fact": "事實", "feel": "感覺", "filled": "裝滿咗",
  "finally": "最後", "fine": "好 / 幼細", "fly": "飛", "force": "力量 / 強迫", "front": "前面",
  "full": "滿", "game": "遊戲", "gave": "畀咗", "government": "政府", "green": "綠色",
  "half": "一半", "heat": "熱力", "heavy": "重", "hot": "熱", "inches": "英寸",
  "include": "包括", "inside": "入面", "island": "島嶼", "known": "出名 / 已知", "language": "語言",
  "less": "較少", "machine": "機器", "material": "物料", "minutes": "分鐘", "note": "筆記 / 音符",
  "nothing": "無嘢", "noun": "名詞", "object": "物件", "ocean": "海洋", "oh": "哦",
  "pair": "一對", "person": "人", "plane": "飛機", "power": "力量", "produce": "生產",
  "quickly": "快啲", "ran": "跑咗", "rest": "休息 / 其餘", "road": "路", "round": "圓形",
  "rule": "規則", "scientists": "科學家", "shape": "形狀", "shown": "展示過", "six": "六",
  "size": "尺寸", "special": "特別", "stars": "星星", "stay": "逗留", "stood": "企咗",
  "street": "街道", "strong": "強壯", "surface": "表面", "system": "系統", "ten": "十",
  "though": "雖然", "thousands": "數以千計", "understand": "明白", "verb": "動詞", "wait": "等候",
  "warm": "溫暖", "week": "星期", "wheels": "車輪", "yes": "係", "yet": "仲未",

// 6th 100 Words
  "anything": "任何嘢", "arms": "手臂", "beautiful": "靚 / 美麗", "believe": "相信", "beside": "喺...旁邊",
  "bill": "帳單", "blue": "藍色", "brother": "兄弟", "can’t": "唔可以", "cause": "原因 / 導致",
  "cells": "細胞", "center": "中心", "clothes": "衫 / 衣服", "dance": "跳舞", "describe": "形容",
  "developed": "發展咗", "difference": "分別", "direction": "方向", "discovered": "發現咗", "distance": "距離",
  "divided": "分開 / 除", "drive": "揸車", "drop": "跌落", "edge": "邊緣", "eggs": "雞蛋",
  "energy": "能量", "Europe": "歐洲", "exercise": "做運動", "farmers": "農夫", "felt": "感覺到",
  "finished": "完成咗", "flowers": "花", "forest": "森林", "general": "一般 / 將軍", "gone": "唔見咗 / 走咗",
  "grass": "草", "happy": "開心", "heart": "心", "held": "捉住咗", "instruments": "樂器",
  "interest": "興趣", "job": "工作", "kept": "保持咗", "lay": "躺下 / 放", "legs": "腳 / 腿",
  "length": "長度", "love": "愛", "main": "主要", "matter": "事情 / 物質", "meet": "見面",
  "members": "成員", "million": "一百萬", "mind": "頭腦 / 介意", "months": "月份", "moon": "月亮",
  "paint": "畫畫 / 油漆", "paragraph": "段落", "past": "過去", "perhaps": "或者", "picked": "揀咗 / 摘咗",
  "present": "禮物 / 現在", "probably": "可能", "race": "比賽", "rain": "雨", "raised": "舉起咗 / 養大咗",
  "ready": "準備好", "reason": "理由", "record": "記錄", "region": "地區", "represent": "代表",
  "return": "返去 / 退還", "root": "樹根", "sat": "坐低咗", "shall": "將會", "sign": "標誌 / 簽名",
  "simple": "簡單", "site": "地點", "sky": "天空", "soft": "柔軟", "square": "正方形",
  "store": "商店", "subject": "科目", "suddenly": "突然", "sum": "總數", "summer": "夏天",
  "syllables": "音節", "teacher": "老師", "test": "測驗", "third": "第三", "train": "火車 / 訓練",
  "wall": "牆壁", "weather": "天氣", "west": "西", "whether": "是否", "wide": "闊",
  "wild": "野生", "window": "窗戶", "winter": "冬天", "wish": "願望 / 希望", "written": "寫低咗嘅",

  // 7th 100 Words
  "act": "行動 / 表演", "Africa": "非洲", "age": "年紀", "already": "已經", "although": "雖然",
  "amount": "數量", "angle": "角度", "appear": "出現", "baby": "BB / 嬰兒", "bear": "熊",
  "beat": "打 / 擊敗", "bed": "床", "bottom": "底部", "bright": "光猛 / 聰明", "broken": "爛咗",
  "build": "建立 / 建築", "buy": "買", "care": "關心 / 照顧", "case": "盒子 / 案件", "cat": "貓",
  "century": "世紀", "consonant": "子音", "copy": "抄寫 / 複製", "couldn’t": "不能夠", "count": "數數目",
  "cross": "交叉 / 過馬路", "dictionary": "字典", "died": "死咗", "dress": "裙 / 著衫", "either": "或者 / 也不",
  "everyone": "每個人", "everything": "每樣嘢", "exactly": "準確地", "factors": "因素", "fight": "打架",
  "fingers": "手指", "floor": "地板 / 樓層", "fraction": "分數", "free": "自由 / 免費", "French": "法國的 / 法文",
  "gold": "金", "hair": "頭髮", "hill": "山丘", "hole": "窿 / 洞", "hope": "希望",
  "ice": "冰", "instead": "代替", "iron": "鐵 / 熨斗", "jumped": "跳咗", "killed": "殺死咗",
  "lake": "湖", "laughed": "笑咗", "lead": "帶領", "let’s": "我哋一齊", "lot": "許多",
  "melody": "旋律", "metal": "金屬", "method": "方法", "middle": "中間", "milk": "牛奶",
  "moment": "片刻", "nation": "國家", "natural": "自然", "outside": "出面", "per": "每一",
  "phrase": "短語", "poor": "窮 / 可憐", "possible": "可能", "pounds": "磅", "pushed": "推咗",
  "quiet": "安靜", "quite": "十分 / 幾", "remain": "剩下 / 保持", "result": "結果", "ride": "騎 / 搭車",
  "rolled": "滾動咗", "sail": "航行", "scale": "磅 / 規模", "section": "部分", "sleep": "瞓覺",
  "smiled": "微笑咗", "snow": "雪", "soil": "泥土", "solve": "解決", "someone": "某人",
  "son": "兒子", "speak": "講嘢", "speed": "速度", "spring": "春天 / 彈簧", "stone": "石頭",
  "surprise": "驚喜", "tall": "高", "temperature": "溫度", "themselves": "他們自己", "tiny": "極小",
  "trip": "旅行", "type": "種類 / 打字", "village": "村莊", "within": "在...之內", "wonder": "想知道 / 奇蹟",

  // 8th 100 Words
  "alone": "單獨", "art": "藝術", "bad": "壞", "bank": "銀行", "bit": "少許",
  "break": "打破 / 休息", "brown": "啡色", "burning": "燃燒緊", "business": "生意 / 商業", "captain": "隊長 / 船長",
  "catch": "捉住", "caught": "捉到咗", "cents": "仙 / 分", "child": "小童", "choose": "選擇",
  "clean": "乾淨 / 清潔", "climbed": "爬咗", "cloud": "雲", "coast": "海岸", "continued": "繼續咗",
  "control": "控制", "cool": "型 / 涼爽", "cost": "價值 / 花費", "decimal": "小數", "desert": "沙漠",
  "design": "設計", "direct": "直接", "drawing": "畫畫 / 圖畫", "ears": "耳朵", "east": "東",
  "else": "其他", "engine": "引擎", "England": "英國", "equal": "相等", "experiment": "實驗",
  "express": "表達 / 特快", "feeling": "感覺", "fell": "跌倒咗", "flow": "流動", "foot": "腳 / 英尺",
  "garden": "花園", "gas": "氣體 / 煤氣", "glass": "玻璃", "God": "神", "grew": "長大咗",
  "history": "歷史", "human": "人類", "hunting": "打獵", "increase": "增加", "information": "資訊",
  "itself": "它自己", "joined": "加入咗", "key": "鎖匙 / 關鍵", "lady": "女士", "law": "法律",
  "least": "最少", "lost": "唔見咗 / 輸咗", "maybe": "可能", "mouth": "嘴巴", "party": "派對",
  "pay": "付款", "period": "時期 / 句號", "plains": "平原", "please": "請", "practice": "練習",
  "president": "總統 / 主席", "received": "收到咗", "report": "報告", "ring": "戒指 / 響", "rise": "升起",
  "row": "划船 / 一排", "save": "拯救 / 儲蓄", "seeds": "種子", "sent": "寄出咗", "separate": "分開",
  "serve": "服務", "shouted": "大叫咗", "single": "單一", "skin": "皮膚", "statement": "聲明",
  "stick": "樹枝 / 黏住", "straight": "直", "strange": "奇怪", "students": "學生", "suppose": "假設",
  "symbols": "符號", "team": "隊伍", "touch": "觸摸", "trouble": "麻煩", "uncle": "叔叔 / 舅父",
  "valley": "山谷", "visit": "拜訪", "wear": "著(衫)", "whose": "誰的", "wire": "電線",
  "woman": "女人", "wrote": "寫咗", "yard": "院子 / 碼", "you’re": "你是", "yourself": "你自己",

  // 9th 100 Words
  "addition": "加法", "army": "軍隊", "bell": "鐘", "belong": "屬於", "block": "積木 / 街區",
  "blood": "血", "blow": "吹", "board": "板", "bones": "骨頭", "branches": "樹枝",
  "cattle": "牛群", "chief": "首領 / 主要", "compare": "比較", "compound": "化合物 / 混合", "consider": "考慮",
  "cook": "煮食", "corner": "角落", "crops": "農作物", "crowd": "人群", "current": "水流 / 現在的",
  "doctor": "醫生", "dollars": "元 / 美元", "eight": "八", "electric": "電的", "elements": "元素",
  "enjoy": "享受", "entered": "進入咗", "except": "除了", "exciting": "令人興奮", "expect": "期望",
  "famous": "出名", "fit": "合適", "flat": "平坦 / 單位", "fruit": "水果", "fun": "好玩",
  "guess": "估", "hat": "帽", "hit": "打擊", "indicate": "指出", "industry": "工業",
  "insects": "昆蟲", "interesting": "有趣", "Japanese": "日本的 / 日文", "lie": "講大話 / 躺下", "lifted": "舉起咗",
  "loud": "大聲", "major": "主要的", "mall": "商場", "meat": "肉", "mine": "我的 / 礦",
  "modern": "現代", "movement": "移動 / 運動", "necessary": "必須", "observe": "觀察", "park": "公園",
  "particular": "特別的", "planets": "行星", "poem": "詩", "pole": "柱 / 極", "position": "位置",
  "process": "過程", "property": "財產", "provide": "提供", "rather": "寧願 / 相當", "rhythm": "節奏",
  "rich": "富有", "safe": "安全", "sand": "沙", "science": "科學", "sell": "賣",
  "send": "發送", "sense": "感覺", "seven": "七", "sharp": "尖銳", "shoulder": "肩膀",
  "sight": "視力 / 景象", "silent": "安靜", "soldiers": "士兵", "spot": "斑點 / 地點", "spread": "傳播 / 散開",
  "stream": "溪流", "string": "繩子", "suggested": "建議咗", "supply": "供應", "swim": "游水",
  "terms": "術語 / 條款", "thick": "厚", "thin": "薄", "thus": "因此", "tied": "綁住咗",
  "tone": "語氣 / 音調", "trade": "貿易", "tube": "管子", "value": "價值", "wash": "洗",
  "wasn’t": "不是 (過去式)", "weight": "重量", "wife": "妻子", "wings": "翅膀", "won’t": "將不會",

  // 10th 100 Words
  "action": "行動", "actually": "實際上", "adjective": "形容詞", "afraid": "驚 / 害怕", "agreed": "同意咗",
  "ahead": "在前面", "allow": "允許", "apple": "蘋果", "arrived": "到達咗", "born": "出生",
  "bought": "買咗", "British": "英國的", "capital": "首都 / 大寫", "chance": "機會", "chart": "圖表",
  "church": "教堂", "column": "專欄 / 圓柱", "company": "公司 / 陪伴", "conditions": "條件 / 情況", "corn": "粟米",
  "cotton": "棉花", "cows": "牛", "create": "創造", "dead": "死咗", "deal": "交易 / 處理",
  "death": "死亡", "details": "細節", "determine": "決定", "difficult": "困難", "division": "除法 / 分配",
  "doesn’t": "不做 (佢用)", "effect": "效果 / 影響", "entire": "整個", "especially": "尤其", "evening": "傍晚",
  "experience": "經驗", "factories": "工廠", "fair": "公平 / 展覽", "fear": "恐懼", "fig": "無花果",
  "forward": "向前", "France": "法國", "fresh": "新鮮", "Greek": "希臘的", "gun": "槍",
  "hoe": "鋤頭", "huge": "巨大", "isn’t": "不是", "led": "帶領咗", "level": "水平",
  "located": "位於", "march": "前進 / 三月", "match": "比賽 / 火柴", "molecules": "分子", "northern": "北方的",
  "nose": "鼻子", "office": "辦公室", "opposite": "相反", "oxygen": "氧氣", "plural": "眾數",
  "prepared": "準備好咗", "pretty": "漂亮 / 相當", "printed": "印咗", "radio": "收音機", "repeated": "重複咗",
  "rope": "繩索", "rose": "玫瑰", "score": "分數", "seat": "座位", "settled": "定居 / 解決",
  "shoes": "鞋", "shop": "商店", "similar": "相似", "sir": "先生", "sister": "姊妹",
  "smell": "氣味 / 嗅", "solution": "解決方法", "southern": "南方的", "steel": "鋼鐵", "stretched": "拉長咗",
  "substances": "物質", "suffix": "後綴", "sugar": "糖", "tools": "工具", "total": "總共",
  "track": "軌道 / 追蹤", "triangle": "三角形", "truck": "貨車", "underline": "畫底線", "various": "各種各樣",
  "view": "景色 / 觀點", "Washington": "華盛頓"
};

// 💡 請貼在 DICTIONARY = { ... }; 的正下方

const LEVEL_TITLES = [
  "1st 100 Words", "2nd 100 Words", "3rd 100 Words", "4th 100 Words", "5th 100 Words",
  "6th 100 Words", "7th 100 Words", "8th 100 Words", "9th 100 Words", "10th 100 Words"
];

const PRAISES = [
  "你好叻呀！已經學識晒呢 100 個字！🎉",
  "太完美喇！你係英文拼字大師！🏆",
  "爸爸為你感到驕傲！好聰明！⭐",
  "挑戰成功！準備好去下一關未？🚀"
];

export default function SightWordsGame() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [praiseText, setPraiseText] = useState("");
  const [targetWord, setTargetWord] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  const playSound = (type: "coin" | "bump") => {
    try { const audio = new Audio(`/${type}.mp3`); audio.play().catch(()=>{}); } catch (e) {}
  };

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateQuestion = (groupId: number, currentPool: string[]) => {
    if (currentPool.length === 0) {
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      setPraiseText(praise);
      setIsFinished(true);
      return;
    }

    const target = currentPool[0];
    const nextPool = currentPool.slice(1);
    setRemainingWords(nextPool);
    
    const groupWords = RAW_GROUPS[groupId];
    const wrongOptions = groupWords
      .filter((w) => w !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const finalOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setTargetWord(target);
    setOptions(finalOptions);
    setFeedback("idle");
    
    setTimeout(() => speakWord(target), 300);
  };

  const handleStartLevel = (groupId: number) => {
    const groupWords = RAW_GROUPS[groupId];
    const shuffled = [...groupWords].sort(() => Math.random() - 0.5);
    
    setSelectedGroup(groupId);
    setScore(0);
    setIsFinished(false);
    generateQuestion(groupId, shuffled);
  };

  const handleSelect = (word: string) => {
    if (feedback !== "idle" || !selectedGroup || isFinished) return;

    if (word === targetWord) {
      playSound("coin");
      setFeedback("correct");
      setScore((prev) => prev + 1);
      setTimeout(() => generateQuestion(selectedGroup, remainingWords), 1500);
    } else {
      playSound("bump");
      setFeedback("wrong");
      setScore((prev) => Math.max(0, prev - 1));
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  if (selectedGroup === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F0F9FF] rounded-3xl p-6 shadow-inner relative select-none">
        <h2 className="text-4xl font-black text-sky-700 mb-8 tracking-wide">選擇字庫關卡 🗺️</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {LEVEL_TITLES.map((title, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartLevel(index + 1)}
              className={`py-6 px-4 rounded-3xl border-b-8 shadow-md font-black text-2xl transition-all
                ${index < 3 ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" : 
                  index < 6 ? "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200" : 
                  "bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200"}
              `}
            >
              {title}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const translation = DICTIONARY[targetWord] || "(中文待補充)";
  const totalWords = RAW_GROUPS[selectedGroup].length;
  const currentIndex = totalWords - remainingWords.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#F0F9FF] rounded-3xl p-6 shadow-inner relative overflow-hidden select-none">
      
      <div className="absolute top-6 left-6 z-10">
        <button onClick={() => setSelectedGroup(null)} className="px-6 py-3 bg-white text-sky-600 font-bold rounded-full shadow-sm border-2 border-sky-200 hover:bg-sky-50 transition-colors">🔙 返回目錄</button>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white p-3 px-6 rounded-full border-4 border-sky-300 z-10 shadow-sm">
        <span className="text-3xl">⭐</span>
        <span className="text-4xl font-extrabold text-sky-600 font-mono tracking-tighter">{score.toString().padStart(2, "0")}</span>
      </div>

      <div className="text-center mb-8 z-10 w-full max-w-3xl mt-16 sm:mt-0">
        <h2 className="text-3xl font-black text-sky-700 mb-2 tracking-wide">{LEVEL_TITLES[selectedGroup - 1]}</h2>
        
        {!isFinished && (
          <div className="w-full max-w-sm mx-auto bg-sky-100 rounded-full h-3 mb-6 relative overflow-hidden border border-sky-200">
            <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${(currentIndex / totalWords) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-sky-900 drop-shadow-sm">進度：{currentIndex} / {totalWords}</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => speakWord(targetWord)}
          className="w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center text-5xl shadow-[0_8px_0_0_#0284C7] active:translate-y-2 active:shadow-none transition-all mx-auto mb-6 mt-4"
        >
          🔊
        </motion.button>

        <motion.div
          key={targetWord}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block bg-sky-100 border-2 border-sky-300 px-6 py-3 rounded-2xl shadow-sm mb-4"
        >
          <span className="text-xl sm:text-2xl font-black text-sky-800">💡 意思：{translation}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl z-10 px-4">
        {options.map((word, index) => (
          <motion.button
            key={`${word}-${index}`}
            animate={feedback === "wrong" && word !== targetWord ? { x: [-10, 10, -10, 10, 0] } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(word)}
            className="py-8 px-4 bg-white text-gray-800 text-4xl sm:text-5xl font-black rounded-3xl border-b-8 border-sky-200 hover:bg-sky-50 active:border-b-4 active:translate-y-1 transition-all shadow-md tracking-wider flex flex-col items-center justify-center"
          >
            <span>{word}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[120px] mb-4">🏆</motion.div>
            <h1 className="text-6xl font-black text-sky-600 mb-6">通關大成功！</h1>
            <p className="text-3xl font-extrabold text-orange-500 mb-10 max-w-md leading-relaxed">{praiseText}</p>
            <div className="flex gap-4">
              <button onClick={() => setSelectedGroup(null)} className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-black rounded-full shadow-md hover:bg-gray-300 transition-all">返回目錄</button>
              <button onClick={() => handleStartLevel(selectedGroup!)} className="px-8 py-4 bg-sky-500 text-white text-xl font-black rounded-full shadow-[0_6px_0_0_#0284C7] hover:bg-sky-600 active:translate-y-1 active:shadow-none transition-all">再玩一次 🚀</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback === "correct" && !isFinished && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} className="absolute text-9xl z-20 pointer-events-none">✅</motion.div>}
        {feedback === "wrong" && <motion.div initial={{ x: -20 }} animate={{ x: [0, -20, 20, -20, 20, 0] }} className="absolute text-9xl z-20 pointer-events-none">❌</motion.div>}
      </AnimatePresence>
    </div>
  );
}
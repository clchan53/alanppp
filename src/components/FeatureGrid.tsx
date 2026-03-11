"use client";
import { motion } from "framer-motion";

const items = [
  { title: "攝影日常", desc: "紀錄光影瞬間。", color: "bg-zinc-900" },
  { title: "技術筆記", desc: "寫 Code 嘅點滴。", color: "bg-zinc-800" },
  { title: "旅行隨手拍", desc: "探索世界。", color: "bg-zinc-900" },
  { title: "生活感悟", desc: "靜心思考。", color: "bg-zinc-800" },
];

export default function FeatureGrid() {
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`h-[500px] ${item.color} rounded-3xl p-12 flex flex-col justify-end overflow-hidden group`}
          >
            <h3 className="text-white text-3xl font-semibold">{item.title}</h3>
            <p className="text-gray-400 text-lg mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
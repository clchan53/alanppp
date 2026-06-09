import ChineseVocabGame from "../../components/ChineseVocabGame";

export default function ChineseVocabPage() {
  return (
    <main className="min-h-screen bg-fuchsia-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          聽音辨字：中文詞彙小達人 📖
        </h1>
        <ChineseVocabGame />
      </div>
    </main>
  );
}
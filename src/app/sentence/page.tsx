import SentenceGame from "../../components/SentenceGame";

export default function SentencePage() {
  return (
    <main className="min-h-screen bg-purple-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          重組句子魔法師 🧩
        </h1>
        <SentenceGame />
      </div>
    </main>
  );
}
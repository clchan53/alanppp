import EnglishSentenceGame from "../../components/EnglishSentenceGame";

export default function EnglishSentencePage() {
  return (
    <main className="min-h-screen bg-indigo-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          英文重組句子挑戰 🇬🇧
        </h1>
        <EnglishSentenceGame />
      </div>
    </main>
  );
}
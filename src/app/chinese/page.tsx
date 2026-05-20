import WordGame from "../../components/WordGame";

export default function ChinesePage() {
  return (
    <main className="min-h-screen bg-green-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          中文認字挑戰 📝
        </h1>
        <WordGame />
      </div>
    </main>
  );
}
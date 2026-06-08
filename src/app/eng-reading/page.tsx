import EnglishReadingGame from "../../components/EnglishReadingGame";

export default function EnglishReadingPage() {
  return (
    <main className="min-h-screen bg-emerald-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          英文朗讀小劇場 🎙️
        </h1>
        <EnglishReadingGame />
      </div>
    </main>
  );
}
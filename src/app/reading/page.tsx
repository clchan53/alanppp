import ReadingGame from "../../components/ReadingGame";

export default function ReadingPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          中文朗讀小劇場 🎙️
        </h1>
        <ReadingGame />
      </div>
    </main>
  );
}
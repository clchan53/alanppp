import SightWordsGame from "../../components/SightWordsGame";

export default function SightWordsPage() {
  return (
    <main className="min-h-screen bg-sky-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          100 Sight Words 聽音辨字 👂
        </h1>
        <SightWordsGame />
      </div>
    </main>
  );
}
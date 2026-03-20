import HangmanGame from "../../components/HangmanGame";

export default function EnglishPage() {
  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          ABC 英文挑戰
        </h1>
        {/* 👇 呢度一定要係 HangmanGame 👇 */}
        <HangmanGame /> 
      </div>
    </main>
  );
}
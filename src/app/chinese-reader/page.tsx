import ChineseReaderGame from "../../components/ChineseReaderGame";

export default function ChineseReaderPage() {
  return (
    <main className="min-h-screen bg-sky-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          小一中文朗讀 📖
        </h1>
        <ChineseReaderGame />
      </div>
    </main>
  );
}
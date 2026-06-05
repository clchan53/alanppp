import MultiplicationGame from "../../components/MultiplicationGame";

export default function MultiplicationPage() {
  return (
    <main className="min-h-screen bg-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          九因歌魔法陣 🍎
        </h1>
        <MultiplicationGame />
      </div>
    </main>
  );
}
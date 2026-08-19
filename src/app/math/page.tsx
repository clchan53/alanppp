import VerticalMathGame from "../../components/VerticalMathGame";

export default function MathPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          直式加減法挑戰 🧮
        </h1>
        <VerticalMathGame />
      </div>
    </main>
  );
}
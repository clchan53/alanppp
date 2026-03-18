import MathGame from "../../components/MathGame"; // 注意相對路徑，跳出兩層返去 components

export default function GamePage() {
  return (
    <main className="min-h-screen bg-sky-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          小朋友數學挑戰
        </h1>
        <MathGame />
      </div>
    </main>
  );
}
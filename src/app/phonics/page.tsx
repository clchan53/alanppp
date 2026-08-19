import PhonicsGame from "../../components/PhonicsGame";

export default function PhonicsPage() {
  return (
    <main className="min-h-screen bg-emerald-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          英語拼音實驗室 🔬
        </h1>
        <PhonicsGame />
      </div>
    </main>
  );
}
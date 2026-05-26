import HKMoneyGame from "../../components/HKMoneyGame";

export default function MoneyPage() {
  return (
    <main className="min-h-screen bg-yellow-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          香港錢幣大探險 💰
        </h1>
        <HKMoneyGame />
      </div>
    </main>
  );
}
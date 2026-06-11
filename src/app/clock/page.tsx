import ClockGame from "../../components/ClockGame";

export default function ClockPage() {
  return (
    <main className="min-h-screen bg-violet-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          時鐘魔法師 ⏰
        </h1>
        <ClockGame />
      </div>
    </main>
  );
}
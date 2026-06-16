import MandarinGame from "../../components/MandarinGame";

export default function MandarinPage() {
  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          小一普通話特訓班 🎒
        </h1>
        <MandarinGame />
      </div>
    </main>
  );
}
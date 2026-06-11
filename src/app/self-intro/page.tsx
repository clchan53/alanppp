import SelfIntroGame from "../../components/SelfIntroGame";

export default function SelfIntroPage() {
  return (
    <main className="min-h-screen bg-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          星級小演說家 🎤
        </h1>
        <SelfIntroGame />
      </div>
    </main>
  );
}
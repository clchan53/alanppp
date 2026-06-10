import ScienceGame from "../../components/ScienceGame";

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-teal-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          小學科學探險島 🔭
        </h1>
        <ScienceGame />
      </div>
    </main>
  );
}
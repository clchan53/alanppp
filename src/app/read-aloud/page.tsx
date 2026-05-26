import ReadAloud from "../../components/ReadAloud";

export default function ReadAloudPage() {
  return (
    <main className="min-h-screen bg-teal-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          日常對話點讀機 🇬🇧
        </h1>
        <ReadAloud />
      </div>
    </main>
  );
}
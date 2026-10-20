// 根據你專案嘅實際路徑調整 import，通常係由 app 目錄指向上兩層嘅 components 目錄
import FamilyRevisionGame from "../../components/FamilyRevisionGame";

export default function FamilyTreePage() {
  return (
    <main className="min-h-screen bg-yellow-50 p-4 sm:p-8 md:p-12 flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-10">
        {/* 渲染 Mimi 嘅家族樹溫書組件 */}
        <FamilyRevisionGame />
      </div>
    </main>
  );
}

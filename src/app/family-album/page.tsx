// 根據你專案嘅實際路徑調整 import，通常係由 app 目錄指向上兩層嘅 components 目錄
import FamilyAlbumGame from "../../components/FamilyAlbumGame";

export default function FamilyAlbumPage() {
  return (
    <main className="min-h-screen bg-[#f0f8ff] p-4 sm:p-8 md:p-12 flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-10">
        {/* 渲染引入嘅組件 */}
        <FamilyAlbumGame />
      </div>
    </main>
  );
}
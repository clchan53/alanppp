import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid"; // 新加呢行

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <FeatureGrid /> {/* 放喺 Hero 下面 */}
    </main>
  );
}
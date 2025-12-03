import Header from "@/components/asset/Header";
import NewsCarousel from "@/components/asset/NewsCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <NewsCarousel />
      </main>
    </div>
  );
}

import TopNavBar from "./components/TopNavBar";
import HeroSection from "./components/HeroSection";
import SearchFilterBar from "./components/SearchFilterBar";
import EventSection from "./components/EventSection";
import RecommendedCarousel from "./components/RecommendedCarousel";
import EventSkeleton from "./components/EventSkeleton";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <TopNavBar />
      <div className="flex-1">
        <HeroSection />
        <SearchFilterBar />
        <main className="py-16 space-y-20">
          <EventSection />
          <RecommendedCarousel />
          <EventSkeleton />
        </main>
      </div>
      <Footer />
    </div>
  );
}

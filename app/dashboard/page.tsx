import TopNavBar from "@/app/components/TopNavBar";
import HeroSection from "@/app/components/HeroSection";
import SearchFilterBar from "@/app/components/SearchFilterBar";
import EventSection from "@/app/components/EventSection";
import RecommendedCarousel from "@/app/components/RecommendedCarousel";
import EventSkeleton from "@/app/components/EventSkeleton";
import Footer from "@/app/components/Footer";

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

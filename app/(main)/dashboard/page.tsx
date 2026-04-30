import TopNavBar from "@/app/components/TopNavBar";
import HeroSection from "@/app/components/HeroSection";
import SearchFilterBar from "@/app/components/SearchFilterBar";
import EventSection from "@/app/components/EventSection";
import RecommendedCarousel from "@/app/components/RecommendedCarousel";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <style>{`
        /* Fade in animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Slide in from top */
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Slide in from bottom */
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Scale in */
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Bounce */
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Glow effect */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(48, 30, 201, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(48, 30, 201, 0.6);
          }
        }
        
        .animate-topnav {
          animation: slideInFromTop 0.6s ease-out;
        }
        
        .animate-hero {
          animation: slideInFromBottom 0.8s ease-out 0.2s both;
        }
        
        .animate-section {
          animation: fadeIn 0.6s ease-out 0.4s both;
        }
        
        .animate-card {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>
      
      <div className="animate-topnav">
        <TopNavBar />
      </div>
      
      <div className="flex-1">
        <div className="animate-hero">
          <HeroSection />
        </div>
        
        <div className="animate-section">
          <SearchFilterBar />
        </div>
        
        <main className="py-16 space-y-20">
          <div className="animate-section">
            <EventSection />
          </div>
          
          <div className="animate-section" style={{ animationDelay: '0.6s' }}>
            <RecommendedCarousel />
          </div>
        </main>
      </div>
      
      <div className="animate-section" style={{ animationDelay: '1s' }}>
        <Footer />
      </div>
    </div>
  );
}

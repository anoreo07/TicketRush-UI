import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';
import LandingPageContent from '@/app/components/LandingPageContent';

export const metadata = {
  title: 'TicketRush - Kiến tạo khoảnh khắc, Kết nối đam mê',
  description: 'Nền tảng quản lý và đặt vé sự kiện chuyên nghiệp',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface">
      <TopNavBar hiddenLinks={true} />
      <main className="flex-1">
        <LandingPageContent />
      </main>
      <Footer />
    </div>
  );
}

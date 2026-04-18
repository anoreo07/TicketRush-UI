import TopNavBar from '@/app/components/TopNavBar';
import CheckoutPageContent from './CheckoutPageContent';

export const metadata = {
  title: 'Xác nhận thanh toán - TicketRush',
  description: 'Xác nhận và hoàn tất thanh toán vé của bạn',
};

export default function CheckoutPage() {
  return (
    <>
      <TopNavBar />
      <CheckoutPageContent />
    </>
  );
}


import TopNavBar from '@/app/components/TopNavBar';
import { BookingProvider } from '@/lib/context/BookingContext';
import BookingPageContent from './BookingPageContent';

export const metadata = {
    title: 'Chọn ghế - TicketRush',
    description: 'Chọn và đặt vé cho sự kiện của bạn',
};

// Server component - metadata must be in server component
export default function BookingPage() {
    return (
        <>
            <TopNavBar />
            <BookingProvider>
                <BookingPageContent />
            </BookingProvider>
        </>
    );
}

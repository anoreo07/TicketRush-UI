import { BookingProvider } from '@/lib/context/BookingContext';
import BookingPageContent from './BookingPageContent';

export const metadata = {
    title: 'Chọn ghế - TicketRush',
    description: 'Chọn và đặt vé cho sự kiện của bạn',
};

export default function BookingPage() {
    return <BookingPageContent />;
}

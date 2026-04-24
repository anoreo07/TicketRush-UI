/**
 * Event Detail Page
 * Hiển thị chi tiết sự kiện và thông tin mua vé
 */

import { Metadata } from 'next';
import { EventDetailContent } from '@/app/components/events/EventDetailContent';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Chi tiết sự kiện - TicketRush',
  description: 'Xem chi tiết sự kiện và mua vé online',
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventDetailContent eventId={params.id} />;
}

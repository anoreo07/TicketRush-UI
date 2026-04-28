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

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  // In Next.js 14+, params might be a Promise
  const resolvedParams = await Promise.resolve(params);
  console.log('📖 EventDetailPage - params:', resolvedParams);
  console.log('📖 EventDetailPage - eventId:', resolvedParams.id);
  return <EventDetailContent eventId={resolvedParams.id} />;
}

'use client';

import { BookingProvider } from '@/lib/context/BookingContext';

export default function BookingFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookingProvider>{children}</BookingProvider>;
}

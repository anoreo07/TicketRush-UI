'use client';

import { EventBookingProvider } from '@/lib/context/EventBookingContext';

export function EventBookingClientWrapper({ children }: { children: React.ReactNode }) {
  return <EventBookingProvider>{children}</EventBookingProvider>;
}

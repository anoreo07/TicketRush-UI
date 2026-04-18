/**
 * Booking Data Types
 */

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'sold' | 'locked' | 'selected';
  type: 'vip' | 'standard';
  price: number;
}

export interface SelectedSeat extends Seat {
  selectedAt: Date;
}

export interface BookingSummary {
  eventId: string;
  selectedSeats: SelectedSeat[];
  subtotal: number;
  serviceFee: number;
  total: number;
  timeRemaining: number; // in seconds
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  organizer: {
    name: string;
    icon?: string;
  };
}

export interface EventBookingDetails extends Event {
  totalSeats: number;
  availableSeats: number;
  vipPrice: number;
  standardPrice: number;
  serviceFee: number;
}

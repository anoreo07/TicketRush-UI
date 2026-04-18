# API Integration - Code Examples & Reference

## Quick Reference Guide

### 1. Using BookingContext in Components

```typescript
import { useBookingContext } from '@/lib/context/BookingContext';

export function MyComponent() {
  const { 
    booking, 
    selectedSeatIds, 
    isLoading, 
    error, 
    eventId,
    setEventId,
    lockSeat,
    confirmBooking,
    getTickets,
  } = useBookingContext();

  // Lock a seat (called on seat click)
  const handleSeatClick = async (seatId: string) => {
    try {
      await lockSeat(seatId);
      console.log('Seat locked:', seatId);
    } catch (err) {
      console.error('Lock failed:', err.message);
    }
  };

  // Confirm booking (called on payment)
  const handleConfirmBooking = async () => {
    try {
      await confirmBooking('credit_card');
      console.log('Booking confirmed:', booking);
      // Navigate to next page
      router.push('/queue');
    } catch (err) {
      console.error('Confirmation failed:', err.message);
    }
  };

  // Get user's tickets
  const handleViewTickets = async () => {
    try {
      const userTickets = await getTickets();
      console.log('Retrieved tickets:', userTickets);
    } catch (err) {
      console.error('Failed to fetch tickets:', err.message);
    }
  };

  return (
    <div>
      {/* Show error if any */}
      {error && <div className="text-red-600">{error}</div>}
      
      {/* Show loading state */}
      {isLoading && <div>Loading...</div>}

      {/* Your component UI */}
      <button onClick={handleSeatClick} disabled={isLoading}>
        Lock Seat
      </button>
      <button onClick={handleConfirmBooking} disabled={isLoading}>
        Confirm Booking
      </button>
      <button onClick={handleViewTickets} disabled={isLoading}>
        View Tickets
      </button>
    </div>
  );
}
```

---

### 2. Wrapping Pages with BookingProvider

```typescript
// app/booking/page.tsx
import { BookingProvider } from '@/lib/context/BookingContext';

function BookingPageContent() {
  return (
    <main>
      {/* Your page content */}
      <SeatSelection />
      <CheckoutSummary />
    </main>
  );
}

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
```

---

### 3. API Client Usage (bookingApi)

```typescript
import { bookingApi } from '@/lib/api/booking';

// Lock a seat
const lockResult = await bookingApi.lockSeat({
  event_id: '550e8400-e29b-41d4-a716-446655440000',
  seat_id: 'A5',
});
// Response: { id, user_id, event_id, status, total_amount, ... }

// Confirm booking
const confirmResult = await bookingApi.confirmBooking({
  booking_id: lockResult.id,
  payment_method: 'credit_card',
});
// Response: { id, status: 'confirmed', ... }

// Get user's tickets
const tickets = await bookingApi.getTickets();
// Response: [{ id, booking_id, seat_id, qr_code, ... }, ...]
```

---

## Full Code Examples

### Example 1: SeatSelection Component Integration

```typescript
'use client';

import React, { useState } from 'react';
import { useBookingContext } from '@/lib/context/BookingContext';

export const SeatSelection = () => {
  const { lockSeat, isLoading, error } = useBookingContext();
  const [lockedSeats, setLockedSeats] = useState<Set<string>>(new Set());
  const [lockingErrors, setLockingErrors] = useState<Map<string, string>>(new Map());

  const handleSeatClick = async (seatId: string) => {
    if (lockedSeats.has(seatId)) {
      return; // Already locked
    }

    try {
      setLockingErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(seatId);
        return newErrors;
      });

      await lockSeat(seatId);
      setLockedSeats(prev => new Set([...prev, seatId]));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể khóa ghế này';
      setLockingErrors(prev => new Map(prev).set(seatId, errorMsg));
    }
  };

  return (
    <div className="space-y-8">
      {/* Seat Grid */}
      <div className="grid grid-cols-12 gap-1.5">
        {[...Array(12)].map((_, i) => {
          const seatId = `vip-${i}`;
          const isLocked = lockedSeats.has(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isLoading || isLocked}
              className={`
                w-8 h-8 rounded-md transition-all
                ${isLocked 
                  ? 'bg-yellow-500 text-white ring-2 ring-yellow-400'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Error Messages */}
      {Array.from(lockingErrors.entries()).map(([seatId, msg]) => (
        <p key={seatId} className="text-xs text-red-600">
          {seatId}: {msg}
        </p>
      ))}
    </div>
  );
};
```

---

### Example 2: CheckoutSummary Component Integration

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingContext } from '@/lib/context/BookingContext';

export const CheckoutSummary = () => {
  const router = useRouter();
  const { booking, isLoading, error, confirmBooking: confirmBookingAPI } = useBookingContext();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

  const handleConfirmBooking = async () => {
    if (!booking) {
      return;
    }

    try {
      await confirmBookingAPI(selectedPaymentMethod);
      router.push('/queue');
    } catch (err) {
      // Error is handled by context
      console.error('Confirmation failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-bold">Phương thức thanh toán</label>
        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="credit_card">Thẻ Tín Dụng</option>
          <option value="debit_card">Thẻ Ghi Nợ</option>
          <option value="momo">MoMo</option>
        </select>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmBooking}
        disabled={!booking || isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-bold text-white
          transition-colors
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            ⟳ Đang xác nhận...
          </span>
        ) : (
          'Xác Nhận Đặt Vé'
        )}
      </button>
    </div>
  );
};
```

---

### Example 3: Queue Page Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';

export default function QueuePage() {
  const router = useRouter();
  const [queuePosition, setQueuePosition] = useState(45);
  const [totalInQueue, setTotalInQueue] = useState(128);
  const [bookingStatus, setBookingStatus] = useState<'processing' | 'completed'>('processing');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);

      // Move up queue every 6 seconds
      if (elapsedTime % 6 === 0 && queuePosition > 1) {
        setQueuePosition(prev => Math.max(1, prev - 1));
      }

      // Complete when position reaches 1
      if (queuePosition === 1 && bookingStatus === 'processing') {
        setTimeout(() => {
          setBookingStatus('completed');
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedTime, queuePosition, bookingStatus]);

  const estimatedWaitTime = Math.max(0, Math.ceil(queuePosition * 0.3));
  const progress = ((totalInQueue - queuePosition) / totalInQueue) * 100;

  return (
    <>
      <TopNavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-6 pb-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Position Badge */}
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-purple-100 mb-6">
                <div className="text-center">
                  <p className="text-xs text-purple-600 font-bold">Vị trí</p>
                  <p className="text-5xl font-black text-purple-600">#{queuePosition}</p>
                </div>
              </div>

              <p className="text-2xl font-bold mb-2">
                {queuePosition === 1 ? '🎉 Đến lượt bạn rồi!' : `Có ${queuePosition - 1} người trước`}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Wait Time */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-600">Thời gian chờ</p>
                  <p className="text-3xl font-black text-purple-600">{estimatedWaitTime}</p>
                </div>
              </div>

              {/* Status */}
              <div className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-full mt-6
                ${bookingStatus === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}
              `}>
                <div className={`w-2 h-2 rounded-full ${
                  bookingStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className={`text-sm font-bold ${
                  bookingStatus === 'completed' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {bookingStatus === 'processing' ? 'Đang xử lý' : '✓ Hoàn thành'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-8">
                {bookingStatus === 'completed' ? (
                  <>
                    <button
                      onClick={() => router.push('/tickets')}
                      className="w-full py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700"
                    >
                      Xem Vé Của Tôi
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className="w-full py-3 bg-white text-purple-600 border-2 border-purple-600 font-bold rounded-full"
                    >
                      Quay Về Trang Chủ
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full py-3 bg-gray-400 text-white font-bold rounded-full opacity-60">
                    ⏳ Chờ Lượt...
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
```

---

### Example 4: Tickets Display Page

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import { useBookingContext } from '@/lib/context/BookingContext';

interface Ticket {
  id: string;
  eventTitle: string;
  eventDate: string;
  seatNumber: string;
  seatZone: string;
  price: number;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
}

export default function TicketsPage() {
  const router = useRouter();
  const { getTickets, isLoading } = useBookingContext();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userTickets = await getTickets();
        setTickets(userTickets as any); // Convert to Ticket type
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };

    fetchTickets();
  }, [getTickets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-700';
      case 'used':
        return 'bg-blue-100 text-blue-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <TopNavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-6 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">🎫 Vé Của Tôi</h1>

          {isLoading ? (
            <p>Đang tải...</p>
          ) : tickets.length === 0 ? (
            <p>Bạn chưa có vé nào</p>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl"
                >
                  <div className="grid grid-cols-3 gap-4">
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <img src={ticket.qrCode} alt="QR" className="w-32 h-32" />
                    </div>

                    {/* Event Details */}
                    <div>
                      <h3 className="font-bold mb-2">{ticket.eventTitle}</h3>
                      <p className="text-sm text-gray-600">{ticket.eventDate}</p>
                    </div>

                    {/* Seat & Status */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{ticket.seatNumber}</p>
                      <p className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'valid' ? '✓ Có hiệu lực' : ticket.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-8 max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Chi Tiết Vé</h2>

                <img src={selectedTicket.qrCode} alt="QR" className="w-48 h-48 mx-auto mb-6" />

                <div className="space-y-4">
                  <p><strong>Sự Kiện:</strong> {selectedTicket.eventTitle}</p>
                  <p><strong>Ngày:</strong> {selectedTicket.eventDate}</p>
                  <p><strong>Ghế:</strong> {selectedTicket.seatNumber} ({selectedTicket.seatZone})</p>
                  <p><strong>Giá:</strong> {selectedTicket.price.toLocaleString()} ₫</p>
                  <p className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status === 'valid' ? '✓ Có hiệu lực' : selectedTicket.status}
                  </p>
                </div>

                <div className="space-y-3 mt-8">
                  <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg">
                    📥 Tải Xuống
                  </button>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
```

---

### Example 5: Error Handling Pattern

```typescript
import { bookingApi, ApiError } from '@/lib/api/booking';

// Proper error handling
try {
  const result = await bookingApi.lockSeat({
    event_id: eventId,
    seat_id: seatId,
  });

  // Success
  console.log('Seat locked:', result);
} catch (error) {
  // Check if it's an API error
  if (error instanceof ApiError) {
    // Error from backend API
    const errorCode = error.code; // e.g., 'SEAT_ALREADY_LOCKED'
    const errorMessage = error.message; // User-friendly message in Vietnamese
    
    console.error(`API Error [${errorCode}]: ${errorMessage}`);
    
    // Handle specific errors
    if (errorCode === 'SEAT_ALREADY_LOCKED') {
      // Show: "Ghế này đã được khóa bởi người khác"
    } else if (errorCode === 'SEAT_ALREADY_SOLD') {
      // Show: "Ghế này đã được bán"
    }
  } else {
    // Network error or other error
    console.error('Request failed:', error.message);
  }
}
```

---

## Testing Examples

### Test Case 1: Lock Seat
```typescript
describe('SeatSelection - Lock Seat', () => {
  it('should lock a seat when clicked', async () => {
    // Setup: Render with BookingProvider
    // Action: Click seat #A5
    // Assert: lockSeat called with correct parameters
    // Assert: Seat color changes to yellow
  });

  it('should show error on duplicate lock', async () => {
    // Setup: Seat already locked
    // Action: Try to click same seat again
    // Assert: Error message displayed
    // Assert: Seat not re-locked
  });
});
```

### Test Case 2: Confirm Booking
```typescript
describe('CheckoutSummary - Confirm Booking', () => {
  it('should confirm booking and navigate to queue', async () => {
    // Setup: Booking exists in context
    // Action: Select payment method
    // Action: Click confirm button
    // Assert: confirmBooking called
    // Assert: Router navigates to /queue
  });

  it('should show error on failed confirmation', async () => {
    // Setup: API returns error
    // Action: Click confirm button
    // Assert: Error message displayed
    // Assert: Button remains enabled for retry
  });
});
```

### Test Case 3: Get Tickets
```typescript
describe('TicketsPage - Get Tickets', () => {
  it('should fetch and display user tickets', async () => {
    // Setup: Mock API to return 2 tickets
    // Action: Render page
    // Assert: getTickets called
    // Assert: 2 ticket cards displayed
    // Assert: Each ticket shows QR code
  });

  it('should show empty state when no tickets', async () => {
    // Setup: Mock API to return empty array
    // Action: Render page
    // Assert: "No tickets" message displayed
  });
});
```

---

## API Response Examples

### Lock Seat Response
```json
{
  "success": true,
  "data": {
    "id": "booking-001",
    "user_id": "user-123",
    "event_id": "event-456",
    "status": "pending",
    "total_amount": 250000,
    "expires_at": "2024-05-15T10:40:00Z",
    "created_at": "2024-05-15T10:30:00Z"
  },
  "message": "Ghế đã được giữ thành công"
}
```

### Confirm Booking Response
```json
{
  "success": true,
  "data": {
    "id": "booking-001",
    "user_id": "user-123",
    "event_id": "event-456",
    "status": "confirmed",
    "payment_status": "paid",
    "total_amount": 500000,
    "created_at": "2024-05-15T10:30:00Z"
  },
  "message": "Đơn hàng đã được xác nhận"
}
```

### Get Tickets Response
```json
{
  "success": true,
  "data": [
    {
      "id": "ticket-001",
      "booking_id": "booking-001",
      "seat_id": "seat-A5",
      "qr_code": "TKT-001-ABC",
      "issued_at": "2024-05-15T10:35:00Z"
    },
    {
      "id": "ticket-002",
      "booking_id": "booking-001",
      "seat_id": "seat-A6",
      "qr_code": "TKT-002-ABC",
      "issued_at": "2024-05-15T10:35:00Z"
    }
  ],
  "message": "Danh sách vé"
}
```

---

## Summary

This reference guide covers:
✅ Component integration patterns
✅ Context usage examples
✅ API client methods
✅ Error handling strategies
✅ Testing approaches
✅ API response formats

All examples follow React 19 best practices and TypeScript strict mode.

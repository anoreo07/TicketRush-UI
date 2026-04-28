/**
 * End-to-End Booking Flow Implementation Summary
 * 
 * This document describes the complete booking flow from event selection to success
 */

# ✅ End-to-End Event Booking Flow - Complete Implementation

## 🎯 Flow Overview

```
Events List (/events)
         ↓
   Event Detail (/events/[id])
    "Đăng ký ngay" button
         ↓
   Queue Page (/queue)
     [Wait in line]
         ↓
   Booking Page (/booking)
    [Select seats + lock]
    "Xác nhận đặt vé" button
         ↓
   Checkout Page (/checkout)
    [Review + payment method]
    "Xác nhận thanh toán" button
         ↓
   Success Page (/success)
    [Show confirmation]
    [Auto-redirect to /dashboard after 5 seconds]
```

---

## 📋 Implementation Details

### 1. Event List → Event Detail
**Files Modified:**
- `app/components/events/EventDetailContent.tsx`

**Changes:**
```tsx
const handleBuyTickets = async () => {
  // Store event ID in session for queue flow
  sessionStorage.setItem('bookingEventId', eventId);
  router.push('/queue');
};
```

**What happens:**
- User clicks "Mua vé ngay" button on event detail page
- Event ID saved to sessionStorage
- User redirected to /queue

---

### 2. Queue Page
**File:**
- `app/queue/page.tsx` (already exists, updated)

**Updated Logic:**
```typescript
// Auto redirect to booking when queue position = 1
if (queuePosition === 1 && bookingStatus === 'processing') {
  setTimeout(() => {
    setBookingStatus('completed');
    // Auto redirect to booking after 2 seconds
    setTimeout(() => {
      const eventId = sessionStorage.getItem('bookingEventId');
      if (eventId) {
        router.push(`/booking`);
      }
    }, 2000);
  }, 2000);
}
```

**What happens:**
- Simulate queue waiting (position decreases every ~6 seconds)
- When position reaches 1, show completion
- Auto-redirect to booking page

---

### 3. Booking Page - Seat Selection
**Files:**
- `app/booking/page.tsx` (server component)
- `app/booking/BookingPageContent.tsx` (client component - UPDATED)

**Changes:**
```typescript
// Get eventId from sessionStorage when component mounts
useEffect(() => {
  const id = searchParams.get('eventId') || sessionStorage.getItem('bookingEventId');
  if (id) {
    setEventIdState(id);
    setEventId(id);
  }
}, [searchParams, setEventId]);

// Fetch event data
useEffect(() => {
  if (!eventId) {
    setIsLoading(false);
    return;
  }

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      const [eventData, seatMapData] = await Promise.all([
        eventsApi.getById(eventId),
        (eventsApi as any).getSeats?.(eventId),
      ]);
      setEvent(eventData);
      setSeatMap(seatMapData);
    } catch (err) {
      setError(err?.message || 'Không thể tải sự kiện');
    } finally {
      setIsLoading(false);
    }
  };

  loadEvent();
}, [eventId]);
```

**Components:**
- `SeatSelection` - Select seats from the map
- `CheckoutSummary` - Shows total price + "Xác nhận đặt vé" button

**Button Action:**
```typescript
const handleConfirmBooking = async () => {
  try {
    // Navigate to checkout - don't call confirmBooking yet
    router.push('/checkout');
  } catch (err) {
    console.error('Navigation failed:', err);
  }
};
```

**What happens:**
- Fetch event details and seat map from backend
- User selects seats by clicking on seat grid
- Seats are locked via `POST /bookings/lock` (from lockSeat in BookingContext)
- User clicks "Xác nhận đặt vé" to proceed to checkout

---

### 4. Checkout Page - Payment Selection
**File:**
- `app/checkout/CheckoutPageContent.tsx` (UPDATED)

**Changes:**
```typescript
const handleConfirmPayment = async () => {
  try {
    await confirmBooking(selectedPayment);
    
    // Store booking details in sessionStorage for success page
    if (booking) {
      sessionStorage.setItem('bookingDetails', JSON.stringify({
        bookingId: booking.id,
        eventTitle: booking.event_id,
        seatCount: booking.seats?.length || 0,
        totalAmount: booking.total_amount || 0,
      }));
    }
    
    // Redirect to success page
    router.push('/success');
  } catch (err) {
    console.error('Payment confirmation failed:', err);
  }
};
```

**What happens:**
- Show event info, selected seats, and total price
- User selects payment method
- User clicks "Xác nhận thanh toán" button
- Backend processes payment via `POST /bookings/checkout`
- Booking details saved to sessionStorage
- User redirected to success page

---

### 5. Success Page (NEW - CREATED)
**File:**
- `app/success/page.tsx` (CREATED)

**Features:**
- ✅ Shows success message with animation
- 📋 Displays booking summary (if available)
- ✨ Shows next steps (check email, print ticket, bring ID)
- 🎫 Button to view tickets
- 📊 Auto-redirect to dashboard after 5 seconds
- ⏱️ Countdown timer visible

**Auto-redirect Code:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        router.push('/dashboard');
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [router]);
```

**What happens:**
- Show success confirmation message
- Display booking details if available (from sessionStorage)
- Show helpful next steps
- Auto-redirect to /dashboard after 5 seconds
- User can manually click "Xem vé của tôi" or "Quay về dashboard"

---

## 🔌 Backend API Integration

### APIs Used:

#### 1. Get Events
```
GET /api/v1/events?page=1&limit=12
Response: { success, data: [events...], pagination }
```

#### 2. Get Event Detail
```
GET /api/v1/events/:id
Response: { success, data: { ...event details } }
```

#### 3. Get Event Seats
```
GET /api/v1/events/:id/seats
Response: { success, data: { ...seat map } }
```

#### 4. Lock Seat (Booking)
```
POST /api/v1/bookings/lock
Headers: { Authorization: "Bearer {token}" }
Body: { event_id, seat_id }
Response: { success, data: { id, booking_id, status: 'pending' } }
```

#### 5. Checkout (Complete Payment)
```
POST /api/v1/bookings/checkout
Headers: { Authorization: "Bearer {token}" }
Body: { booking_id, payment_method? }
Response: { success, data: { id, status: 'completed', ticket_code } }
```

---

## 💾 State Management

### BookingContext (lib/context/BookingContext.tsx)
Manages:
- `booking` - Current booking object
- `selectedSeatIds` - Array of selected seat IDs
- `eventId` - Current event being booked
- `isLoading` - API call loading state
- `error` - Error messages
- `tickets` - User's purchased tickets

Methods:
- `setEventId(id)` - Set current event
- `lockSeat(seatId)` - Lock a seat (API call)
- `confirmBooking(paymentMethod?)` - Confirm and checkout (API call)
- `getTickets()` - Fetch user tickets (API call)
- `clearBooking()` - Reset booking state

---

## 📦 sessionStorage Usage

**Keys Used:**
1. `bookingEventId` - Event ID for current booking
2. `selectedSeats` - JSON array of selected seat IDs (optional)
3. `bookingDetails` - Booking summary for success page

**Example:**
```typescript
sessionStorage.setItem('bookingEventId', eventId);
sessionStorage.setItem('bookingDetails', JSON.stringify({
  bookingId: booking.id,
  eventTitle: booking.event_id,
  seatCount: booking.seats?.length || 0,
  totalAmount: booking.total_amount || 0,
}));
```

---

## ✅ Testing the Flow

### Prerequisites:
1. Backend running on http://localhost:8000
2. Frontend running on http://localhost:3000
3. Logged in user (token in localStorage)
4. At least one published event in database

### Test Steps:
1. Go to `/events` - See event list
2. Click "Mua vé ngay" on any event - Redirected to `/queue`
3. Wait for queue to complete - Auto-redirects to `/booking`
4. Select seats - Seats get locked via API
5. Click "Xác nhận đặt vé" - Redirects to `/checkout`
6. Select payment method - Click "Xác nhận thanh toán"
7. See success page - Auto-redirects to `/dashboard` after 5s

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank booking page | Missing eventId | Check sessionStorage has bookingEventId |
| Seats not showing | API error loading seats | Check /events/:id/seats endpoint |
| Redirect not working | sessionStorage not persisted | Use sessionStorage not localStorage for temp data |
| Not auto-redirecting from success | Interval not cleared | Check useEffect cleanup |

---

## 📝 Files Changed Summary

| File | Type | Change |
|------|------|--------|
| `app/components/events/EventDetailContent.tsx` | Update | Modified "Mua vé ngay" button handler |
| `app/queue/page.tsx` | Update | Added auto-redirect to /booking when position=1 |
| `app/booking/BookingPageContent.tsx` | Update | Get eventId from sessionStorage + fetch event |
| `app/checkout/CheckoutPageContent.tsx` | Update | Redirect to /success after payment |
| `app/success/page.tsx` | Create | NEW - Success page with auto-redirect |

---

## 🎉 Flow Complete!

The entire end-to-end booking flow is now integrated:
- ✅ Events → Queue → Booking → Checkout → Success → Dashboard
- ✅ All pages connected via proper redirects
- ✅ State management via BookingContext
- ✅ Backend APIs integrated
- ✅ sessionStorage for cross-page data persistence
- ✅ Auto-redirects with appropriate timing
- ✅ Success page with 5-second countdown to dashboard

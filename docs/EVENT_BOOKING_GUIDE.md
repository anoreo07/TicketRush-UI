# Event Booking System - Complete Implementation Guide

## 📋 Overview

Hệ thống đặt vé sự kiện hoàn chỉnh với flow:

```
Events List → Event Detail → Seat Selection → Checkout → Payment → Tickets
```

---

## 🏗️ Architecture

### Layer Structure

```
UI Components
├── EventCard - Hiển thị sự kiện
├── EventsList - Danh sách sự kiện
├── EventDetail - Chi tiết sự kiện
├── SeatMap - Sơ đồ ghế
├── CheckoutSummary - Tóm tắt đơn hàng
└── TicketsList - Danh sách vé

Contexts
├── EventBookingContext - Global state
└── EnhancedBookingContext - Booking flow

Hooks
├── useEvents - Fetch events
├── useBookingFlow - Lock/confirm flow
├── useBookingSeatManager - Manage seat state
└── useEventBooking - Combined context hook

API Layer
├── eventsApi - Event operations
├── bookingApi - Booking operations
└── adminEventsApi - Admin operations
```

---

## 📁 Files Created/Updated

### New Files

```
lib/
├── api/
│   └── events.ts ✨ - Event API service
├── hooks/
│   ├── useEvents.ts ✨ - Events hook
│   └── useBookingFlow.ts ✨ - Booking flow hook
│   └── useBookingSeatManager.ts ✨ - Seat state management
│   └── useEventBooking.ts ✨ - Combined hook
└── context/
    ├── EventBookingContext.tsx ✨ - Global booking context
    └── EnhancedBookingContext.tsx ✨ - Enhanced booking context

app/
├── components/
│   └── events/
│       └── EventCard.tsx ✨ - Event card component
├── events/
│   └── page.tsx ✨ - Events list page
└── ...

docs/
└── BOOKING_FLOW_ARCHITECTURE.md
    └── EVENT_BOOKING_GUIDE.md ✨ - This file
```

---

## 🔄 Complete Flow

### 1. Events List Page (`/events`)

**Component**: `app/events/page.tsx`

**What it does**:
- Fetch events from `GET /api/v1/events?page=1&limit=12&status=published`
- Display events grid with `EventCard` components
- Support pagination
- Support search

**State**:
```typescript
{
  events: Event[]
  pagination: { page, limit, total, pages }
  isLoading: boolean
  error: string | null
}
```

**User Actions**:
- Click on event card → Select event → Load event details + seat map
- Search → Filter events by query
- Pagination → Navigate between pages

---

### 2. Event Detail & Seat Selection

**Components**: 
- `EnhancedSeatSelection` - Hiển thị sơ đồ ghế
- `CheckoutSummary` - Tóm tắt đơn hàng

**API Calls**:
- `GET /api/v1/events/:id` - Get event details
- `GET /api/v1/events/:id/seats` - Get seat map

**Seat States**:
```
available       → Ghế trống, có thể click
locked          → Ghế đang giữ bởi user hiện tại (vàng)
locked_by_other → Ghế đang giữ bởi user khác (xám)
sold            → Ghế đã bán (đỏ)
```

**Countdown Timer**:
```typescript
// Auto-unlock after locked_until
const timeRemaining = locked_until - now
// Update every 1 second
// When timeRemaining <= 0 → status = 'available'
```

---

### 3. Seat Lock

**API**: `POST /bookings/lock`

**Request**:
```json
{
  "event_id": "evt-123",
  "seat_id": "vip-0"
}
```

**Response Success (200)**:
```json
{
  "id": "booking-456",
  "user_id": "user-789",
  "event_id": "evt-123",
  "seats": [...],
  "status": "pending",
  "created_at": "2024-04-18T10:00:00Z",
  "expires_at": "2024-04-18T10:10:00Z",
  "total_amount": 500000
}
```

**Frontend State Update**:
```typescript
seatStates[seatId] = {
  status: 'locked',
  lockInfo: {
    booking_id: 'booking-456',
    locked_at: '...',
    locked_until: '...',
    locked_by_user: true,
    time_remaining: 600000  // 10 minutes in ms
  }
}

// Start countdown: update time_remaining every second
// UI changes: ghế từ tím → vàng
```

**Error Handling**:
```typescript
// 409 Conflict - Ghế đã bị người khác giữ
seatStates[seatId].status = 'locked_by_other'
message = "Ghế đã có người giữ. Vui lòng chọn ghế khác."

// 400 Bad Request - Ghế đã bán
seatStates[seatId].status = 'sold'
message = "Ghế này đã được bán rồi."

// Auto-unlock sau 10 phút nếu user không confirm
if (timeRemaining <= 0) {
  seatStates[seatId].status = 'available'
}
```

---

### 4. Toggle Seat (Unlock)

**User Click Lần 2**:
```typescript
if (seatStates[seatId].status === 'locked' && seatStates[seatId].lockInfo.locked_by_user) {
  // Unlock immediately (optimistic)
  seatStates[seatId].status = 'available'
  // UI: ghế từ vàng → tím
  return
}
```

---

### 5. Checkout (Confirm Booking)

**API**: `POST /bookings/confirm`

**Request**:
```json
{
  "booking_id": "booking-456",
  "payment_method": "credit_card"
}
```

**Response Success (200)**:
```json
{
  "id": "booking-456",
  "status": "paid",
  "created_at": "...",
  "expires_at": "..."
}
```

**Frontend State Update**:
```typescript
// For each locked seat:
seatStates[seatId].status = 'sold'
// Stop countdown timer
// UI: ghế từ vàng → đỏ
```

**Error Handling**:
```typescript
// 410 Gone - Booking hết hạn
message = "Thời hạn giữ ghế đã hết. Vui lòng đặt lại."
// Auto-unlock all seats

// 402 Payment Failed
message = "Thanh toán thất bại. Vui lòng thử lại."
// Don't change seat state, allow retry

// 401 Unauthorized
message = "Vui lòng đăng nhập để tiếp tục"
// Redirect to login
```

---

### 6. Get Tickets

**API**: `GET /users/me/tickets`

**Response**:
```json
[{
  "id": "ticket-789",
  "booking_id": "booking-456",
  "seat_id": "vip-0",
  "event_id": "evt-123",
  "qr_code": "data:image/png;base64,...",
  "issued_at": "2024-04-18T10:02:00Z"
}]
```

**Frontend**:
- Store tickets in context
- Display on `/tickets` page
- Show QR code, event info, seat details
- Allow download PDF

---

## 🎯 Context Usage

### EventBookingProvider

```tsx
import { EventBookingProvider } from '@/lib/context/EventBookingContext'

export default function Layout({ children }) {
  return (
    <EventBookingProvider>
      {children}
    </EventBookingProvider>
  )
}
```

### useEventBooking Hook

```tsx
import { useEventBooking } from '@/lib/context/EventBookingContext'

export default function MyComponent() {
  const {
    // Events
    events,
    currentEvent,
    seatMap,
    pagination,
    stage,

    // Booking
    booking,
    tickets,
    seatStates,

    // Actions
    fetchEvents,
    selectEvent,
    lockSeat,
    confirmBooking,
    getTickets,

    // Utils
    canConfirmBooking,
    getLockedSeats,

    // Status
    isLoading,
    error,
    errorCode,
  } = useEventBooking()

  return (
    <div>
      {error && <AlertError message={error} />}
      {isLoading && <LoadingSpinner />}
      
      {stage === 'events' && <EventsList events={events} />}
      {stage === 'seat-selection' && <SeatMap seatMap={seatMap} />}
      {stage === 'checkout' && <CheckoutSummary />}
      {stage === 'tickets' && <TicketsList tickets={tickets} />}
    </div>
  )
}
```

---

## 🚨 Error Codes & Messages

| Code | HTTP | Message | Action |
|------|------|---------|--------|
| SEAT_CONFLICT | 409 | "Ghế đã có người giữ" | Choose different seat |
| SEAT_SOLD | 400 | "Ghế đã được bán" | Choose different seat |
| BOOKING_EXPIRED | 410 | "Thời hạn hết hạn" | Start over |
| PAYMENT_FAILED | 402 | "Thanh toán thất bại" | Retry payment |
| UNAUTHORIZED | 401 | "Vui lòng đăng nhập" | Redirect to login |
| NETWORK_ERROR | - | "Lỗi kết nối" | Retry |

---

## 🔐 Security

### Double Booking Prevention
- Backend: Atomic seat lock operation
- 10-minute lock expiry
- 409 Conflict on concurrent locks
- Frontend: Optimistic update + rollback

### Payment Safety
- Verify booking exists before confirm
- Check user ownership (JWT)
- Verify seat state before confirm
- PCI compliance for card data

### Token Management
- Include JWT in all auth API calls
- Refresh on 401 Unauthorized
- Logout on 403 Forbidden
- Clear tokens on error

---

## 📊 State Diagram

```
┌──────────────────┐
│   EVENTS         │ ← User loads /events
└────────┬─────────┘
         │ click event card
         ▼
┌──────────────────────────┐
│  SEAT_SELECTION          │ ← Load event detail + seats
│  (fetch seats)           │
└────────┬─────────────────┘
         │
         │ click available seat
         ▼ POST /bookings/lock
┌──────────────────────────┐
│  LOCKED                  │ ← Timer: 10 min countdown
│  (yellow, can unlock)    │
│                          │
│ click payment → CHECKOUT │
└────────┬─────────────────┘
         │
         │ click confirm
         ▼ POST /bookings/confirm
┌──────────────────────────┐
│  PAYMENT                 │ ← Success/Fail
└────────┬─────────────────┘
         │ success
         ▼
┌──────────────────────────┐
│  TICKETS                 │ ← GET /users/me/tickets
│  (QR codes, download)    │
└──────────────────────────┘
```

---

## 🧪 Testing Checklist

### Happy Path
- [ ] Load events list
- [ ] Search events
- [ ] Pagination works
- [ ] Click event → load details
- [ ] Click seat → lock
- [ ] Click checkout → confirm
- [ ] Payment success → view tickets

### Error Scenarios
- [ ] Click locked seat → show "Đã có người giữ"
- [ ] Click sold seat → show "Đã bán"
- [ ] Wait 10 min → seat auto-unlock
- [ ] Confirm after expire → show "Hết hạn"
- [ ] Network error → retry works
- [ ] Logout → redirect to login

### Edge Cases
- [ ] Toggle seat (click twice) works
- [ ] Multiple tabs race condition
- [ ] Slow network doesn't break UI
- [ ] Mobile responsive layout
- [ ] Accessibility (keyboard, screen reader)

---

## 🚀 Integration Steps

### 1. Setup Provider in Layout
```tsx
// app/layout.tsx
import { EventBookingProvider } from '@/lib/context/EventBookingContext'

export default function Layout({ children }) {
  return (
    <EventBookingProvider>
      {children}
    </EventBookingProvider>
  )
}
```

### 2. Update Navigation Links
```tsx
// app/components/TopNavBar.tsx
// "Sự kiện" → href="/events"
// "Vé của tôi" → href="/tickets"
```

### 3. Create Event Pages
- [ ] `/events` - List all events
- [ ] `/events/:id` - Event detail (optional)
- [ ] `/booking` - Seat selection + checkout
- [ ] `/checkout` - Payment confirmation
- [ ] `/queue` - Virtual queue
- [ ] `/tickets` - Tickets display

### 4. Add Material Icons
```html
<!-- public/index.html or next.config.js -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

---

## 📞 API Reference

### Events
```
GET /api/v1/events
GET /api/v1/events/:id
GET /api/v1/events/:id/seats
GET /api/v1/events/trending
GET /api/v1/events/search?q=
```

### Booking
```
POST /bookings/lock
POST /bookings/confirm
GET /users/me/tickets
POST /bookings/:id/cancel
```

### Admin (if available)
```
POST /api/v1/admin/events
PATCH /api/v1/admin/events/:id
PATCH /api/v1/admin/events/:id/publish
DELETE /api/v1/admin/events/:id
```

---

## 🎨 Component Props

### EventCard
```tsx
<EventCard 
  event={event}
  onClick={(eventId) => {}}
/>
```

### EnhancedSeatSelection
```tsx
<EnhancedSeatSelection />
// Uses useEventBooking internally
```

### CheckoutSummary
```tsx
<CheckoutSummary />
// Uses useEventBooking internally
```

### EventsList
```tsx
<EventsList 
  events={events}
  isLoading={isLoading}
  error={error}
/>
```

---

## 🔗 Dependencies

- React 19+
- Next.js 16+
- TypeScript
- Tailwind CSS
- Material Symbols Icons
- Native Fetch API (no axios)

---

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🎓 Learning Resources

- `lib/api/` - API client patterns
- `lib/hooks/` - Custom hooks patterns
- `lib/context/` - Context API patterns
- `app/components/` - Component patterns
- `docs/BOOKING_FLOW_ARCHITECTURE.md` - Detailed flow docs

---

## ✅ Completion Checklist

- [x] Events API service created
- [x] Booking flow hooks created
- [x] Global context created
- [x] EventCard component created
- [x] Events list page created
- [x] Error handling implemented
- [x] Countdown timer logic
- [x] Seat state management
- [x] Documentation complete

---

## 🎯 Next Steps

1. Test with real backend API
2. Add analytics tracking
3. Add email notifications
4. Add mobile app version
5. Add admin dashboard
6. Performance optimization
7. E2E testing
8. Load testing

---

**Status**: ✅ Complete and Ready for Integration

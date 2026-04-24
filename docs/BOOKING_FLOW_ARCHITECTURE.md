# Booking Flow Architecture - Hướng Dẫn

## 📋 Tổng Quan

Hệ thống quản lý booking flow cho phép:
1. **Lock Seat** (Giữ ghế) - 10 phút
2. **Confirm Booking** (Xác nhận thanh toán)
3. **Get Tickets** (Lấy vé)

Với xử lý đầy đủ các trường hợp lỗi: conflict, expired, sold.

---

## 🏗️ Architecture

### Layers

```
Components (UI Layer)
├── EnhancedSeatSelection - Hiển thị ghế, xử lý click
├── CheckoutSummary - Xác nhận thanh toán
└── TicketsPage - Hiển thị vé

Hooks (Business Logic Layer)
├── useBookingSeatManager - Quản lý state của từng ghế
├── useBookingFlow - Quản lý toàn bộ flow (lock/confirm)
└── useEnhancedBooking - Context hook

Context (State Management)
└── EnhancedBookingContext - Global booking state

API Layer
└── bookingApi - API calls
```

### State Management

#### 1. **SeatState** (Mỗi ghế)

```typescript
type SeatStatus = 'available' | 'locked' | 'sold' | 'locked_by_other'

interface SeatState {
  status: SeatStatus
  lockInfo?: {
    booking_id: string
    locked_at: ISO string
    locked_until: ISO string
    locked_by_user: boolean
    time_remaining: number (milliseconds)
  }
  error?: string
}
```

#### 2. **BookingFlowState** (Toàn bộ booking)

```typescript
interface BookingFlowState {
  booking: BookingResponse | null
  isLoading: boolean
  error: string | null
  errorCode: BookingErrorType
}
```

---

## 🔄 Flow Chi Tiết

### Step 1: User Click Seat (Lock)

```typescript
// User click trên ghế trống
await lockSeat(seatId)

// Backend:
// POST /bookings/lock
// {
//   event_id: "evt-123",
//   seat_id: "vip-0"
// }

// Response Success (200):
// {
//   id: "booking-456",
//   event_id: "evt-123",
//   seats: [...],
//   status: "pending",
//   created_at: "2024-04-18T10:00:00Z",
//   expires_at: "2024-04-18T10:10:00Z"  // +10 min
// }

// Frontend Action:
// 1. Update seatStates[seatId]:
//    status: "locked"
//    lockInfo.locked_until: "2024-04-18T10:10:00Z"
//    lockInfo.time_remaining: 600000 (ms)
//
// 2. Start countdown timer - update time_remaining mỗi giây
// 3. Auto-unlock nếu time_remaining <= 0
// 4. Change UI: ghế từ tím → vàng
```

#### Error Handling:

```typescript
// 409 Conflict - Ghế đã bị người khác giữ
{
  "success": false,
  "message": "Ghế đã có người giữ",
  "code": "SEAT_CONFLICT",
  "statusCode": 409
}
// Frontend:
// 1. setSeatLockedByOther(seatId, lockInfo)
// 2. status: "locked_by_other"
// 3. Show: "Ghế đã có người giữ"

// 400 Bad Request - Ghế đã bán
{
  "success": false,
  "message": "Ghế đã được bán",
  "code": "SEAT_SOLD",
  "statusCode": 400
}
// Frontend:
// 1. Update seatStates[seatId].status = "sold"
// 2. Show: "Ghế này đã được bán rồi"

// 401 Unauthorized - Không đăng nhập
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### Step 2: User Click Again (Unlock)

```typescript
// User click lần 2 vào ghế đang locked (vàng)
await lockSeat(seatId)  // Same function, different behavior

// Frontend Logic (Optimistic):
// if (seatState.status === 'locked' && seatState.lockInfo.locked_by_user) {
//   // Toggle: Unlock immediately
//   seatManager.unlockSeat(seatId)
//   return
// }

// Result:
// 1. seatStates[seatId].status: "locked" → "available"
// 2. Stop countdown timer
// 3. UI: ghế từ vàng → tím
```

---

### Step 3: User Confirm (Thanh Toán)

```typescript
// User click "Xác Nhận Đặt Vé" button
await confirmBooking(paymentMethod)

// Backend:
// POST /bookings/confirm
// {
//   booking_id: "booking-456",
//   payment_method: "credit_card"
// }

// Response Success (200):
// {
//   id: "booking-456",
//   event_id: "evt-123",
//   seats: [...],
//   status: "paid",
//   created_at: "2024-04-18T10:00:00Z",
//   expires_at: "2024-04-18T10:10:00Z"
// }

// Frontend Action:
// 1. Foreach locked seat:
//    seatManager.confirmSeat(seatId)
//    status: "locked" → "sold"
// 2. Stop countdown timer
// 3. Change UI: ghế từ vàng → đỏ
// 4. Fetch tickets: getTickets()
```

#### Error Handling:

```typescript
// 410 Gone - Booking hết hạn
{
  "success": false,
  "message": "Thời hạn giữ ghế đã hết",
  "code": "BOOKING_EXPIRED",
  "statusCode": 410
}
// Frontend:
// 1. Foreach locked seat: seatManager.unlockSeat(seatId)
// 2. status: "locked" → "available"
// 3. Show: "Đơn hàng đã hết hạn. Vui lòng đặt lại."

// 402 Payment Failed
{
  "success": false,
  "message": "Thanh toán thất bại",
  "code": "PAYMENT_FAILED",
  "statusCode": 402
}
// Frontend:
// Show error to user, don't change seat state
```

---

### Step 4: Get Tickets

```typescript
// After confirm success
const tickets = await getTickets()

// Backend:
// GET /bookings/tickets (with JWT)

// Response:
// [{
//   id: "ticket-789",
//   booking_id: "booking-456",
//   seat_id: "vip-0",
//   qr_code: "data:image/png;base64,...",
//   issued_at: "2024-04-18T10:02:00Z"
// }]

// Frontend:
// Store tickets in context, display on /tickets page
```

---

## 🎯 UI Component Integration

### Existing Components

#### 1. EnhancedSeatSelection.tsx
```tsx
<EnhancedSeatSelection />

// Features:
// - Display all seats with their state
// - Handle click to lock/unlock
// - Show countdown timer (MM:SS)
// - Error messages
// - Pre-selected seats (demo)
// - Sold seats (disabled)
```

#### 2. CheckoutSummary (Updated)
```tsx
<CheckoutSummary>
  // Shows:
  // - Event info
  // - Selected seats
  // - Total price
  // - Confirm button (disabled if no locked seats)
  // - Timer if booking about to expire
</CheckoutSummary>
```

#### 3. TicketsPage
```tsx
<TicketsPage>
  // Shows:
  // - List of tickets
  // - QR codes
  // - Event info
  // - Download PDF button
</TicketsPage>
```

---

## 🚨 Error Messages (User-Friendly)

| Error Code | HTTP | Message | Action |
|-----------|------|---------|--------|
| SEAT_CONFLICT | 409 | "Ghế đã có người giữ. Vui lòng chọn ghế khác." | Choose different seat |
| SEAT_SOLD | 400 | "Ghế này đã được bán rồi." | Choose different seat |
| BOOKING_EXPIRED | 410 | "Thời hạn giữ ghế đã hết. Vui lòng đặt lại." | Start over |
| PAYMENT_FAILED | 402 | "Thanh toán thất bại. Vui lòng thử lại." | Retry payment |
| NETWORK_ERROR | - | "Lỗi kết nối. Vui lòng kiểm tra internet." | Retry |
| UNKNOWN_ERROR | - | "Đã xảy ra lỗi. Vui lòng thử lại." | Retry |

---

## 🔧 Usage Examples

### 1. Basic Setup

```tsx
import { EnhancedBookingProvider } from '@/lib/context/EnhancedBookingContext'
import { EnhancedSeatSelection } from '@/app/components/booking/EnhancedSeatSelection'

export default function BookingPage() {
  return (
    <EnhancedBookingProvider>
      <EnhancedSeatSelection />
      <CheckoutSummary />
    </EnhancedBookingProvider>
  )
}
```

### 2. Use Booking State

```tsx
import { useEnhancedBooking } from '@/lib/context/EnhancedBookingContext'

export default function MyComponent() {
  const {
    booking,
    isLoading,
    error,
    lockSeat,
    confirmBooking,
    getLockedSeats,
  } = useEnhancedBooking()

  // Use state and actions
  const lockedSeats = getLockedSeats()
  console.log(`${lockedSeats.length} seats locked`)

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {booking && <p>Booking ID: {booking.id}</p>}
    </div>
  )
}
```

### 3. Handle Lock & Confirm

```tsx
const handlePayment = async () => {
  try {
    setIsProcessing(true)
    
    // Confirm booking
    await confirmBooking('credit_card')
    
    // Get tickets
    const tickets = await getTickets()
    
    // Redirect to tickets page
    router.push('/tickets')
  } catch (err) {
    console.error('Payment failed:', err)
  } finally {
    setIsProcessing(false)
  }
}
```

---

## 🧪 Testing Scenarios

### ✅ Happy Path
1. Click seat 1 → locked (vàng)
2. Click confirm → success → sold (đỏ)
3. View tickets → QR codes visible

### ⚠️ Conflict Scenario
1. User A locks seat 1
2. User B tries to lock seat 1
3. User B sees: "Ghế đã có người giữ"
4. After 10 min (or User A unlocks) → User B can lock it

### ⏱️ Timeout Scenario
1. User locks seat 1 (timer: 10:00)
2. Waits 10 minutes
3. Timer reaches 0 → auto-unlock
4. Seat becomes "available" again

### 🔄 Toggle Scenario
1. User locks seat 1 (yellow)
2. Changes mind → clicks again (yellow → purple)
3. Seat back to available
4. Can lock different seat

---

## 📊 State Diagram

```
┌─────────────────┐
│   AVAILABLE     │
└────────┬────────┘
         │ click (lock)
         ▼
┌─────────────────┐      timeout/click again
│    LOCKED       │ ◄─────────────────┐
│  (by me, 10m)   │                   │
└────────┬────────┘                   │
         │ confirm payment           │
         ▼                           │
┌─────────────────┐                  │
│     SOLD        │ ──────────────────┘
│   (confirmed)   │
└─────────────────┘

┌──────────────────────┐      timeout
│ LOCKED_BY_OTHER      │ ◄────────────┐
│ (by other user, 10m) │             │
└──────┬───────────────┘             │
       │                              │
       └──────────────────────────────┘
              becomes AVAILABLE
```

---

## 🔐 Security Considerations

1. **Double Booking Prevention**
   - Backend: Check seat status before locking
   - Lock expires: Auto-unlock after 10 min
   - Concurrent: 409 Conflict response

2. **Payment Verification**
   - Confirm only if booking exists
   - Check booking status before confirm
   - Verify user ownership (JWT)

3. **Token Management**
   - All API calls include JWT
   - Refresh token on 401
   - Logout on 403

---

## 📝 Files

- `lib/hooks/useBookingSeatManager.ts` - Seat state management
- `lib/hooks/useBookingFlow.ts` - Booking flow orchestration
- `lib/context/EnhancedBookingContext.tsx` - Global context
- `app/components/booking/EnhancedSeatSelection.tsx` - Seat UI
- `app/components/booking/CheckoutSummary.tsx` - Checkout UI (updated)
- `app/tickets/page.tsx` - Tickets display

---

## 🚀 Next Steps

1. ✅ Integrate EnhancedBookingContext into booking page
2. ✅ Update CheckoutSummary to use confirmBooking
3. ✅ Update SeatSelection to use lockSeat
4. ✅ Test all error scenarios
5. ✅ Performance optimization (memoization)
6. ✅ E2E testing

---

## 📞 Support

For issues or questions, refer to:
- API_SPEC.md - API documentation
- TESTING_GUIDE.md - Testing procedures

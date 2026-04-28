# 🎯 Quick Testing Guide - End-to-End Booking Flow

## ⚡ Quick Start (5 minutes)

### 1. Start Backend & Frontend
```bash
# Terminal 1: Backend
cd TicketRush-Backend/backend
npm run dev

# Terminal 2: Frontend  
cd UI
npm run dev
```

### 2. Create Test Event (if not exists)
```
1. Go to http://localhost:3000/events/create
2. Fill in:
   - Event Name: "Test Concert"
   - Description: "Amazing concert"
   - Start Time: Pick future date/time
   - Seat Grid: 6 rows × 10 cols
   - Price: 100000
   - Location: "Concert Hall"
3. Click "Tạo sự kiện"
```

### 3. Publish Event (via database)
```sql
-- In Supabase SQL editor:
UPDATE events 
SET status = 'published' 
WHERE title = 'Test Concert'
```

### 4. Test Full Booking Flow
```
1. Go to http://localhost:3000/events
   → See "Test Concert" in list
   
2. Click event card → Event Detail page
   → Click "Mua vé ngay"
   
3. Queue page appears
   → Wait 30 seconds (position auto-decreases)
   → Auto-redirects to /booking
   
4. Booking page
   → Click seats (A1, A2, etc.)
   → Click "Xác nhận đặt vé"
   
5. Checkout page
   → Select payment method
   → Click "Xác nhận thanh toán"
   
6. Success page
   → Shows "Thanh toán thành công! 🎉"
   → Shows countdown "5, 4, 3, 2, 1..."
   → Auto-redirects to /dashboard
```

---

## 📊 Flow Diagram

```
┌─────────────┐
│   EVENTS    │  GET /events
│  PAGE LIST  │  List all published events
└──────┬──────┘
       │ Click event card
       ▼
┌──────────────────────┐
│  EVENT DETAIL PAGE   │  GET /events/:id
│  Show event info     │  GET /events/:id/seats
│  "Mua vé ngay" btn   │
└──────┬───────────────┘
       │ Click button
       │ sessionStorage.set('bookingEventId')
       ▼
┌──────────────────────┐
│   QUEUE PAGE         │  Simulate queue
│  "Đang chờ lượt"     │  Position countdown
│  Auto-redirect ✓     │  When pos=1 → /booking
└──────┬───────────────┘
       │ Position reaches 1
       │ Auto redirect
       ▼
┌──────────────────────┐
│  BOOKING PAGE        │  GET /events/:id
│  Select seats        │  POST /bookings/lock
│  Show total price    │  (for each seat)
│  "Xác nhận đặt vé"   │
└──────┬───────────────┘
       │ Click confirm
       ▼
┌──────────────────────┐
│  CHECKOUT PAGE       │  Show booking summary
│  Review booking      │  Select payment method
│  Select payment      │  POST /bookings/checkout
│  "Xác nhận TT"       │
└──────┬───────────────┘
       │ Click confirm
       │ Payment processed
       │ sessionStorage.set('bookingDetails')
       ▼
┌──────────────────────┐
│  SUCCESS PAGE        │  Show confirmation
│  "Thanh toán thành   │  Show details
│   công! 🎉"          │  Countdown: 5s
│  Auto-redirect ✓     │  Auto → /dashboard
└──────┬───────────────┘
       │ 5 seconds
       ▼
┌──────────────────────┐
│  DASHBOARD PAGE      │  User's tickets
└──────────────────────┘
```

---

## 🔌 API Endpoints Used

### Events
```
GET /api/v1/events                    # List events
GET /api/v1/events/:id                # Event detail
GET /api/v1/events/:id/seats          # Seat map
```

### Booking
```
POST /api/v1/bookings/lock            # Lock seat (creates pending booking)
POST /api/v1/bookings/checkout        # Complete payment (confirms booking)
GET  /api/v1/bookings/my-tickets      # Get user's tickets
```

---

## 💾 sessionStorage Keys

```
bookingEventId          → Event ID for current booking
selectedSeats           → JSON array of selected seat IDs
bookingDetails          → Summary for success page
```

---

## 📁 Files Created/Modified

### Created
- `app/success/page.tsx` ✨ NEW
  - Success confirmation page
  - Auto-redirect after 5 seconds
  - Shows booking details if available

### Modified
- `app/components/events/EventDetailContent.tsx`
  - "Mua vé ngay" button → saves eventId to sessionStorage
  - Redirects to /queue

- `app/queue/page.tsx`
  - Auto-redirect to /booking when position = 1

- `app/booking/BookingPageContent.tsx`
  - Get eventId from sessionStorage
  - Fetch event data from backend

- `app/checkout/CheckoutPageContent.tsx`
  - Save booking details to sessionStorage
  - Redirect to /success on success

### Unchanged (Already Complete)
- `app/booking/page.tsx` (server component wrapper)
- `app/checkout/page.tsx` (server component wrapper)
- `app/queue/page.tsx` (queue simulation - enhanced)
- BookingContext (state management - already exists)
- bookingApi (API client - already exists)

---

## 🐛 Troubleshooting

### Queue page not auto-redirecting
**Problem:** Queue completes but doesn't redirect
**Check:**
- sessionStorage.bookingEventId exists
- Queue position reaches 1
- Console for errors

**Fix:**
```typescript
// In /queue/page.tsx, check interval cleanup:
useEffect(() => {
  const interval = setInterval(() => {
    // logic...
  }, 1000);
  return () => clearInterval(interval);
}, [...]);
```

### Booking page shows "Đang tải"
**Problem:** Page stuck loading
**Check:**
- Backend running (npm run dev)
- eventId in sessionStorage
- Event exists in database (status='published')

**Fix:**
```bash
# Check backend logs for errors
# Verify event:
SELECT id, title, status FROM events WHERE status='published';
```

### Checkout redirect fails
**Problem:** Click confirm but nothing happens
**Check:**
- API POST /bookings/checkout working
- Auth token valid
- Booking object exists

**Fix:**
```typescript
// In CheckoutPageContent.tsx, add error logging:
const handleConfirmPayment = async () => {
  try {
    console.log('Booking:', booking);
    await confirmBooking(selectedPayment);
    console.log('✅ Payment success');
    router.push('/success');
  } catch (err) {
    console.error('❌ Payment error:', err);
  }
};
```

### Success page not auto-redirecting
**Problem:** Shows countdown but doesn't redirect
**Fix:**
```typescript
// In /success/page.tsx:
useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((prev) => {
      console.log('Countdown:', prev);
      if (prev <= 1) {
        console.log('Redirecting...');
        router.push('/dashboard');
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(interval);
}, [router]);
```

---

## ✅ Verification Checklist

- [ ] Backend running on :8000
- [ ] Frontend running on :3000
- [ ] User logged in
- [ ] Test event created and published
- [ ] Event appears on /events
- [ ] "Mua vé ngay" button works
- [ ] Queue page shows position decreasing
- [ ] Auto-redirects to /booking when position=1
- [ ] Seats can be selected and locked
- [ ] Can proceed to checkout
- [ ] Checkout shows booking summary
- [ ] Can select payment method
- [ ] Success page shows confirmation
- [ ] Countdown visible (5, 4, 3, 2, 1...)
- [ ] Auto-redirects to /dashboard

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs
3. Check Database (Supabase)
4. Verify sessionStorage values
5. Review API responses in Network tab

---

## 🎉 You're All Set!

The complete end-to-end booking flow is now ready for testing!

```
Events → Queue → Booking → Checkout → Success → Dashboard
   ✅      ✅       ✅         ✅       ✅        ✅
```

Enjoy! 🚀

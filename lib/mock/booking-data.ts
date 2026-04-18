/**
 * Mock data for event booking
 */

import { EventBookingDetails, Seat } from '@/lib/types/booking';

export const mockEventBooking: EventBookingDetails = {
  id: 'evt_vct_2024',
  title: 'VCT Pacific Stage 1 Finals',
  description:
    'Chứng kiến những khoảnh khắc nghẹt thở tại trận chung kết tổng VCT Pacific Stage 1. Những đội tuyển xuất sắc nhất khu vực sẽ đối đầu trực tiếp để tìm ra nhà vô địch mới và giành tấm vé tham dự Masters. Một bữa tiệc âm thanh, ánh sáng và những pha clutch đỉnh cao đang chờ đón bạn.',
  date: '2024-05-15',
  time: '18:00',
  location: 'Nhà thi đấu Quân khu 7',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCmyLwgN6pwq62iqEefBPrC7H0Uk07uiKSbe92ry6qZ7RJfI9rOXlRp9wSWf5vvKYQ6RkngmGCWkjRuPwqtnp_xigCYAr7uW_FvAAw_tB70FoHixP_lEq6bMRorfhv3AbNP9mofkSLPiFRQ0BBInE6bBp_LaKtX6kPgI0AhkLsSudsjTiqjpm8XGcE_y0MDUX6xZp89j26dLdudoKnFcxWr2UkL7hN6wJqpdXwQro5yT3r6H8gPJRQF5hJFPX8cc4XuVOdHPV9nY08',
  category: 'Esports Premium',
  organizer: {
    name: 'VNG Games & Riot Games',
    icon: 'stadium',
  },
  totalSeats: 500,
  availableSeats: 245,
  vipPrice: 1200000,
  standardPrice: 600000,
  serviceFee: 45000,
};

export const mockSelectedSeats = [
  {
    id: 'seat_a5',
    row: 'A',
    number: 5,
    status: 'selected' as const,
    type: 'vip' as const,
    price: 1200000,
    selectedAt: new Date(),
  },
  {
    id: 'seat_a6',
    row: 'A',
    number: 6,
    status: 'selected' as const,
    type: 'vip' as const,
    price: 1200000,
    selectedAt: new Date(),
  },
];

// Generate mock seat map
export const generateMockSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 12;

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isVip = rows.indexOf(row) < 2;
      const rand = Math.random();
      let status: 'available' | 'sold' | 'locked' = 'available';

      if (rand > 0.8) status = 'sold';
      else if (rand > 0.7) status = 'locked';

      seats.push({
        id: `seat_${row}${i}`,
        row,
        number: i,
        status,
        type: isVip ? 'vip' : 'standard',
        price: isVip ? 1200000 : 600000,
      });
    }
  });

  return seats;
};

// ============================================================
// Payment Methods
// ============================================================

export const mockPaymentMethods = [
  {
    id: 'pm_credit_card',
    name: 'Thẻ tín dụng / Ghi nợ',
    type: 'credit_card',
    icon: 'credit_card',
    description: 'Visa, Mastercard, JCB',
    is_available: true,
  },
  {
    id: 'pm_momo',
    name: 'Ví điện tử MoMo',
    type: 'wallet',
    icon: 'momo',
    description: 'Thanh toán nhanh chóng',
    is_available: true,
    badge_color: '#A50064',
    badge_text: 'MoMo',
  },
  {
    id: 'pm_zalopay',
    name: 'Ví ZaloPay',
    type: 'wallet',
    icon: 'zalopay',
    description: 'Liên kết tài khoản Zalo',
    is_available: true,
    badge_color: '#008FE5',
    badge_text: 'ZP',
  },
  {
    id: 'pm_shopeepay',
    name: 'Ví ShopeePay',
    type: 'wallet',
    icon: 'shopeepay',
    description: 'Nhiều ưu đãi hấp dẫn',
    is_available: true,
    badge_color: '#EE4D2D',
    badge_text: 'SPP',
  },
];

// ============================================================
// Payment Confirmation Event Data
// ============================================================

export const mockPaymentEvent = {
  id: 'evt_lumina_2024',
  title: 'Lumina Soundscape 2024',
  description:
    'Chứng kiến những khoảnh khắc âm nhạc tuyệt vời nhất tại lễ hội âm nhạc Lumina Soundscape 2024. Với dàn nghệ sĩ quốc tế hàng đầu và công nghệ âm thanh tiên tiến nhất.',
  category: 'Music Festival',
  location: 'Trung tâm Hội chợ SECC, Q.7, TP.HCM',
  date: '2024-05-25',
  time: '19:00',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCfw94FTNQzpihnxs5kyWyTma8SiAYLK7-vWK8vKFZP7mI08OTnCeI52CpZl-VsujmfzTaamAlB-ilK-jfaCBbSPWl7LlIaI_VcbO15fMAvA8B6xVM4Mvt2e0DMSh2_loUJ0vFBCoQuJ0K8IyQi9BHpLzbjm9_w1omTAUcWOxB8csbtIL4dKEQ8khJALpQ1vxlAFL26nG_q4-WElKcwkpfHpehN7W_k4E252s80odKBBGUBOjehBUMUs1kegD6TiAggFdNmzCHvNQg',
  status: 'upcoming',
};

export const mockPaymentSeats = [
  {
    id: 'f12',
    section: 'GA',
    row: 'F',
    number: 12,
    price: 1500000,
  },
  {
    id: 'f13',
    section: 'GA',
    row: 'F',
    number: 13,
    price: 1500000,
  },
];

export const mockPriceBreakdown = {
  subtotal: 3000000,
  service_fee: 45000,
  vat: 304500,
  discount: 0,
  total: 3349500,
};

// ============================================================
// Utility Functions
// ============================================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const calculateTimeRemaining = (): string => {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 15 * 60000); // 15 minutes
  const remaining = Math.floor((expiryTime.getTime() - now.getTime()) / 1000);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

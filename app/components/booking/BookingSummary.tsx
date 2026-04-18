'use client';

import { SelectedSeat, EventBookingDetails } from '@/lib/types/booking';

interface BookingSummaryProps {
  event: EventBookingDetails;
  selectedSeats: SelectedSeat[];
  timeRemaining: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const BookingSummary = ({
  event,
  selectedSeats,
  timeRemaining,
  onConfirm,
  isLoading = false,
}: BookingSummaryProps) => {
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = event.serviceFee;
  const total = subtotal + serviceFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="lg:col-span-4 sticky top-28 space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(48,30,201,0.06)]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container">
          <h2 className="text-xl font-headline font-bold">Tóm tắt đơn hàng</h2>
          <div className="flex items-center gap-2 text-error font-bold">
            <span className="material-symbols-outlined text-sm">timer</span>
            <span className="text-sm">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Selected Seats List */}
        <div className="space-y-4 mb-8">
          {selectedSeats.length === 0 ? (
            <p className="text-center text-on-surface-variant text-sm py-4">
              Chưa có ghế nào được chọn
            </p>
          ) : (
            selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-4 bg-surface rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
                    <span className="font-bold">
                      {seat.row}
                      {seat.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Ghế {seat.type === 'vip' ? 'VIP' : 'Standard'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Dãy {seat.row}, Hàng {seat.number}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold">
                  {formatCurrency(seat.price)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-on-surface-variant text-sm">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant text-sm">
            <span>Phí dịch vụ</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-dashed border-outline-variant">
            <span className="font-bold">Tổng tiền</span>
            <span className="text-2xl font-headline font-extrabold text-tertiary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onConfirm}
          disabled={selectedSeats.length === 0 || isLoading}
          className="w-full py-4 bg-tertiary text-white rounded-full font-bold shadow-lg shadow-tertiary/30 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
        >
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <p className="text-center text-[10px] text-on-surface-variant mt-4 px-4 leading-relaxed">
          Bằng cách xác nhận, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật
          của TicketRush.
        </p>
      </div>

      {/* Organizer Widget */}
      <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400">
            {event.organizer.icon || 'stadium'}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
            Ban tổ chức
          </p>
          <p className="text-sm font-bold">{event.organizer.name}</p>
        </div>
      </div>
    </aside>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';
import { bookingApi, BookingResponse, eventsApi, Event } from '@/lib/api';
import { formatCurrency } from '@/lib/mock/booking-data';

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<(BookingResponse & { eventDetails?: Event })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [targetBookingId, setTargetBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await bookingApi.getMyBookings('pending');
        
        // Group seats by booking_id
        const groupedByBooking: Record<string, any> = {};
        
        response.forEach((seat: any) => {
          // Handle both array and object response for booking_items
          let bookingId = '';
          if (Array.isArray(seat.booking_items)) {
            bookingId = seat.booking_items[0]?.booking_id;
          } else if (seat.booking_items) {
            bookingId = seat.booking_items.booking_id;
          }
          
          const finalBookingId = bookingId || `temp-${seat.id}`;
          
          if (!groupedByBooking[finalBookingId]) {
            groupedByBooking[finalBookingId] = {
              id: finalBookingId,
              eventDetails: seat.events,
              seatDetails: [],
              total_amount: 0,
              isTemp: !bookingId
            };
          }
          
          groupedByBooking[finalBookingId].seatDetails.push({
            id: seat.id,
            row: String.fromCharCode(65 + (seat.row_index || 0)),
            number: (seat.col_index || 0) + 1
          });
          
          groupedByBooking[finalBookingId].total_amount += (seat.price || 0);
        });

        setDrafts(Object.values(groupedByBooking));
      } catch (error) {
        console.error('Failed to fetch drafts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleContinue = (bookingId: string) => {
    if (bookingId.startsWith('temp-')) {
      alert('Không tìm thấy đơn hàng tương ứng với ghế này. Vui lòng chọn lại ghế tại trang sự kiện.');
      return;
    }
    console.log('[DEBUG] DraftsPage: Continuing with bookingId:', bookingId);
    // Chuyển hướng đến checkout với ID đơn hàng nháp
    router.push(`/checkout?bookingId=${bookingId}`);
  };

  const handleCancel = (bookingId: string) => {
    if (bookingId.startsWith('temp-')) {
      alert('Không thể hủy đơn hàng tạm thời. Ghế sẽ tự động được giải phóng sau ít phút.');
      return;
    }
    setTargetBookingId(bookingId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!targetBookingId) return;

    setIsLoading(true);
    setShowModal(false);
    try {
      await bookingApi.cancel(targetBookingId);
      // Refresh drafts list
      const response = await bookingApi.getMyBookings('pending');
      // Reprocess groupedByBooking (or just reload page for simplicity but let's try to be smooth)
      window.location.reload();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
      setTargetBookingId(null);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col font-body">
      <TopNavBar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full pt-24" style={{ zoom: 0.85 }}>
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2 font-headline tracking-tight">Đơn hàng nháp</h1>
            <p className="text-slate-500 font-medium italic">Các ghế này đang được giữ riêng cho bạn trong vòng 10 phút.</p>
          </div>
          <div className="bg-[#e2dfff] text-[#301ec9] px-6 py-3 rounded-2xl flex items-center gap-3 border border-[#301ec9]/10">
            <span className="material-symbols-outlined animate-spin text-xl" style={{ animationDuration: '3s' }}>schedule</span>
            <span className="font-black text-sm uppercase tracking-wider">Đang khóa ghế (Locked)</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-[40px] h-72 animate-pulse shadow-sm border border-slate-100"></div>
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-5xl text-slate-300">event_seat</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-headline">Không có ghế nào đang giữ</h2>
            <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">Dường như bạn chưa chọn ghế hoặc thời gian giữ ghế đã hết hạn.</p>
            <button 
              onClick={() => router.push('/events')}
              className="bg-[#301ec9] text-white px-12 py-5 rounded-full font-black shadow-xl shadow-[#301ec9]/20 hover:scale-105 active:scale-95 transition-all"
            >
              Xem các sự kiện hot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {drafts.map((draft: any) => (
              <div 
                key={draft.id} 
                className="group bg-white rounded-[48px] overflow-hidden shadow-[0_30px_70px_rgba(48,30,201,0.08)] border border-slate-50 flex flex-col h-full hover:shadow-[0_40px_90px_rgba(48,30,201,0.12)] transition-all duration-500"
              >
                {/* Event Image & Status */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={draft.eventDetails?.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"} 
                    alt={draft.eventDetails?.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                      {draft.eventDetails?.category || "Sự kiện"}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-black mb-1 font-headline tracking-tight group-hover:text-tertiary transition-colors">
                      {draft.eventDetails?.title}
                    </h3>
                    <p className="text-xs font-bold flex items-center gap-1 opacity-80 uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      {draft.eventDetails?.start_time ? new Date(draft.eventDetails.start_time).toLocaleDateString('vi-VN') : "Sắp diễn ra"}
                    </p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Seats Detail */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vị trí chỗ ngồi</p>
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                          {draft.seatDetails?.length || 0} Ghế
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {draft.seatDetails?.map((seat: any) => (
                          <div key={seat.id} className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-xs font-black text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Dãy {seat.row} - Ghế {seat.number}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tiền thanh toán</p>
                        <p className="text-3xl font-black text-[#301ec9] tracking-tighter">
                          {formatCurrency(draft.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleCancel(draft.id)}
                      className="bg-white text-slate-400 font-headline font-black py-5 rounded-[2rem] border-2 border-slate-100 hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 group/cancel"
                    >
                      <span className="material-symbols-outlined text-xl group-hover/cancel:rotate-90 transition-transform">close</span>
                      <span>Hủy đơn</span>
                    </button>
                    <button 
                      onClick={() => handleContinue(draft.id)}
                      className="bg-[#191c1e] text-white font-headline font-black py-5 rounded-[2rem] hover:bg-[#301ec9] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 hover:translate-y-[-2px] active:scale-95"
                    >
                      <span>Thanh toán</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Cancel Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-2 font-headline">Xác nhận hủy đơn</h3>
            <p className="text-center text-slate-500 font-medium mb-8">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Các ghế đã chọn sẽ được giải phóng ngay lập tức.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setTargetBookingId(null);
                }}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-full hover:bg-slate-200 transition-colors"
              >
                Giữ lại đơn
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 bg-red-500 text-white font-bold py-4 rounded-full shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Đồng ý hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

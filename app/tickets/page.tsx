'use client';

import { useState } from 'react';
import TopNavBar from '@/app/components/TopNavBar';

interface Ticket {
  id: string;
  eventImage: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  zone: string;
  row: string;
  seat: string;
  qrCode: string;
  ticketCode: string;
  status: 'paid' | 'used' | 'pending';
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    eventImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGV15MtsBd90SWF3GVsQZcnu3lPmGY0BNxeRhyIX8OlFMMyKEQs8aucJf44d2DmCKRRwY7eD1qWuUTOUr8oknKvkxjrCRvRqXNsPA0B4fQsjviUE1oy7Q6S9UfYD3y8AaFS-XVrJ07I9cXeux1xa6LJmfdkf7P0pnS8oFWa-mbqvpPGBbss3kMJtAnfikYmcrCvAuE6CasYYxsR5Lt3oxSSBL0SrQxKOz-w1t8AGB83yIC3i2PNkQZYSn-N72nNajyRRkKUPjVK-w',
    eventTitle: 'Lễ hội Âm nhạc "Sóng Nhiệt Đới" 2024',
    eventDate: '19:00, Thứ Bảy, 15 Tháng 10, 2024',
    eventLocation: 'Sân vận động Quốc gia Mỹ Đình, Hà Nội',
    zone: 'VIP Gold',
    row: 'A',
    seat: '12',
    qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCshVPPKK7Brkfj5mS1uDRLEEkYTCvlSjzWOw9XU9PAZwuVGe8G9JDjdAW6o6msKJg9FGv0ha6Tht1fYZZk94X2GZefCLmrUUzKOVza-a3Cc_xkQXlMJQT2bLDEyOO0EgvNSRZf7FIFmX0A33u1aZTJWuO40SVNGIudA3k0euS5ga59F6L0xLFo2elP_dnAi2UIXHiC9kuyek3r_3SoJpEzdnYsryVRZL3U9tUrjHeeUtUCVV0NCzYPUHhSwX5d3X5Kmpq1gJKplh4',
    ticketCode: 'TR-782-910-VX',
    status: 'paid',
  },
  {
    id: '2',
    eventImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbkh7VJwaxH6TfsWZG60nRdMG4d1uDTjGoi4im2vtkGr2rPd2zUyWK9NBr51pL-D7FQK5ZumEcXkpeXXub8F63xaGzGhVHYTIPNSG95K0SJlxo5vvLnAc6tIEYGtK7wC_my0j-7Hz-Vp_mxkjf2TD1YHWMojXEHcbCyWveFdLr62yE22EEhUCxuzJAcD4BlHrvMcOzz-nnwqj8oW4ZJxz8U4k5tRpOxwbdX3aQhVLCceifbxBHTI-7-2Dp731U4Kvpq1o2bsAyOZo',
    eventTitle: 'Vở kịch Kinh điển: "Hồn Trương Ba, Da Hàng Thịt"',
    eventDate: '20:00, Thứ Sáu, 22 Tháng 11, 2024',
    eventLocation: 'Nhà hát Lớn Hà Nội, Tràng Tiền',
    zone: 'Tầng 1',
    row: 'H',
    seat: '24',
    qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA6KJiQwZX7PdlGorTJBNZ1zZ-7ME-y-DYKk_Cm0m1uFLoCU6I4R3PVIyM6_kar6cCZSim6WIVA_3Gu_tGe-CyFEQao0vtszZk9qhjil9r23MVd3IlanEK7JgfOlpd2OpWvdxLqn7MhhJDI-YfeSOD4wC7DqgSbCWA0Tpw37uiNVLpZOl0AbsGnm5UJsqfj2jeWxba1AEgGgqoaRc8tP_23H38lrkXkuRB6nZFLiPm0VpU1BHJ0yPI4400FPIuGtQYbm8KPrTEHJI',
    ticketCode: 'TR-221-199-HT',
    status: 'paid',
  },
];

export default function TicketsPage() {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const handleDownload = (ticketCode: string) => {
    console.log('Downloading ticket:', ticketCode);
    // Implement PDF download logic
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 md:pb-0">
      {/* TopAppBar */}
      <TopNavBar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary mb-4">
            Vé của tôi
          </h1>
          <p className="text-on-surface-variant font-medium">
            Quản lý và sử dụng các vé sự kiện bạn đã mua thành công.
          </p>
        </div>

        {/* Ticket List Container */}
        <div className="grid grid-cols-1 gap-10">
          {mockTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.06)] flex flex-col md:flex-row overflow-hidden border border-outline-variant/10 group transition-all duration-300 hover:translate-y-[-4px] cursor-pointer"
              onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
            >
              {/* Event Image */}
              <div className="md:w-1/4 relative overflow-hidden">
                <img
                  alt={ticket.eventTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={ticket.eventImage}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {ticket.status === 'paid' ? 'Đã thanh toán' : ticket.status === 'used' ? 'Đã sử dụng' : 'Chờ thanh toán'}
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex-1 p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-on-surface leading-tight mb-2">
                      {ticket.eventTitle}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span className="text-sm font-medium">{ticket.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm font-medium">{ticket.eventLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Info Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-outline-variant/30">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline uppercase font-bold tracking-wider">Khu vực</span>
                      <span className="text-lg font-bold text-primary">{ticket.zone}</span>
                    </div>
                    <div className="flex flex-col border-x border-outline-variant/30 px-4">
                      <span className="text-[11px] text-outline uppercase font-bold tracking-wider">Hàng</span>
                      <span className="text-lg font-bold text-primary">{ticket.row}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline uppercase font-bold tracking-wider">Số ghế</span>
                      <span className="text-lg font-bold text-primary">{ticket.seat}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(ticket.ticketCode);
                    }}
                    className="w-full md:w-auto bg-tertiary text-on-tertiary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-tertiary-container transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Tải vé (PDF)
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-32 w-px bg-outline-variant/30 border-dashed border-l"></div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-xl">
                  <div className="bg-white p-3 rounded-lg shadow-inner mb-3">
                    <img alt="QR Check-in" className="w-32 h-32 md:w-40 md:h-40" src={ticket.qrCode} />
                  </div>
                  <span className="text-[10px] font-mono text-outline uppercase font-bold">{ticket.ticketCode}</span>
                  <span className="text-[11px] font-bold text-primary mt-1">Dùng để Check-in</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BottomNavBar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 w-full rounded-t-[2rem] z-50 bg-white dark:bg-slate-900 shadow-[0_-10px_30px_rgba(48,30,201,0.08)] flex justify-around items-center px-4 pb-6 pt-3">
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 active:scale-90 transition-transform duration-150" href="/">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-['Be_Vietnam_Pro'] text-[11px] font-medium mt-1">Sự kiện</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-2xl px-5 py-2 active:scale-90 transition-transform duration-150" href="/tickets">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_activity
          </span>
          <span className="font-['Be_Vietnam_Pro'] text-[11px] font-medium mt-1">Vé của tôi</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 active:scale-90 transition-transform duration-150" href="#">
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-['Be_Vietnam_Pro'] text-[11px] font-medium mt-1">Thông báo</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 active:scale-90 transition-transform duration-150" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Be_Vietnam_Pro'] text-[11px] font-medium mt-1">Cá nhân</span>
        </a>
      </nav>
    </div>
  );
}


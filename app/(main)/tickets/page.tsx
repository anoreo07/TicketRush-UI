'use client';

import { useState, useEffect } from 'react';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';
import { bookingApi } from '@/lib/api/booking';

interface Ticket {
  id: string;
  eventImage: string;
  eventTitle: string;
  eventDate: string;
  eventDateTime?: Date;
  eventLocation: string;
  zone?: string;
  row?: string;
  seat?: string;
  qrCode: string;
  ticketCode: string;
  status: 'valid' | 'used';
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    eventImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGDmWUy_cvsbpTumZsXMDWeN0t6UU2Ky5PlIo4GeFG38N8yRsARQn8O84Opegr6oxTbQivn_WlwkilwaxbJlJ_LC1OC42FA-qVI5yk77OvyL6BAXBvYxFd9nSOLhcrc4JBsyU1TDWIYIfFDNMEYfzQC8B1odsflQbZqi8Db1ekRPtHIsmyRC7Mwezf48Mop_KPxztnSrocLV8DNb7KVVGxMt63njHsf9kQ40eDF59I0a0UxyzQR-hkWvFqz2PVJfYr8JmD9c-2RK4',
    eventTitle: 'Skyline Music Festival 2024',
    eventDate: 'Thứ 7, 15 Tháng 6, 2024',
    eventDateTime: new Date('2025-06-15T19:00:00'),
    eventLocation: 'Sân vận động Mỹ Đình, Hà Nội',
    zone: 'Khu vực VIP - Ghế A-12',
    qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCshVPPKK7Brkfj5mS1uDRLEEkYTCvlSjzWOw9XU9PAZwuVGe8G9JDjdAW6o6msKJg9FGv0ha6Tht1fYZZk94X2GZefCLmrUUzKOVza-a3Cc_xkQXlMJQT2bLDEyOO0EgvNSRZf7FIFmX0A33u1aZTJWuO40SVNGIudA3k0euS5ga59F6L0xLFo2elP_dnAi2UIXHiC9kuyek3r_3SoJpEzdnYsryVRZL3U9tUrjHeeUtUCVV0NCzYPUHhSwX5d3X5Kmpq1gJKplh4',
    ticketCode: 'TR-88291',
    status: 'valid',
  },
  {
    id: '2',
    eventImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTuFcD_Cy7AXz7P1uqxjISoZkg42Iz566VJiAEIJ6pLjAOG-F_jCCP9WnVvjnLX0Iprw7p0urNpXwTfOeagomfhl8J2ET26nYA_hLJ5EKhcAKCpbOJ8izmWqoIAhsr7A3E3zn7EcIl1PgvP75zJ_JlrAaNWH4ZyLPxTuLZI_ytVX-kiie_QCfOzvxQGGsF-CdpCoNpOkg8tmj90n7ge6_9Kv8WT630yLZXYgSbEPOKqPfF0Ar8woAZ3sS1cc0lIPlMyPyT-_uzqQ',
    eventTitle: 'Triển lãm Nghệ thuật Đương đại',
    eventDate: 'Chủ nhật, 20 Tháng 5, 2024',
    eventDateTime: new Date('2024-05-20T10:00:00'),
    eventLocation: 'The Factory Contemporary Art Center',
    zone: 'Vé Phổ thông',
    qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA6KJiQwZX7PdlGorTJBNZ1zZ-7ME-y-DYKk_Cm0m1uFLoCU6I4R3PVIyM6_kar6cCZSim6WIVA_3Gu_tGe-CyFEQao0vtszZk9qhjil9r23MVd3IlanEK7JgfOlpd2OpWvdxLqn7MhhJDI-YfeSOD4wC7DqgSbCWA0Tpw37uiNVLpZOl0AbsGnm5UJsqfj2jeWxba1AEgGgqoaRc8tP_23H38lrkXkuRB6nZFLiPm0VpU1BHJ0yPI4400FPIuGtQYbm8KPrTEHJI',
    ticketCode: 'TR-22941',
    status: 'used',
  },
  {
    id: '3',
    eventImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIwtCZwBj_COPVCe9S-BuZhf3TGro7r8egPSpK6nduxu5HZm5l1YTZ42R_KxwlEDq0y6nZkn9t-8-3LEWAftWn-HYJpDtyiWBNcHoJjKUzanjUvbuUYEv2CGdZaSsNKM43Hcb0Vq4yQMzcHK971jWipzlRt3EcaDTuaJCsCUqMz2DFeZCLE-WEmIMrgKUCaekh6z_YRgs4Zsb4hNOMwwDp92-dbKIy7GrzdIbn4Syu970LBpSx889Ey5LZsbp7oJpZj08SVBcoe-s',
    eventTitle: 'Workshop: Digital Creative Masters',
    eventDate: 'Thứ 4, 12 Tháng 7, 2024',
    eventDateTime: new Date('2025-07-12T09:00:00'),
    eventLocation: 'Dreamplex Coworking Space',
    zone: 'Ghế hàng đầu - Row A',
    qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCshVPPKK7Brkfj5mS1uDRLEEkYTCvlSjzWOw9XU9PAZwuVGe8G9JDjdAW6o6msKJg9FGv0ha6Tht1fYZZk94X2GZefCLmrUUzKOVza-a3Cc_xkQXlMJQT2bLDEyOO0EgvNSRZf7FIFmX0A33u1aZTJWuO40SVNGIudA3k0euS5ga59F6L0xLFo2elP_dnAi2UIXHiC9kuyek3r_3SoJpEzdnYsryVRZL3U9tUrjHeeUtUCVV0NCzYPUHhSwX5d3X5Kmpq1gJKplh4',
    ticketCode: 'TR-99412',
    status: 'valid',
  },
];

type FilterTab = 'all' | 'upcoming' | 'used';

export default function TicketsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [displayTickets, setDisplayTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await bookingApi.getUserTickets();
        
        // Map backend response to Ticket interface
        const mappedTickets: Ticket[] = response.map((item: any) => ({
          id: item.id,
          eventImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80', // Default placeholder
          eventTitle: item.bookings?.events?.title || 'Sự kiện',
          eventDate: item.bookings?.events?.start_time 
            ? new Date(item.bookings.events.start_time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Chưa cập nhật',
          eventDateTime: item.bookings?.events?.start_time ? new Date(item.bookings.events.start_time) : undefined,
          eventLocation: item.bookings?.events?.location || 'Chưa rõ địa điểm',
          zone: `Hàng ${item.seats?.row_index + 1}, Ghế ${item.seats?.col_index + 1}`,
          qrCode: item.qr_code,
          ticketCode: `TR-${item.id.slice(0, 8).toUpperCase()}`,
          status: new Date(item.bookings?.events?.start_time) < new Date() ? 'used' : 'valid',
        }));

        let filtered = mappedTickets;
        const now = new Date();

        switch (filterTab) {
          case 'upcoming':
            filtered = mappedTickets.filter(
              (ticket) =>
                ticket.status !== 'used' &&
                ticket.eventDateTime &&
                ticket.eventDateTime > now
            );
            break;
          case 'used':
            filtered = mappedTickets.filter((ticket) => ticket.status === 'used');
            break;
          default:
            break;
        }

        setDisplayTickets(filtered);
      } catch (err) {
        console.error('❌ Failed to fetch tickets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [filterTab]);

  const handleDownload = (ticketCode: string) => {
    console.log('Downloading ticket:', ticketCode);
  };

  const handleViewDetails = (ticketId: string) => {
    console.log('Viewing ticket details:', ticketId);
  };

  return (
    <div className="bg-slate-100 text-slate-900 min-h-screen flex flex-col">
      {/* TopNavBar */}
      <TopNavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12 flex-1 w-full">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-indigo-600">
            Vé của tôi
          </h1>
          <p className="text-slate-600 text-sm">
            Quản lý các sự kiện sắp tới và lịch sử đặt vé của bạn.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả vé
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
              filterTab === 'upcoming'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Sắp diễn ra
          </button>
          <button
            onClick={() => setFilterTab('used')}
            className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
              filterTab === 'used'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Đã sử dụng
          </button>
        </div>

        {/* Tickets Grid */}
        {displayTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onDownload={handleDownload}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center bg-white rounded-3xl mt-12 border-2 border-dashed border-slate-300">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300">
                confirmation_number
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Bạn chưa có vé nào</h2>
            <p className="text-slate-600 max-w-sm mb-8">
              Có vẻ như hành trình âm nhạc và nghệ thuật của bạn đang chờ để
              bắt đầu. Khám phá các sự kiện hot nhất ngay!
            </p>
            <a
              href="/"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Khám phá sự kiện ngay!
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

interface TicketCardProps {
  ticket: Ticket;
  onDownload: (code: string) => void;
  onViewDetails: (id: string) => void;
}

function TicketCard({ ticket, onDownload, onViewDetails }: TicketCardProps) {
  const isUsed = ticket.status === 'used';

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row relative transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200 ${
        isUsed ? 'opacity-60' : ''
      }`}
    >
      {/* Event Image Column - Fixed width */}
      <div className="w-full md:w-32 h-40 md:h-auto overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          alt={ticket.eventTitle}
          src={ticket.eventImage}
        />
      </div>

      {/* Content Column - Flexible */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status Badge and Ticket Code */}
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                isUsed
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              {isUsed ? 'USED' : 'VALID'}
            </span>
            <span className="text-slate-400 font-medium text-xs">
              #{ticket.ticketCode}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold mb-2 leading-tight text-slate-900">
            {ticket.eventTitle}
          </h3>

          {/* Event Details */}
          <div className="space-y-1.5 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                calendar_today
              </span>
              <span className="text-xs">{ticket.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                location_on
              </span>
              <span className="text-xs">{ticket.eventLocation}</span>
            </div>
            {ticket.zone && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  event_seat
                </span>
                <span className="font-semibold text-indigo-600 text-xs">
                  {ticket.zone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            {/* View Details / Used Button */}
            <button
              onClick={() => !isUsed && onViewDetails(ticket.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isUsed
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={isUsed}
            >
              {isUsed ? 'Đã sử dụng' : 'Xem chi tiết'}
            </button>

            {/* PDF Download Button */}
            <button
              onClick={() => onDownload(ticket.ticketCode)}
              className={`text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-slate-100 transition-colors ${
                isUsed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUsed}
            >
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              PDF
            </button>
          </div>

          {/* QR Code Icon */}
          <div className={`w-10 h-10 bg-slate-50 border border-slate-300 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform rounded ${
            isUsed ? 'opacity-40' : ''
          }`}>
            <span className="material-symbols-outlined text-slate-400 text-sm">
              qr_code_2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';
import { authApi, bookingApi, UserResponse, TicketResponse } from '@/lib/api';
import { getAuthToken } from '@/lib/api/client';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if token exists
        const token = getAuthToken();
        if (!token) {
          setError('Vui lòng đăng nhập lại');
          router.push('/login');
          return;
        }

        // Load user info
        const userData = await authApi.getCurrentUser();
        setUser(userData);

        // Load tickets
        try {
          const ticketsData = await bookingApi.getMyTickets();
          setTickets(ticketsData || []);
        } catch (ticketErr) {
          console.warn('Failed to load tickets:', ticketErr);
          // Don't fail if tickets fail to load
          setTickets([]);
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        const errorMsg = err?.message || 'Không thể tải thông tin hồ sơ';
        setError(errorMsg);

        // Redirect to login if token expired
        if (err?.statusCode === 401 || errorMsg.includes('Token')) {
          setTimeout(() => router.push('/login'), 1000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const ticketCount = tickets.length;
  const upcomingTickets = tickets.filter((t: any) => {
    return t.bookings?.events?.start_time && new Date(t.bookings.events.start_time) > new Date();
  }).length;

  if (isLoading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        <TopNavBar />
        <main className="flex-grow pt-20 pb-16 px-6 max-w-7xl mx-auto w-full">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-300 h-48 rounded-2xl"></div>
            <div className="bg-gray-300 h-64 rounded-2xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        <TopNavBar />
        <main className="flex-grow pt-20 pb-16 px-6">
          <p className="text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        <TopNavBar />
        <main className="flex-grow pt-20 pb-16 px-6">
          <p>Không tìm thấy thông tin người dùng</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fb] text-slate-900 min-h-screen flex flex-col font-body">
      <TopNavBar />

      <main className="flex-grow pt-24 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Profile Header Card */}
        <section className="mb-8 bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_50px_rgba(48,30,201,0.03)] border border-slate-50 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

          <div className="relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden group">
              <img
                alt="Avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                src={user.avatar_url || "/avatar.png"}
              />
              <button className="absolute bottom-2 right-2 bg-white w-9 h-9 rounded-full shadow-lg text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all border-2 border-white">
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>
          </div>

          <div className="flex-grow text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 className="text-3xl font-black font-headline tracking-tight text-slate-800">
                {user.full_name}
              </h1>
              <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-600 uppercase tracking-widest">
                KHÁCH HÀNG THÂN THIẾT
              </span>
            </div>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              Thành viên từ tháng 1, 2024
            </p>
          </div>

          <div className="flex gap-4 z-10">
            <div className="bg-slate-50/80 backdrop-blur-sm px-8 py-5 rounded-3xl text-center min-w-[120px] border border-white">
              <span className="block text-2xl font-black text-indigo-600 font-headline">{ticketCount.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vé đã mua</span>
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm px-8 py-5 rounded-3xl text-center min-w-[120px] border border-white">
              <span className="block text-2xl font-black text-purple-600 font-headline">{upcomingTickets.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sắp tới</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <nav className="flex flex-col gap-2">
              <a
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">person</span>
                Thông tin cá nhân
              </a>
              {[
                { icon: 'history', label: 'Lịch sử mua vé' },
                { icon: 'settings', label: 'Cài đặt tài khoản' },
                { icon: 'shield', label: 'Bảo mật' }
              ].map((item) => (
                <a
                  key={item.label}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:text-primary hover:bg-white transition-all text-sm font-bold"
                  href="#"
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl shadow-lg shadow-indigo-200/50">
              <h3 className="font-black mb-2 text-sm font-headline">Ưu đãi đặc quyền</h3>
              <p className="text-xs opacity-80 mb-4 leading-relaxed font-medium">
                Bạn còn 3 vé nữa để lên hạng Thành viên Vàng.
              </p>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div className="bg-white h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-12">
            {/* Personal Info Section */}
            <section className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black font-headline tracking-tight text-slate-800">Thông tin cá nhân</h2>
                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-100">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: 'Họ và tên', value: user.full_name },
                  { label: 'Email', value: user.email },
                  { label: 'Số điện thoại', value: user.phone || '+84 901 234 567' },
                  { label: 'Giới tính', value: 'Nam' },
                  { label: 'Ngày sinh', value: '15/05/1995' },
                  { label: 'Quốc tịch', value: 'Việt Nam' }
                ].map((field) => (
                  <div key={field.label} className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {field.label}
                    </label>
                    <p className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3 group-hover:border-primary transition-colors">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Tickets Section */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black font-headline tracking-tight text-slate-800">Vé đã mua gần đây</h2>
                <a className="text-indigo-600 text-xs font-bold hover:underline tracking-tight" href="/tickets">
                  Xem tất cả lịch sử
                </a>
              </div>

              <div className="space-y-6">
                {tickets.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-8 text-center text-slate-400 border border-slate-50 shadow-sm">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">confirmation_number</span>
                    <p className="text-sm">Bạn chưa mua vé nào.</p>
                  </div>
                ) : (
                  tickets.map((ticket: any) => {
                    const event = ticket.bookings?.events;
                    const seat = ticket.seats;
                    
                    return (
                      <div key={ticket.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500">
                        <div className="md:w-72 h-56 md:h-auto overflow-hidden relative">
                          <img
                            alt="Event"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={event?.image_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80"}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 rounded-full text-[9px] font-black bg-indigo-100 text-indigo-600 uppercase tracking-widest">
                              ĐÃ THANH TOÁN
                            </span>
                            <span className="text-slate-400 text-xs font-bold tracking-tighter">
                              #{ticket.booking_id ? ticket.booking_id.substring(0,8).toUpperCase() : 'TR-UNKNOWN'}
                            </span>
                          </div>

                          <h3 className="text-xl font-black font-headline text-slate-800 mb-4 group-hover:text-primary transition-colors">
                            {event?.title || "Sự kiện chưa xác định"}
                          </h3>

                          <div className="space-y-2 text-sm text-slate-500 font-medium">
                            <p className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base text-slate-300">location_on</span>
                              {event?.location || "Chưa xác định"}
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base text-slate-300">schedule</span>
                              {event?.start_time ? new Date(event.start_time).toLocaleDateString('vi-VN', {
                                hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric'
                              }) : "Chưa xác định"}
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-2">
                              {seat && (
                                <div className="px-3 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                                  Hàng {seat.row_index + 1} - Ghế {seat.col_index + 1}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-3">
                              <button className="px-6 py-2.5 rounded-full bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                                Chi tiết
                              </button>
                              <button className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
                                Tải vé (PDF)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Interaction & Points */}
            <section className="pb-10">
              <h2 className="text-2xl font-black font-headline tracking-tight text-slate-800 mb-8">Tổng quan hoạt động</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-indigo-600 text-white p-10 rounded-[40px] shadow-lg shadow-indigo-100 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-lg font-black font-headline mb-8">Mức độ tương tác</h3>
                    <div className="flex items-end gap-3 h-32">
                      {[40, 60, 90, 30, 50, 80, 100].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-grow rounded-t-xl transition-all duration-500 group-hover:scale-y-110 origin-bottom ${i === 6 ? 'bg-white' : i === 5 ? 'bg-white/70' : 'bg-white/30'
                            }`}
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>
                    <p className="mt-8 text-sm font-medium opacity-90 leading-relaxed">
                      Bạn tham gia nhiều sự kiện âm nhạc hơn <span className="font-black text-white underline underline-offset-4 decoration-white/30">85% người dùng khác</span> trong tháng này.
                    </p>
                  </div>
                  <div className="absolute -bottom-20 -right-20 text-[240px] font-black text-white/5 select-none rotate-12">
                    <span className="material-symbols-outlined !text-[240px]">trending_up</span>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50 flex flex-col justify-center items-center text-center group hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">loyalty</span>
                  </div>
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Điểm TicketRush</h3>
                  <p className="text-5xl font-black text-indigo-600 my-4 font-headline tracking-tight">2,450</p>
                  <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    Quy đổi ngay
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

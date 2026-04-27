'use client';

import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';

export default function ProfilePage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow pt-20 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Profile Header: Asymmetric Layout */}
        <section className="mb-16 flex flex-col md:flex-row items-center md:items-end gap-10 bg-surface-container-lowest p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQCOrqo1DHxIB7nvYPslFFakIxJiVt6Hf5A-dU3Hv6qAO20y4WkDYgxL_Awro8I4yqCf_D_aywOMJrO-pya6R4goi8Rq4wnVKtf2UtaTDWgcaJf1qJ1CFb-6Pv38qeVyck86pgEM-lsszDjnRxsToCh9Acq0jlR2mu1ynKjBw3QPmWKQ_anfx66om6ZH0ppZocxry7E4H_XwAqBOPFyGehDLmbRrYlaxljwdHjfWw16eYMnZ8hDlVCG64JCy6kyMyjFIxqS2tYYI"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-full shadow-lg text-primary hover:bg-primary-fixed transition-colors border-2 border-white">
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
          </div>
          <div className="flex-grow text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
                Nguyễn Minh Tuấn
              </h1>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                Khách hàng thân thiết
              </span>
            </div>
            <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2 text-sm">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              Thành viên từ tháng 1, 2024
            </p>
          </div>
          <div className="hidden lg:flex gap-6 ml-auto">
            <div className="bg-surface-container-low p-5 rounded-2xl text-center min-w-[130px]">
              <span className="block text-3xl font-black text-primary">12</span>
              <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Vé đã mua</span>
            </div>
            <div className="bg-surface-container-low p-5 rounded-2xl text-center min-w-[130px]">
              <span className="block text-3xl font-black text-tertiary">02</span>
              <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Sắp tới</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-3">
            <nav className="flex flex-col gap-2">
              <a
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary text-on-primary font-semibold text-sm transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-xl">person</span>
                Thông tin cá nhân
              </a>
              <a
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-on-surface-variant hover:bg-surface-container-high transition-all text-sm"
                href="#"
              >
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
                Lịch sử mua vé
              </a>
              <a
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-on-surface-variant hover:bg-surface-container-high transition-all text-sm"
                href="#"
              >
                <span className="material-symbols-outlined text-xl">settings</span>
                Cài đặt tài khoản
              </a>
              <a
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-on-surface-variant hover:bg-surface-container-high transition-all text-sm"
                href="#"
              >
                <span className="material-symbols-outlined text-xl">shield</span>
                Bảo mật
              </a>
            </nav>
            <div className="mt-10 p-6 bg-gradient-to-br from-tertiary to-purple-700 text-white rounded-2xl">
              <h3 className="font-black mb-2 text-sm">Ưu đãi đặc quyền</h3>
              <p className="text-xs opacity-90 mb-4 leading-relaxed">
                Bạn còn 3 vé nữa để lên hạng Thành viên Vàng.
              </p>
              <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[75%] rounded-full"></div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-16">
            {/* Personal Info Section */}
            <section>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tight">Thông tin cá nhân</h2>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline text-sm font-bold hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-base">edit</span>
                  Chỉnh sửa
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 bg-surface-container-lowest p-10 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Họ và tên
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    Nguyễn Minh Tuấn
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Email
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    tuan.nguyen@email.com
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Số điện thoại
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    +84 901 234 567
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Giới tính
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    Nam
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Ngày sinh
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    15/05/1995
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                    Quốc tịch
                  </label>
                  <p className="text-base font-bold border-b border-surface-container-high pb-2.5">
                    Việt Nam
                  </p>
                </div>
              </div>
            </section>

            {/* Recent Activity / Tickets Section */}
            <section>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tight">Vé đã mua gần đây</h2>
                <a className="text-primary text-sm font-bold hover:underline" href="#">
                  Xem tất cả lịch sử
                </a>
              </div>
              {/* Event Card with Asymmetry and Layered Depth */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden rounded-2xl md:rounded-none">
                  <img
                    alt="Event Image"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3WikHb0--dsPp-07xu62WYOw_iA6swK__fxejKsdr0i_oqo6Y9GuxCRSlTpz15fGhLM_UObqw6I8Ht17ir798tfBmRWjSNt-sdqbrnSoE5fHORR4SVqLfkIQLViyiEEUmwDvWpb8pOluxPTBcbOuAYtmo4v8C7464ITh3Snq8rMrKNJK31q3wBlRga_tQVHrroVSoChj2wcvIm5jqCa5jdlvOPk5PEVjlGyVVMNH7ZHUCsDPXuBnHuoaZUpIQGU3XkzQNJtUP2lc"
                  />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                        Đã thanh toán
                      </span>
                      <span className="text-on-surface-variant text-xs font-bold">#TR-882910</span>
                    </div>
                    <h3 className="text-lg font-black text-on-surface mb-3">
                      Sky Tour: Mùa hè rực rỡ 2024
                    </h3>
                    <div className="flex flex-col gap-1.5 text-sm text-on-surface-variant">
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        Sân vận động Mỹ Đình, Hà Nội
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">event</span>
                        20:00 • 15 tháng 07, 2024
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between pt-7 border-t border-surface-container-high">
                    <div className="flex -space-x-2">
                      <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[9px] font-bold text-white">
                        SV
                      </div>
                      <div className="w-9 h-9 rounded-full border-2 border-white bg-indigo-300 flex items-center justify-center text-[9px] font-bold text-indigo-700">
                        VIP
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-2.5 rounded-full border border-outline-variant text-sm font-bold hover:bg-surface-container transition-colors">
                        Chi tiết
                      </button>
                      <button className="bg-tertiary text-on-tertiary px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90">
                        Tải vé (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Activity Bento Grid */}
            <section>
              <h2 className="text-2xl font-black tracking-tight mb-10">Tổng quan hoạt động</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-gradient-to-br from-primary-container to-purple-600 text-white p-10 rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-black mb-6">Mức độ tương tác</h3>
                    <div className="flex items-end gap-2 h-40">
                      <div className="flex-grow bg-white/30 h-[40%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white/30 h-[60%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white/50 h-[90%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white/30 h-[30%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white/30 h-[50%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white/70 h-[80%] rounded-t-lg"></div>
                      <div className="flex-grow bg-white h-[100%] rounded-t-lg"></div>
                    </div>
                    <p className="mt-6 text-sm opacity-95 leading-relaxed">
                      Bạn tham gia nhiều sự kiện âm nhạc hơn 85% người dùng khác trong tháng này.
                    </p>
                  </div>
                  <span className="absolute -bottom-12 -right-12 material-symbols-outlined text-[200px] opacity-10">
                    trending_up
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-10 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-tertiary text-6xl mb-4">
                    loyalty
                  </span>
                  <h3 className="font-bold text-on-surface text-sm">Điểm TicketRush</h3>
                  <p className="text-4xl font-black text-primary my-3">2,450</p>
                  <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest">Quy đổi ngay</p>
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

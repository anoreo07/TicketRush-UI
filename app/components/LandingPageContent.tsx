'use client';

export default function LandingPageContent() {
  const features = [
    {
      icon: 'event_seat',
      title: 'Sơ đồ ghế Real-time',
      description:
        'Chọn vị trí yêu thích với độ chính xác tuyệt đối thông qua hệ thống trực quan hóa 3D và trạng thái chỗ ngồi cập nhật liên tục.',
    },
    {
      icon: 'speed',
      title: 'Thanh toán siêu tốc',
      description:
        'Trải nghiệm quy trình thanh toán mượt mà chỉ trong vài giây. Hỗ trợ đa dạng phương thức MoMo, ZaloPay, Thẻ tín dụng quốc tế.',
    },
    {
      icon: 'verified_user',
      title: 'Bảo mật & Tin cậy',
      description:
        'Hệ thống vé điện tử định danh với mã QR bảo mật động, đảm bảo tính duy nhất và chống làm giả tuyệt đối.',
    },
  ];

  const events = [
    {
      id: 1,
      category: 'CONCERT',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuACCzDz_5vH7JxGmSarUQEgwJUsV4gfT5M1C62VchuPF0QeniW-yOOKGCFpsn0GMqOQN24dn05wNEI8BHGgYtHcM7_bA6oSZecRoUVZa2keBQpyOcdjUY9Y06ADB5Ymt0w6ObfGecWEUbSEfGA8MWIrKkZhWUpeAx-9mViMwOgIb0O5KG7jgL4QbIpuLvMJhNuWFH_kQxftKrWWxdCr6-dDLXGY95Waur4N5Dx0Tgw2Lx2cvy0oluWdj41Sj5gNk68tx88oo5uJPB8',
      date: '20 Tháng 12, 2024 • Sân vận động Mỹ Đình',
      title: 'Âm Nhạc Vô Cực - Winter Night Tour',
      price: '1.200.000đ',
    },
    {
      id: 2,
      category: 'WORKSHOP',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ1JPR7jChlnoS6KaH9vqzVvYsQ3vuPej3Eqw9wPKeJTnbZAGHfo7GnmDn89d3dbFO30YcvFTUS6G2hRMLRE2a4N7wuONtC04vBoYN6l_vwRzexC3vBhGLATgwcBtv7KzWkdLmtKNz2o31H5eqqDOg9zshIbE2k-E7k589S1Qgd27-H46j_H6NnD3f2v8VgDKUAeaq3T4WF-WbUEITsS4_V61CiQh_r1iUAU4DGsoRr9YZLKkvN0MJZzz37F8K5au0nuty8Lw_mU0',
      date: '15 Tháng 01, 2025 • Landmark 81',
      title: 'Sáng Tạo Nội Dung Trong Kỷ Nguyên AI',
      price: '500.000đ',
    },
    {
      id: 3,
      category: 'THỂ THAO',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuALpcqc0Nus--HrJ65Zx0Qwv3ODsJArpyhG513_2kdZ8889Zr2aCwgUQ-ODLKtG6I4_ZbZjA5pYzMio-p0xxFA000QCHpnxPO_LN3XTPwLNNCVsXCoBGtBBOjNwGLIQNahZ7iCaejRhvmw49YUZ0u3hP2geu0rHJi4m3inhte251IYLG6Ab39bg36q8_EO-4627wmQ7NArM3knpP53LUJJxuNNPUJTHz6obvxPtHXoWm5CCPE29sb385uzjJTKJBKW3YCMSFHzJ0p4',
      date: '05 Tháng 02, 2025 • Nhà thi đấu Quân khu 7',
      title: 'Vietnam Basketball Championship 2025',
      price: '350.000đ',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-6 py-5 md:py-10 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="font-black text-3xl md:text-4xl lg:text-5xl leading-tight text-indigo-700 mb-6">
                Kiến tạo khoảnh khắc<br />
                Kết nối đam mê
              </h1>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Nền tảng quản lý vé và đặt sự kiện chuyên nghiệp, mang đến những trải nghiệm đẳng cấp nhất đến ngay tầm tay bạn.
              </p>
              <button className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
                <span>Khám phá sự kiện ngay</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Right Image & Badge */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  className="w-full h-full object-contain"
                  alt="logo"
                  src="/logo.png"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 right-6 bg-white rounded-lg p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-lg text-indigo-700">
                    <span className="material-symbols-outlined text-2xl">
                      confirmation_number
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">50,000+</p>
                    <p className="text-xs text-gray-600">Vé đã được bán</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-indigo-700 text-2xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Highlights Section */}
      <section className="w-full px-6 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-indigo-700 font-bold text-xs uppercase tracking-widest mb-3">
              Sự kiện nổi bật
            </p>
            <div className="flex justify-between items-center gap-4">
              <h2 className="font-black text-3xl md:text-4xl text-gray-900">
                Khám phá trải nghiệm mới
              </h2>
              <a
                href="#"
                className="text-indigo-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all whitespace-nowrap"
              >
                Xem tất cả
                <span className="material-symbols-outlined text-lg">
                  trending_flat
                </span>
              </a>
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt={event.title}
                    src={event.image}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg">
                    <p className="text-xs font-bold text-indigo-700">
                      {event.category}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs font-medium text-gray-600 mb-3">
                    {event.date}
                  </p>
                  <h4 className="font-bold text-base text-gray-900 mb-5 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-700">
                      {event.price}
                    </span>
                    <button className="text-xs font-bold text-gray-900 hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                      Chi tiết
                      <span className="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="font-black text-3xl md:text-4xl text-white mb-6">
                Sẵn sàng cho trải nghiệm mới?
              </h2>
              <p className="text-white/90 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
                Đăng ký ngay hôm nay để nhận thông báo sớm nhất về các sự kiện hot và ưu đãi đặc quyền từ TicketRush.
              </p>
              <button className="bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

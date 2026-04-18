'use client';

import React from 'react';

export const SignupLeftColumn = () => {
  return (
    <section className="hidden lg:flex editorial-gradient relative w-1/2 p-16 flex-col justify-between overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-tertiary opacity-20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-primary-container opacity-30 blur-[80px] rounded-full"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <span className="text-3xl font-black text-white tracking-tighter font-headline">TicketRush</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 tracking-tight">
            Kiến tạo khoảnh khắc, <br />
            Kết nối đam mê.
          </h1>
          <p className="text-white text-primary-fixed text-lg md:text-xl font-light leading-relaxed mb-10 opacity-90">
            Nền tảng quản lý và đặt vé sự kiện chuyên nghiệp, mang những trải nghiệm đẳng cấp nhất đến ngay tầm tay bạn.
          </p>
        </div>
      </div>

      {/* Asymmetric Event Illustration Card */}
      <div className="relative z-10 mt-auto pt-12">
        <div className="relative group">
          {/* Glow effect background */}
          <div className="absolute -inset-4 bg-gradient-to-r from-tertiary via-purple-400 to-primary-fixed-dim rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
          
          <div className="relative bg-gradient-to-br from-purple-600/40 to-indigo-600/40 glass-panel p-6 rounded-2xl shadow-2xl transform group-hover:rotate-0 transition-transform duration-500 border border-purple-400/30">
            <img
              alt="Concert crowd"
              className="w-full h-72 object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIF1QAjGuvTiV2zh7EokT_4sk8sOkQVPXyKMREf64j5lNaeAbIcMrGb_LXHSts4Fg3BxIFmLKzIib__g4ZyYyUMfM6Hq2c8DVbHMVT1-hYWBLjvI8MU_pHF3RvYxKoJk8hVBR-mlIXe4wNbs-BkVtvQbfd2zh_0PLYIFMz0ub5KiphN3nCRjfcMuMIWHVVCMjpnslYBKhMKclT0U8Tm1VHzj0pBvNfGgOk-wJn4j6HojbBonwjIBvw_x-CQ1SnRagqwCk9eWg_XH4"
            />
            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">Coming Next</p>
                <h3 className="text-white font-headline font-bold text-xl">Skyline Symphony 2024</h3>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-3 border-white bg-slate-200 overflow-hidden shadow-lg">
                  <img
                    alt="User"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzIjqXB7FWrXu8ay4NwU7d5sZOg3ZZVyuu1oWV2UVJMaEzTe9v_djwdRlfMBB-ikdV_bf5Qhv9cTfzwCVxYqh0YhEyj4jSx2iWN79H70_LFNwRlVx_-wwPKtrw5eEB3CNt6I1YPytMT0_fIRH1lS_cG-EXUddKamgiLaXou9lrqV3AntCBWvTDuUAQnDzPfMjEkIsI1JJSttpPIwqSEF3H54tAnSOIgOjiWf-3vo6bQRPzITD6mhroex0uqCKSfwQIdQGQ8e0ume0"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-3 border-white bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  +2k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

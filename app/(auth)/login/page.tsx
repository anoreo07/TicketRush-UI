"use client";

import { LoginForm } from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Hidden on Mobile */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-[#301ec9] items-center justify-center p-8">
        <div className="absolute inset-0 z-0 opacity-60">
          <img
            alt="Live concert event"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYNDrGZ8DgYs-7q3YkzNQFUU-sWH1LRnecNSPcgAHZNfk1zMaiW5yT2EIMcvpiTAKFbkPf4JpKQMBdWzmM59SpLjPHeEN_oy0C2vk43roflymbi3pc8byMZBKGYnuGp9iLp7atlWb4tTZ4l-Ck7wdmcPGFh_PNC8w2A67uInynE72wr6ZNvVcnt-BbuED9aCwt3886iRoRczztN4qjK-jFZsUe4xz9eWWPQODCVlFy8ZWftwqFcKk4P_lz-z20BW1xpmmoaXAnf1s"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#301ec9]/90 via-[#301ec9]/20 to-transparent"></div>
        <div className="relative z-20 max-w-xl space-y-5 -mt-40">
          <div className="mb-4">
            <span className="text-[#c3c0ff] bg-[#4a40e0] px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
              Premium Experience
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-3 tracking-tighter">
            Trải nghiệm sự kiện đẳng cấp
          </h1>
          <p className="text-[#c3c0ff] text-base leading-snug font-light">
            Kết nối bạn với những khoảnh khắc nghệ thuật tuyệt vời nhất.
            TicketRush mang đến giải pháp đặt vé thông minh và bảo mật hàng
            đầu.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="flex -space-x-3">
              <img
                className="w-8 h-8 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlnQuSxfha-fDV5GzcQia0Ng2b8XhndgaC_J0uKxaW3KBwjmA3Nz04E3_gEV9nQ89Z88vetfdzyY_g3ziSkWmX75heAUMW9tV3azcZX54_mSJNkM0I_1RdtS2ufYJVN-z3niLis32M2K286a8EsJTzhVCoIasGzrgTsIh_ISC-YJETB26mXYq2WgIOb7uHkvmmfbnvf_MyhthmFZ_AcwUOd4ekVDf6lRhMlFQqWpo2yM27HMphA_XrnjZSkgimS7LaRlTQlyR66oA"
                alt="User 1"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGYUt8eBf-1Wtf7kCd9-xfby28spIED5lGbUkWKnnpmOVSW4NNaxlaDyQxUjQ543fkRtJWWSKUsH7r-Rq7DTKpTH0RuPEsN0mju5oIobJaqpsyIWrUFgsHjTzu4oimmgF7r32Xisdp5h5yto1f5xMVexG44slwoTP4DKsuOdxMvsPndKC3EWUeXSjuop5R-q7DzOjNSW3itTZA8PNOVVGukFcNOlrYBfu4uthkWLnhFEIa8pBFhqSl9z556CeQXXJ-kvt-uFCjTsE"
                alt="User 2"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuJ0V1GtAGL0LdpcymcxXrAOcl56AI4cBdpu1q13fI1syP7sCRGYrfW7yLaLSTHw6sAbP6YKkRq3QKRsDqmMuhUIJOszwt3zbwM2J79ApD9aTGmppDE7ITJWGGqiVpXROmQcs5pk5fkD4Y1xXCWiuOYDyh1fMHUW1H35gh4gI-E5m54I3cvZ05KSPipqJYdY79rzpMt-Toh997qDJ6JMLdoJ3P_NWRzkDLYSviZbAtzH_upA9WgIErZ8_3tuxsZQzteRnr2Z1odzg"
                alt="User 3"
              />
            </div>
            <div className="text-white">
              <p className="text-xs font-semibold">+10,000 người dùng</p>
              <p className="text-[11px] text-[#c3c0ff]">
                đã tham gia TicketRush tuần này
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-8 z-20 flex items-center gap-2">
          <span className="text-white/40 text-xs font-medium tracking-tight">
            © 2024 TicketRush Inc.
          </span>
        </div>
      </section>

      {/* Right Section - Login Form */}
      <section className="flex-1 bg-[#f7f9fb] flex flex-col justify-center items-center p-4 md:p-8 relative">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#301ec9] to-[#5700bf] rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m6-1h1v2h-1v-2m-11 13h10v-1H7v1z" />
                </svg>
              </div>
              <span className="text-xl font-black text-[#301ec9] tracking-tighter">
                TicketRush
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#191c1e] mb-2 tracking-tight">
              Chào mừng trở lại
            </h2>
            <p className="text-sm text-[#484554] font-medium">
              Nhập thông tin của bạn để truy cập tài khoản
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Login Button */}
            <button className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg border border-[#c9c4d7] bg-white text-[#191c1e] font-semibold text-sm hover:bg-[#eceef0] transition-all active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Đăng nhập bằng Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-[#c9c4d7]"></div>
              <span className="text-[10px] font-bold text-[#797586] uppercase tracking-widest">
                Hoặc dùng Email
              </span>
              <div className="flex-1 h-[1px] bg-[#c9c4d7]"></div>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Sign Up Link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-[#484554] font-medium">
                Chưa có tài khoản?
                <a
                  className="text-[#301ec9] font-bold hover:underline ml-1"
                  href="#"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>

          {/* Security Info - Hidden on Mobile */}
          <div className="mt-6 hidden md:block">
            <div className="bg-[#e2dfff]/30 p-3 rounded-lg flex items-start gap-3 border border-[#e2dfff]/50">
              <svg
                className="w-4 h-4 text-[#301ec9] flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-[#3323cc]">Kết nối an toàn</p>
                <p className="text-[10px] text-[#3323cc]/80 leading-tight">
                  Dữ liệu của bạn được mã hóa theo tiêu chuẩn ngân hàng
                  AES-256.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Only */}
      <footer className="md:hidden bg-white py-5 px-4 text-center border-t border-[#c9c4d7]/10">
        <div className="inline-flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 bg-gradient-to-br from-[#301ec9] to-[#5700bf] rounded flex items-center justify-center text-white">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m6-1h1v2h-1v-2m-11 13h10v-1H7v1z" />
            </svg>
          </div>
          <span className="text-base font-black text-[#301ec9] tracking-tighter">
            TicketRush
          </span>
        </div>
        <p className="text-[11px] text-[#484554] mb-2">
          © 2024 TicketRush. Trải nghiệm đẳng cấp.
        </p>
        <div className="flex justify-center gap-3">
          <a className="text-[10px] font-bold text-[#797586] hover:text-[#301ec9]" href="#">
            Điều khoản
          </a>
          <a className="text-[10px] font-bold text-[#797586] hover:text-[#301ec9]" href="#">
            Bảo mật
          </a>
        </div>
      </footer>
    </main>
  );
}

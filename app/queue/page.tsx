"use client";

import { HelpCircle, Lock, Shield } from "lucide-react";

export default function QueuePage() {
  // Calculate SVG circle dashoffset for progress visualization
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - 245 / 2000); // Assuming 245 out of ~2000 people

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden" style={{ fontFamily: "Manrope" }}>
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#301ec9]/5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#5700bf]/5 blur-[120px]"></div>

      <div className="w-full max-w-2xl text-center z-10">
        {/* Brand Anchor */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-[#301ec9] tracking-tighter" style={{ fontFamily: "Manrope" }}>
            TicketRush
          </h1>
        </div>

        {/* Central Content Canvas */}
        <div className="bg-white/80 backdrop-blur-[20px] rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.06)] p-12 md:p-20 relative">
          {/* Progress Visualization */}
          <div className="relative inline-flex items-center justify-center mb-10">
            {/* SVG Circle Progress */}
            <svg className="w-48 h-48 md:w-64 md:h-64" viewBox="0 0 200 200">
              {/* Outer static ring */}
              <circle
                className="text-[#e6e8ea]"
                cx="100"
                cy="100"
                fill="transparent"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              {/* Animated dynamic ring */}
              <circle
                className="text-[#301ec9] transition-all duration-500"
                cx="100"
                cy="100"
                fill="transparent"
                r="90"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="8"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              ></circle>
            </svg>

            {/* Internal Text */}
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-medium text-slate-500 mb-1" style={{ fontFamily: "Be Vietnam Pro" }}>
                Vị trí của bạn
              </span>
              <span className="text-5xl md:text-6xl font-extrabold text-[#301ec9] tracking-tight" style={{ fontFamily: "Manrope" }}>
                #245
              </span>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                Bạn đang trong hàng chờ...
              </h2>
              <p className="text-slate-600 font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
                Hệ thống đang xử lý lượng lớn yêu cầu. Vui lòng không tải lại trang.
              </p>
            </div>

            {/* Wait Time Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-[#f2f4f6] p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#301ec9]/10 flex items-center justify-center text-[#301ec9]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 5V1h-1v4H8.01V1H7v4H3.99V1H3c-1.11 0-1.99.9-1.99 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4V1h-1v4zm8 8h-5v5h5v-5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Thời gian chờ dự kiến
                  </p>
                  <p className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                    2 phút
                  </p>
                </div>
              </div>

              <div className="bg-[#f2f4f6] p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#5700bf]/10 flex items-center justify-center text-[#5700bf]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 0c1.66 0 2.99-1.34 2.99-3S25.66 5 24 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Đang xếp hàng
                  </p>
                  <p className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                    1,402 người
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security / Trust Indicator */}
          <div className="mt-12 pt-8 border-t border-[#c9c4d7]/15 flex flex-col md:flex-row items-center justify-center gap-4 text-slate-400">
            <div className="flex items-center gap-2 text-xs font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
              <Lock className="w-4 h-4" />
              <span>KẾT NỐI BẢO MẬT SSL</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2 text-xs font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
              <Shield className="w-4 h-4" />
              <span>CHỐNG ĐẶT VÉ GIẢ MẠO</span>
            </div>
          </div>
        </div>

        {/* Contextual Footer */}
        <div className="mt-12 space-y-6">
          <p className="text-sm text-slate-500 max-w-md mx-auto" style={{ fontFamily: "Be Vietnam Pro" }}>
            Việc giữ trang web luôn mở sẽ giúp bạn giữ đúng vị trí trong hàng chờ. Bạn sẽ tự động được chuyển hướng đến trang chọn ghế khi đến lượt.
          </p>
          <div className="flex justify-center gap-8">
            <img
              alt="Visa"
              className="h-8 grayscale opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACyJ2cyxB4Q0H6zYQrAUzzSHnWz-XHlc7aGeiniV1Vy7HwMX0gPgea13e50Nq4wBhZcnYUAgHVEXIZzi6vmXBfVsSk6K1eOS4br7wBPk7KrI7DL6daRCroecf74NtUnHJI6d6-dcDYtaia0ofPDIChkF4Z7byoLV2zI243xJBU78k9yJjkqvq5_OuKiCTN-H-K1EuKySGxOr0xn4lYNNiopghcfQ4OCDPJnJaR1D68sH01oMRS1ImoWQ-O32VvBX042J6xaVrS4OM"
            />
            <img
              alt="Mastercard"
              className="h-8 grayscale opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX09dRgl_ee6c19tAy9duBzoi45KyRfcQVTQt65Nna8uTF8Wq6-D6AFDcvSZmMlkgSaGbiCa2OMz9CIxoZFS5GeATAZ5iY_Ls8sC5HspXKYZlZUrgsPV36q6au8iQ9NvD2KbSjAjNntNdnL7mCN0tpGx170N3_JKb5Vzmbn6-TZ1OcfAGOpur9cj_HdeO3m4vEFoXdnOBWEPpvwwDUHJ-MFSdme3id769vbCinQ5RMX9RlP1HX1bYYgqL9SfgYuhhAOTnzVet7P_U"
            />
            <img
              alt="MoMo"
              className="h-8 grayscale opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADNIB6bdZVQ0NmVY1GmGXdvgJeLXOwjHy9x03SkU8FhXNC6Guq70CODBw6nF_R89NVViNZLkJOtZ7piWNxhQsB8FVq9BwIXjupPGs_2MNQeo8zK8DlgIh_YbghSC8JKk0f8-_o9mPWqBkAhVsEw5LDzfmkhAOi-430OWLHB2TRKX-2jDDpQHl7KiyMThEiA1yEtgA1ASQwnmtS0C4T1riyLo9LEOOS1oYT9njqxqOF9Qz0vCnoMylDP2bCXfmdYwmJBiqFcHTZTCQ"
            />
          </div>
        </div>
      </div>

      {/* Support Floating Button */}
      <button className="fixed bottom-8 right-8 z-50 bg-white shadow-lg w-14 h-14 rounded-full flex items-center justify-center text-[#301ec9] hover:scale-105 transition-transform duration-200">
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Minimal Global Footer */}
      <footer className="w-full bg-transparent mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-7xl mx-auto border-t border-slate-200/20">
          <div className="text-xs text-slate-500 font-medium mb-4 md:mb-0" style={{ fontFamily: "Be Vietnam Pro" }}>
            © 2024 TicketRush. Trải nghiệm đẳng cấp.
          </div>
          <div className="flex gap-6">
            <a
              className="text-xs text-slate-400 hover:text-[#301ec9] underline transition-colors"
              href="#"
              style={{ fontFamily: "Be Vietnam Pro" }}
            >
              Về chúng tôi
            </a>
            <a
              className="text-xs text-slate-400 hover:text-[#301ec9] underline transition-colors"
              href="#"
              style={{ fontFamily: "Be Vietnam Pro" }}
            >
              Điều khoản
            </a>
            <a
              className="text-xs text-slate-400 hover:text-[#301ec9] underline transition-colors"
              href="#"
              style={{ fontFamily: "Be Vietnam Pro" }}
            >
              Bảo mật
            </a>
            <a
              className="text-xs text-slate-400 hover:text-[#301ec9] underline transition-colors"
              href="#"
              style={{ fontFamily: "Be Vietnam Pro" }}
            >
              Liên hệ
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

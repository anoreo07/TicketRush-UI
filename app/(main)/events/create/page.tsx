"use client";

import { useState } from "react";
import { Lightbulb, Layers } from "lucide-react";
import TopNavBar from "@/app/components/TopNavBar";
import Footer from "@/app/components/Footer";
import { adminEventsApi } from "@/lib/api/events";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(10);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Generate seat grid for preview
  const generateSeats = () => {
    const seats = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isVIP = i === 0; // First row is VIP
        seats.push({ id: `seat-${i}-${j}`, isVIP });
      }
    }
    return seats;
  };

  const handleCreate = async () => {
    try {
      console.log("🚀 handleCreate called");
      console.log("📝 Form data:", { eventName, description, startTime, price, location });
      
      // Validate required fields
      if (!eventName.trim()) {
        setError("Vui lòng nhập tên sự kiện");
        return;
      }
      if (!description.trim()) {
        setError("Vui lòng nhập mô tả sự kiện");
        return;
      }
      if (!startTime) {
        setError("Vui lòng chọn thời gian bắt đầu");
        return;
      }
      if (!price || parseInt(price) <= 0) {
        setError("Vui lòng nhập giá vé hợp lệ");
        return;
      }
      if (!location.trim()) {
        setError("Vui lòng nhập địa điểm");
        return;
      }

      console.log("✅ All fields validated");
      console.log("🔑 Token:", token);

      if (!token) {
        setError("Vui lòng đăng nhập trước khi tạo sự kiện");
        return;
      }

      setLoading(true);
      setError(null);

      const payload = {
        title: eventName,
        description: description,
        start_time: new Date(startTime).toISOString(),
        location: location,
        matrix_config: {
          total_rows: rows,
          total_cols: cols,
        },
        seat_price: parseInt(price),
      };

      console.log("📤 Sending payload:", payload);
      const response = await adminEventsApi.create(payload);
      
      console.log("📥 Response:", response);
      
      if (response?.id) {
        setSuccess(true);
        console.log("✅ Event created successfully, redirecting...");
        // Redirect to events page after 1 second
        setTimeout(() => {
          router.push("/events");
        }, 1000);
      } else {
        setError("Không thể tạo sự kiện. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error("❌ Error creating event:", err);
      console.error("Error details:", {
        message: err?.message,
        code: err?.code,
        statusCode: err?.statusCode,
        details: err?.details,
      });
      setError(err?.message || "Có lỗi xảy ra khi tạo sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const seats = generateSeats();

  return (
    <div className="flex flex-col min-h-screen w-full" style={{ fontFamily: "Manrope" }}>
      <TopNavBar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#301ec9] mb-2" style={{ fontFamily: "Manrope" }}>
            Tạo sự kiện mới
          </h1>
          <p className="text-[#484554] font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
            Chia sẻ trải nghiệm tuyệt vời của bạn với cộng đồng TicketRush.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium" style={{ fontFamily: "Manrope" }}>Lỗi</p>
              <p className="text-red-700 text-sm" style={{ fontFamily: "Be Vietnam Pro" }}>{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              ✕
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div className="flex-1">
              <p className="text-green-800 font-medium" style={{ fontFamily: "Manrope" }}>Thành công</p>
              <p className="text-green-700 text-sm" style={{ fontFamily: "Be Vietnam Pro" }}>Sự kiện đã được tạo! Đang chuyển hướng...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Basic Information Section */}
            <section className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.04)]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                <svg className="w-5 h-5 text-[#301ec9]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                </svg>
                Thông tin cơ bản
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Tên sự kiện
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                    placeholder="Ví dụ: Đêm nhạc Trịnh Công Sơn - Lời Huyền Thoại"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    style={{ fontFamily: "Be Vietnam Pro" }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Mô tả sự kiện
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                    placeholder="Kể câu chuyện về sự kiện của bạn..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ fontFamily: "Be Vietnam Pro" }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Thời gian bắt đầu
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Giá vé cơ bản (VNĐ)
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                      placeholder="500,000"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ fontFamily: "Be Vietnam Pro" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Địa điểm
                  </label>
                  <div className="flex gap-2 relative">
                    <svg className="w-5 h-5 text-slate-400 absolute mt-3 ml-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                      placeholder="Nhà hát Lớn Hà Nội, số 1 Tràng Tiền..."
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ fontFamily: "Be Vietnam Pro" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Banner sự kiện
                  </label>
                  <div className="border-2 border-dashed border-[#c9c4d7] rounded-xl p-8 text-center hover:border-[#301ec9] transition-colors group cursor-pointer bg-[#f7f9fb]">
                    <svg className="w-12 h-12 text-[#797586] mx-auto mb-2 group-hover:text-[#301ec9] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <p className="text-sm text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Kéo thả hoặc{" "}
                      <span className="text-[#301ec9] font-bold">tải ảnh lên</span>
                    </p>
                    <p className="text-xs text-[#797586] mt-1" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Kích thước khuyên dùng: 1920x1080px (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Seat Configuration Section */}
            <section className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                  <Layers className="w-5 h-5 text-[#301ec9]" />
                  Cấu hình sơ đồ ghế
                </h2>
                <span className="text-xs bg-[#e2dfff] text-[#301ec9] px-3 py-1 rounded-full font-bold" style={{ fontFamily: "Be Vietnam Pro" }}>
                  Sơ đồ 2D
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Số hàng (Rows)
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 6)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Số cột (Columns)
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                    type="number"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
              <div className="bg-[#e6e8ea] rounded-xl p-8 overflow-hidden">
                <div className="w-full h-2 bg-slate-400 rounded-full mb-12 relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Sân khấu / Màn hình
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {seats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`w-6 h-6 rounded-md shadow-sm ${
                          seat.isVIP ? "bg-[#5700bf]" : "bg-[#301ec9]"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-center gap-6 text-[11px] font-bold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#5700bf]"></div> VIP
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#301ec9]"></div> Standard
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#e0e3e5]"></div> Trống
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                className="px-8 py-3 rounded-full font-bold text-[#301ec9] hover:bg-[#301ec9]/5 transition-colors active:scale-95"
                style={{ fontFamily: "Manrope" }}
              >
                Lưu nháp
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-10 py-3 rounded-full font-bold bg-[#5700bf] text-white shadow-lg shadow-[#5700bf]/20 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Manrope" }}
              >
                {loading ? "Đang tạo..." : "Tạo sự kiện ngay"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                Xem trước hiển thị
              </h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-[#301ec9] text-white flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14l4 4V5c0-1.1-.9-2-2-2zm-2 12h-4v4h-4v-4H6v-4h4V7h4v4h4v4z" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-[#eceef0] text-[#484554] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-5-5zm-5 18c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Event Card Preview */}
            <div className="group relative bg-white rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(48,30,201,0.08)] transition-all">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPnWgTrIH6iMBoeN-PXMMcyrWDQzz6rS7sKb063EYuV3bPkFDSfhknR4lgkWMzzdQwjXwDqu2AYZ8LyR1DWwjiJsWhvEcVhn6sScQDH9PNiZ6D83zJqJeDMl4cPzMxfHA1GFSrBfdczBkwlIn6GYOgRoom7_ciYbHVErgNMCbTRQYLpib7DhZ6uoF-Iput68U49B0Dd_C-7Oxjval3tkTcrx1MPXIuP_jPIgkzUAArc4R5wTBmh9X5-6JZL59UKtSKCkiGQVJ7prU"
                  alt="Event preview"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-[#301ec9] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Âm nhạc
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#5700bf] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl" style={{ fontFamily: "Manrope" }}>
                  Từ {price ? `${price}đ` : "500,000đ"}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3 text-[#301ec9]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Thứ Bảy, 25 Tháng 12, 2024
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold leading-tight text-[#191c1e]" style={{ fontFamily: "Manrope" }}>
                  {eventName || "Tên sự kiện của bạn sẽ hiển thị ở đây"}
                </h2>
                <p className="text-[#484554] text-sm line-clamp-2 leading-relaxed" style={{ fontFamily: "Be Vietnam Pro" }}>
                  {description || "Phần mô tả ngắn gọn giúp khách hàng hiểu nhanh về nội dung và sức hút của sự kiện..."}
                </p>
                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#484554]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <span className="text-xs font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
                      {location || "Địa điểm tổ chức"}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Xf_NeCGkQPQmzSUHPgqddL9kfTxAUmyzVRWBqIVTsnFEPcDLp45CvJFwu2_R-C3MTPAby9g3OZjuiWILiy90ZnCaor0GqhhsgxgT6isp25qvWNzRsCs_5tlz03vWtnbXdbNAP1Z8_euAbLl72Yh7P7BE2fH2fSmPcZBMvOlkhnH8GU_H5IoLeWgwrgUModAm-3X0Kg15yMgB6BHYx_WLgoSNwSRpxiBU0K-AkGYp5Viw21Qk0ad5mXT7DtWolTSjQge3mG6ydtA"
                        alt="User 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW6kvLAF9TZIwveqsH1Wqip-D4Nz2dS4XYaqK1i_CsS5DBsMxtiUHshI6iIspvsbxE37DlbwipP1Omn0eZ8Q-S4wofzDY5ywd0x8z1YtFu7pEGzRJjs_IpOhujAmNP5hcn0-SgtoT2LKcxod0xWRqCvs63gXPoOe1ochnIvY_Q36hbyu2KCVQgcVx9PNZ3zYF_qQvZm7SppzmmN_IJPj1qx6L8i6VtK3wExtrXIl-6AfSIcjddHkLU30hCUCuUxRCc_r_xuifbwlI"
                        alt="User 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#301ec9] flex items-center justify-center text-[10px] text-white font-bold" style={{ fontFamily: "Manrope" }}>
                      +1k
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge Tip Box */}
            <div className="mt-8 p-6 bg-[#e2dfff]/30 rounded-xl border-l-4 border-[#301ec9]">
              <div className="flex gap-4">
                <Lightbulb className="w-5 h-5 text-[#301ec9] flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#3323cc]" style={{ fontFamily: "Manrope" }}>
                    Mẹo nhỏ từ Concierge
                  </p>
                  <p className="text-xs text-[#3323cc]/80 leading-relaxed mt-1" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Một hình ảnh banner chất lượng cao và tiêu đề ngắn gọn sẽ tăng tỉ lệ nhấp chuột lên đến 40%. Hãy thử sử dụng các từ ngữ gợi cảm xúc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

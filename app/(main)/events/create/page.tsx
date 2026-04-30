"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Layers } from "lucide-react";
import TopNavBar from "@/app/components/TopNavBar";
import Footer from "@/app/components/Footer";
import { adminEventsApi } from "@/lib/api/events";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(10);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("music");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const CATEGORIES = [
    { value: 'music', label: 'Âm nhạc' },
    { value: 'arts', label: 'Nghệ thuật' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'technology', label: 'Công nghệ' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create local preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Check permission when user data is available
  useEffect(() => {
    if (!isAuthLoading && user && user.role === 'customer') {
      setShowPermissionModal(true);
    }
  }, [user, isAuthLoading]);

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

      let banner_url = undefined;

      // Upload image if selected
      if (imageFile) {
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          reader.readAsDataURL(imageFile);
          const base64 = await base64Promise;

          const uploadRes = await adminEventsApi.uploadBanner({
            fileName: imageFile.name,
            mimeType: imageFile.type,
            base64: base64
          });

          if (uploadRes?.url) {
            banner_url = uploadRes.url;
          }
        } catch (uploadErr) {
          console.error("Lỗi khi upload ảnh:", uploadErr);
          setError("Tải ảnh thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: eventName,
        description: description,
        start_time: new Date(startTime).toISOString(),
        location: location,
        category: category,
        banner_url: banner_url,
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
        setShowSuccessModal(true);
        console.log("✅ Event created successfully, waiting for admin approval...");
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
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#301ec9] mb-1" style={{ fontFamily: "Manrope" }}>
            Tạo sự kiện mới
          </h1>
          <p className="text-sm text-[#484554] font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
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



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Basic Information Section */}
            <section className="bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.04)]">
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Thời gian bắt đầu
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ fontFamily: "Be Vietnam Pro" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Thể loại
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e] appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ fontFamily: "Be Vietnam Pro" }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                      Địa điểm
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border-none bg-[#eceef0] focus:ring-2 focus:ring-[#301ec9] transition-all text-[#191c1e]"
                      placeholder="Ví dụ: Nhà hát lớn Hà Nội"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ fontFamily: "Be Vietnam Pro" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
                    Ảnh bìa (Banner)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#d1d5db] rounded-lg bg-[#eceef0] hover:bg-[#e5e7eb] transition-colors relative cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-[#9ca3af]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-[#484554] justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#301ec9] hover:text-[#25159c] focus-within:outline-none">
                          <span style={{ fontFamily: "Be Vietnam Pro" }}>{imageFile ? imageFile.name : 'Tải ảnh lên'}</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                      <p className="text-xs text-[#6b7280]" style={{ fontFamily: "Be Vietnam Pro" }}>PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
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
            </section>

            {/* Seat Configuration Section */}
            <section className="bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(48,30,201,0.04)]">
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
              <div className="bg-[#e6e8ea] rounded-xl p-6 overflow-hidden">
                <div className="w-full h-1.5 bg-slate-400 rounded-full mb-8 relative">
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
                        className={`w-6 h-6 rounded-md shadow-sm ${seat.isVIP ? "bg-[#5700bf]" : "bg-[#301ec9]"
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold text-[#484554]" style={{ fontFamily: "Be Vietnam Pro" }}>
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
          <div className="lg:col-span-5 sticky top-24">
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
                  alt="Event Preview"
                  className="w-full h-full object-cover"
                  src={imagePreview || "/logo.png"}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-[#301ec9] shadow-sm">
                  {CATEGORIES.find(c => c.value === category)?.label || category}
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

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-scale-in">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-4" style={{ fontFamily: "Manrope" }}>
              Quyền hạn hạn chế
            </h3>
            <p className="text-center text-slate-600 leading-relaxed mb-8" style={{ fontFamily: "Be Vietnam Pro" }}>
              Bạn chưa thể dùng tính năng này - Hãy tham gia một tổ chức nào đó để được ủy quyền tạo sự kiện.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-[#301ec9] text-white font-headline font-black py-4 rounded-full shadow-lg shadow-[#301ec9]/20 hover:opacity-90 transition-all active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl border border-white/20 animate-scale-in relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-3xl font-black text-center text-[#191c1e] mb-4 leading-tight" style={{ fontFamily: "Manrope" }}>
                Tạo sự kiện thành công!
              </h3>

              <div className="bg-indigo-50/50 rounded-2xl p-6 mb-8 border border-indigo-100/50">
                <p className="text-center text-[#484554] leading-relaxed font-medium" style={{ fontFamily: "Be Vietnam Pro" }}>
                  Sự kiện <span className="text-[#301ec9] font-bold">"{eventName}"</span> của bạn đã được gửi hệ thống và đang <span className="text-[#301ec9] font-bold">chờ Admin phê duyệt</span>.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push('/events')}
                  className="w-full bg-[#301ec9] text-white font-black py-4 rounded-full shadow-lg shadow-[#301ec9]/20 hover:opacity-90 hover:translate-y-[-2px] transition-all active:scale-95"
                  style={{ fontFamily: "Manrope" }}
                >
                  Về trang danh sách
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-white text-[#484554] font-bold py-4 rounded-full border-2 border-[#eceef0] hover:bg-[#eceef0] transition-all active:scale-95"
                  style={{ fontFamily: "Manrope" }}
                >
                  Quản lý Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

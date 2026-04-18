"use client";

import { Music, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-slate-100 bg-white mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto text-sm leading-relaxed" style={{ fontFamily: "Be Vietnam Pro" }}>
        <div className="md:col-span-1">
          <span className="text-lg font-bold text-slate-900 mb-4 block" style={{ fontFamily: "Manrope" }}>
            TicketRush
          </span>
          <p className="text-slate-500">
            Trải nghiệm đặt vé thông minh và đẳng cấp dành cho người Việt.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Manrope" }}>
            Sự kiện
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Âm nhạc
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Sân khấu
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Workshop
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Manrope" }}>
            Hỗ trợ
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Trung tâm hỗ trợ
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Liên hệ
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Chính sách hoàn tiền
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "Manrope" }}>
            Pháp lý
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Điều khoản
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-900 transition-colors"
                href="#"
              >
                Bảo mật
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4" style={{ fontFamily: "Be Vietnam Pro" }}>
        <span className="text-slate-400">© 2024 TicketRush. Digital Concierge Experience.</span>
        <div className="flex gap-6">
          <a className="text-slate-400 hover:text-[#301ec9] transition-colors" href="#">
            <Music className="w-5 h-5" />
          </a>
          <a className="text-slate-400 hover:text-[#301ec9] transition-colors" href="#">
            <Globe className="w-5 h-5" />
          </a>
          <a className="text-slate-400 hover:text-[#301ec9] transition-colors" href="#">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb] text-on-surface font-body">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
        
        {/* Footer */}
        <footer className="w-full bg-white border-t border-slate-100 mt-auto py-10">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-sm font-black text-slate-900 font-headline">
                TicketRush <span className="text-primary">Admin</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">
                © 2024 TicketRush Ecosystem. All rights reserved.
              </p>
            </div>
            <nav className="flex gap-8 mt-6 md:mt-0">
              <a className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors" href="#">Hỗ trợ</a>
              <a className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors" href="#">Tài liệu API</a>
              <a className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors" href="#">Bảo mật</a>
              <a className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors" href="#">Phản hồi</a>
            </nav>
          </div>
        </footer>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 flex justify-around items-center py-4 px-6 z-50 rounded-3xl shadow-2xl">
        <button className="text-white">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
        </button>
        <button className="text-white/50">
          <span className="material-symbols-outlined text-[24px]">event</span>
        </button>
        <button className="text-white/50">
          <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
        </button>
        <button className="text-white/50">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </button>
      </nav>
    </div>
  );
}

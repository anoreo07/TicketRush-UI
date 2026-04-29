'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { id: 'events', label: 'Sự kiện', icon: 'event', href: '/admin/events' },
  { id: 'seats', label: 'Sơ đồ ghế', icon: 'event_seat', href: '/admin/seats' },
  { id: 'orders', label: 'Đơn hàng', icon: 'confirmation_number', href: '/admin/orders' },
  { id: 'users', label: 'Người dùng', icon: 'group', href: '/admin/users' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 sticky top-0 bg-white p-6 gap-2 border-r border-slate-100 z-40">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tighter">TicketRush</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hệ thống quản trị</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                isActive 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-slate-400 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] leading-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all font-medium text-sm mt-auto"
        >
          <span className="material-symbols-outlined text-[22px] leading-none">
            settings
          </span>
          <span>Cài đặt</span>
        </Link>
      </nav>
    </aside>
  );
};

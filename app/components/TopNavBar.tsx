'use client';

import Link from "next/link";
import Image from "next/image";
import ProfileDropdown from "./auth/ProfileDropdown";
import { getUserData } from "@/lib/api/client";
import { useEffect, useState } from "react";

interface TopNavBarProps {
  hiddenLinks?: boolean;
}

export default function TopNavBar({ hiddenLinks = false }: TopNavBarProps) {
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUserData(getUserData());

    // Load notifications
    const loadNotifications = () => {
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(stored);
    };
    loadNotifications();
    window.addEventListener('storage', loadNotifications);
    return () => window.removeEventListener('storage', loadNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      // Mark all as read when opening
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem('notifications', JSON.stringify(updated));
    }
  };
  
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_20px_40px_rgba(48,30,201,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo_with_text.png"
              alt="TicketRush"
              width={150}
              height={100}
              className="h-10 w-auto"
            />
          </Link>
          {!hiddenLinks && (
            <div className="hidden md:flex items-center gap-6 font-['Manrope'] font-semibold tracking-tight">
              <a
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                href="/dashboard"
              >
                Trang chủ
              </a>
              <a
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                href="/events"
              >
                Sự kiện
              </a>
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              href="/tickets"
            >
              Vé của tôi
            </a>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/organization-register" className="p-2 text-slate-600 hover:text-indigo-600 hover:scale-95 duration-200 transition-all group relative" title="Đăng ký với tổ chức">
            <span className="material-symbols-outlined">domain_add</span>
          </Link>
          <Link href="/drafts" className="p-2 text-slate-600 hover:text-indigo-600 hover:scale-95 duration-200 transition-all" title="Đơn hàng nháp">
            <span className="material-symbols-outlined">receipt_long</span>
          </Link>
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:scale-95 duration-200 relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {mounted && unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Thông báo</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => {
                        setNotifications([]);
                        localStorage.setItem('notifications', '[]');
                      }}
                      className="text-xs text-slate-500 hover:text-red-500"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                      <p className="text-sm">Không có thông báo nào</p>
                    </div>
                  ) : (
                    notifications.map(note => (
                      <div key={note.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-700 font-medium leading-snug">{note.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(note.date).toLocaleTimeString('vi-VN')} - {new Date(note.date).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/events/create"
            className="hidden md:block px-6 py-2 bg-tertiary text-on-tertiary font-bold rounded-full hover:bg-[#4a40e0] transition-all active:scale-95"
          >
            Tạo sự kiện
          </Link>

          <ProfileDropdown userEmail={userData?.email || "User"} />
        </div>
      </div>
    </nav>
  );
}

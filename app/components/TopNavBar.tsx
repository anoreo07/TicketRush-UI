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

  useEffect(() => {
    setMounted(true);
    setUserData(getUserData());
  }, []);
  
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
          <button className="p-2 text-slate-600 hover:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>

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

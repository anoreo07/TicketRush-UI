"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, User } from "lucide-react";

export default function TopNavBar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-[100]">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-7xl mx-auto">
        <div className="text-xl font-black text-[#301ec9] tracking-tighter cursor-pointer">
          TicketRush
        </div>
        <div className="hidden md:flex gap-10 items-center font-manrope font-semibold text-sm tracking-tight">
          <a
            className="text-gray-700 hover:text-[#301ec9] transition-colors"
            href="/"
          >
            Trang chủ
          </a>
          <a
            className="text-gray-700 hover:text-[#301ec9] transition-colors"
            href="#"
          >
            Sự kiện
          </a>
          <a
            className="text-gray-700 hover:text-[#301ec9] transition-colors"
            href="/tickets"
          >
            Vé của tôi
          </a>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-xs font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-[#301ec9]/20"
              placeholder="Tìm kiếm sự kiện..."
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#301ec9]">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#301ec9]">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

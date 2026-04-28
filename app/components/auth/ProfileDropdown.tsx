"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { clearAuthData } from "@/lib/api/client";
import { User, LogOut, Settings } from "lucide-react";

interface ProfileDropdownProps {
  userEmail?: string;
}

export default function ProfileDropdown({ userEmail = "User" }: ProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Call logout API
      await authApi.logout();
      // Clear local storage
      clearAuthData();
      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if API fails, clear local data
      clearAuthData();
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <User className="h-5 w-5 relative z-10" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          {/* User Info Section */}
          <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Tài khoản
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userEmail}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* View Profile */}
            <button
              onClick={handleViewProfile}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 group"
            >
              <Settings className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Xem hồ sơ</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">
                {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

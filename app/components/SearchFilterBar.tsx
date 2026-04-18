"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter, ArrowRight } from "lucide-react";

export default function SearchFilterBar() {
  return (
    <section className="mb-12 -mt-20 relative z-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row flex-wrap gap-3 items-end mt-10">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-[11px] font-black text-[#301ec9] uppercase tracking-[0.15em] mb-4.5 px-1">
              Tìm sự kiện
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#301ec9]/20 text-sm font-medium placeholder:text-gray-400"
                placeholder="Tên nghệ sĩ, sự kiện..."
                type="text"
              />
            </div>
          </div>
          <div className="w-full md:w-auto min-w-[180px]">
            <label className="block text-[11px] font-black text-[#301ec9] uppercase tracking-[0.15em] mb-2 px-1">
              Thời gian
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <select className="w-full pl-11 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#301ec9]/20 text-sm font-medium appearance-none cursor-pointer">
                <option>Tất cả thời gian</option>
                <option>Tháng này</option>
                <option>Sắp tới</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto min-w-[160px]">
            <label className="block text-[11px] font-black text-[#301ec9] uppercase tracking-[0.15em] mb-2 px-1">
              Thể loại
            </label>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <select className="w-full pl-11 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#301ec9]/20 text-sm font-medium appearance-none cursor-pointer">
                <option>Mọi thể loại</option>
                <option>Âm nhạc</option>
                <option>Nghệ thuật</option>
                <option>Workshop</option>
              </select>
            </div>
          </div>
          <Button className="bg-[#301ec9] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2818a0] transition-all flex items-center gap-2 group h-auto w-full md:w-auto">
            Tìm kiếm
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

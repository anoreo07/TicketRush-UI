"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black group h-[400px] md:h-[550px]">
      <div className="absolute inset-0 transition-transform duration-700">
        <img
          className="w-full h-full object-cover opacity-85"
          alt="vibrant music festival banner"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9s81KkSXNeKsAHWrnV5aIFqzDVw3cP2HyNFSmh5KGJTkNcja9cDPA74r9A9QWJ5chfC3nzfSPxNyxtUM02WWVms1jxcQ7fbUC9cndEE4JrECv6Ao2BJimUtCTzQail6nn9mCep8PyffwejmUn9_Jcsy4qR1uLuKvzzFLO6KNSqncNf3u36VgdXe1y1ypRaMJrT0MxOnt_-NgEkIL_ejXI_V6S1KJpTeIZJ7XMSwFFZe0orjbmjFEob6NlvQc4yaZgAalJwJKrkBg"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-end pb-16">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#301ec9] text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Sự kiện tâm điểm
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Sky Tour: Mùa hè rực rỡ 2024
          </h1>
          <div className="flex flex-wrap gap-6 text-white/90 mb-8 font-medium text-sm">
            <div className="flex items-center gap-2">
              📅 15/12/2024
            </div>
            <div className="flex items-center gap-2">
              📍 Sân vận động Mỹ Đình, Hà Nội
            </div>
          </div>
          <Button className="bg-[#301ec9] hover:bg-[#2818a0] text-white px-8 py-3 rounded-full font-bold text-base shadow-lg shadow-[#301ec9]/30 transition-all hover:scale-105 flex items-center gap-2 h-auto">
            Mua vé ngay
            <Ticket className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white ring-3 ring-white/20 cursor-pointer"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/50 cursor-pointer transition-colors"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/50 cursor-pointer transition-colors"></div>
      </div>
    </section>
  );
}

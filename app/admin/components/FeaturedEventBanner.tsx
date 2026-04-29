'use client';

import React from 'react';

export const FeaturedEventBanner = () => {
  return (
    <section className="animate-fade-in-up">
      <div className="relative w-full h-48 rounded-3xl overflow-hidden group shadow-lg">
        <img
          alt="Featured Concert"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvsQJ5XYNpRIIRT3pyOJUz4NUtdA14FSgigIFP_UlxB6ICF1ru8qe9E8v1H26sIod0g0sLBXN4ZA31eovHK9dGGP0RXwh-64frKGmf0Z_Wltumb42-MhZhP4YU1twA2xcZVR3bhsfvX06xt23okzQ0iV9QGgbfCxuP4aUs0PlSErHFUzLEfj-mRlQbF1rlUdgsaWK22xzaiuTALe51YKC3cd7a0ucqvrRfaVz4nJLoGjyfT8tPbXxs5EtY5NVHLPcaYDf9jKypIk8"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex flex-col justify-center px-12 text-white">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-3">
            Sự kiện nổi bật
          </span>
          <h3 className="text-3xl font-black font-headline mb-1 tracking-tight">Sky Tour Concert 2024</h3>
          <p className="text-white/80 text-sm max-w-md font-medium">
            Hiện đang là sự kiện có tốc độ bán vé nhanh nhất trong tuần qua. Đã đạt 85% công suất ghế.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="bg-white text-primary px-6 py-2 rounded-xl text-sm font-bold hover:shadow-xl transition-all active:scale-95">
              Chi tiết
            </button>
            <button className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-xl text-sm font-bold border border-white/30 hover:bg-white/30 transition-all active:scale-95">
              Quản lý vé
            </button>
          </div>
        </div>

        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                fill="transparent"
                r="40"
                stroke="white"
                strokeDasharray="251.2"
                strokeDashoffset="37.68"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-black">85%</span>
            </div>
          </div>
          <span className="text-[10px] font-bold mt-2 uppercase text-white/70">Lấp đầy</span>
        </div>
      </div>
    </section>
  );
};

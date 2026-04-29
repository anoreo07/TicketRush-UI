'use client';

import React from 'react';

const days = [
  { label: 'T2', height: '40%' },
  { label: 'T3', height: '65%' },
  { label: 'T4', height: '55%' },
  { label: 'T5', height: '85%', active: true },
  { label: 'T6', height: '45%' },
  { label: 'T7', height: '95%' },
  { label: 'CN', height: '70%' },
];

const distribution = [
  { name: 'Concert Sky Tour 2024', percentage: 85, color: 'bg-primary', text: 'text-primary' },
  { name: 'Kịch: Đêm Trắng', percentage: 42, color: 'bg-tertiary', text: 'text-tertiary' },
  { name: 'Workshop Gốm Nghệ Thuật', percentage: 68, color: 'bg-indigo-400', text: 'text-indigo-400' },
  { name: 'Fashion Show: Spring 24', percentage: 24, color: 'bg-slate-400', text: 'text-slate-400' },
];

export const DashboardCharts = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sales Trend */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-50 animate-fade-in-up stagger-2">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-lg font-bold font-headline text-slate-900">Phân tích doanh thu</h4>
            <p className="text-xs text-slate-400 font-medium">Báo cáo hàng tuần</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-bold px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Tuần</button>
            <button className="text-xs font-bold px-4 py-2 text-slate-400 hover:text-slate-900 transition-colors">Tháng</button>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 relative mt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
            <div className="border-b border-black w-full"></div>
            <div className="border-b border-black w-full"></div>
            <div className="border-b border-black w-full"></div>
            <div className="border-b border-black w-full"></div>
          </div>
          
          {days.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col justify-end items-center gap-3 group">
              <div 
                className={`w-full rounded-2xl transition-all duration-500 ${
                  day.active ? 'bg-primary' : 'bg-slate-100 group-hover:bg-primary/20'
                }`}
                style={{ height: day.height }}
              ></div>
              <span className={`text-[10px] font-bold ${day.active ? 'text-primary' : 'text-slate-400'}`}>
                {day.label}
              </span>
            </div>
          ))}

          {/* SVG Line Overlay */}
          <svg className="absolute top-0 left-0 w-full h-[85%] pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path 
              d="M0,70 L16.6,50 L33.2,60 L50,20 L66.6,65 L83.2,10 L100,40" 
              fill="none" 
              stroke="#301ec9" 
              strokeLinecap="round" 
              strokeWidth="2" 
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-lg"
            ></path>
          </svg>
        </div>
      </div>

      {/* Distribution */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 animate-fade-in-up stagger-3">
        <h4 className="text-lg font-bold font-headline mb-8 text-slate-900">Phân bổ theo sự kiện</h4>
        <div className="space-y-7">
          {distribution.map((item) => (
            <div key={item.name} className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>{item.name}</span>
                <span className={item.text}>{item.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-10 w-full py-4 bg-slate-50 text-slate-900 text-xs font-bold rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 active:scale-95">
          Báo cáo chi tiết
        </button>
      </div>
    </section>
  );
};

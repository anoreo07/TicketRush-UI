'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  colorClass: string;
  isPrimary?: boolean;
  staggerClass?: string;
}

const StatCard = ({ label, value, icon, trend, colorClass, isPrimary, staggerClass }: StatCardProps) => {
  const baseClasses = `p-6 rounded-3xl border transition-all cursor-default group animate-fade-in-up ${staggerClass}`;
  const themeClasses = isPrimary 
    ? 'bg-primary text-white border-transparent shadow-xl shadow-primary/10' 
    : 'bg-white border-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-primary/20';

  return (
    <div className={`${baseClasses} ${themeClasses}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
          isPrimary ? 'bg-white/20 text-white' : `${colorClass} bg-opacity-10`
        }`}>
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isPrimary ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'
          }`}>
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span className="text-[10px] font-bold">{trend}</span>
          </div>
        )}

        {!trend && !isPrimary && (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase">
            Hiện tại
          </span>
        )}
      </div>

      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${isPrimary ? 'text-white/70' : 'text-slate-400'}`}>
          {label}
        </p>
        <h3 className={`text-2xl font-black font-headline mt-1 ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </h3>
      </div>
    </div>
  );
};

export const KPIStats = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Tổng sự kiện" 
        value="142" 
        icon="calendar_month" 
        trend="+12%" 
        colorClass="text-indigo-600"
        staggerClass="stagger-1"
      />
      <StatCard 
        label="Vé đã bán" 
        value="8,520" 
        icon="local_activity" 
        trend="+24%" 
        colorClass="text-purple-600"
        staggerClass="stagger-2"
      />
      <StatCard 
        label="Doanh thu (VND)" 
        value="2.450.000k" 
        icon="account_balance_wallet" 
        trend="+18.5%" 
        colorClass="" 
        isPrimary={true}
        staggerClass="stagger-3"
      />
      <StatCard 
        label="Ghế đang giữ" 
        value="342" 
        icon="lock_clock" 
        colorClass="text-orange-600"
        staggerClass="stagger-4"
      />
    </section>
  );
};

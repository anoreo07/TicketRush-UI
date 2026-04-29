'use client';

import React from 'react';

export const AdminHeader = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight font-headline">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 w-64 placeholder:text-slate-400 transition-all focus:bg-white focus:shadow-sm outline-none"
            placeholder="Tìm nhanh..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-slate-900">Admin TicketRush</p>
              <p className="text-[10px] text-slate-400 font-bold">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-xl border-2 border-primary/10 group-hover:border-primary transition-colors overflow-hidden">
              <img
                alt="Admin avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb-hghCA3eEYeNfJxHwce4GAM_cFx5Qmv2xD4O3h-bd0nH6-5VSytyx7ZNb1tkMVVAz9hEh-DUSu9vopvbI5_ttFSWPFftU8im1-X6AijyP6-CdkVs_t2p4AUmVaJ8YAzj0MLr38xFmlacW1JPvz2MEiMj81uAkhHSCKQ8J9sx-eNNizLqjxDps5iAwE2MGFlvwrRjTEnA9yhwpRAh0gSM8AgoYDghSDig-qqlb4MV_kzb1jaMYfanw2ADOUlfu7DADfYLPJBsZF4"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

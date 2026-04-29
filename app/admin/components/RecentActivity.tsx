'use client';

import React from 'react';

const activities = [
  {
    id: 1,
    type: 'purchase',
    user: 'Nguyễn Văn A',
    action: 'đã mua 02 vé',
    details: 'Concert Sky Tour 2024 • VIP-B12, B13',
    time: '5 phút trước',
    amount: '+1.500k',
    unit: 'VND',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvc9YtIh9DA4scM1hOI1UF7cxz52yuFlAE2aZ1tydHG11vVzMBVEwwUgCnHiMT06Hijfm5iD2RakjQDzhDG2DtSzmLXm50TbvpmjUqgrCuHaC0KgScDt2X8xwaZYnKkmA40zIHoMAFCk6C3rTRqVGImxO_PJzG9IDYOXLuheh3LuK-zvhnWQcS8BoJkNzVzaaClGd-OuAvuSQ22TWG4ah5go_DDVbLpifpWkI8ADXahE9rqe2dmKS-D2jhxiO_1AF5Owwp1nvXC6E'
  },
  {
    id: 2,
    type: 'new_event',
    title: 'Sự kiện mới được tạo',
    details: 'Kịch: Đêm Trắng • Nhà hát Hòa Bình',
    time: '1 giờ trước',
    status: 'Draft',
    statusColor: 'bg-tertiary/10 text-tertiary'
  },
  {
    id: 3,
    type: 'purchase',
    user: 'Lê Thị C',
    action: 'đã đặt vé',
    details: 'Workshop Gốm Nghệ Thuật • 4 vé',
    time: '2 giờ trước',
    amount: '+2.400k',
    unit: 'VND',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRr5LJG1Yfh_z1WqCIkwHcbnlj4wJ7cHRX_42-IRC2amwmQ8Omvkg7ij8ig80jKL3jEGm5naXmmljLslQVv_XDSVVoQEcmJH9aK2w1A26h9KCngzsQBttSU0aa4m_Xfp2pTsXdraFH-iDh83P-LfnQ2RyVbuXpWUPHuVobx5WMWlnWQoW1bJOHd2O-z7lo4hTxDi_O0kcLFouMe5ALlpxd81rUgC5ZW9EF5azLvbpUWz5Lal1RGmoxDLgALCGRkUXpI2B0xSydN4A'
  },
  {
    id: 4,
    type: 'refund',
    title: 'Yêu cầu hoàn tiền',
    details: 'Trần Văn D • Giao dịch #TR-8821',
    time: '3 giờ trước',
    amount: '-600k',
    status: 'Chờ duyệt',
    statusColor: 'text-error/60'
  }
];

export const RecentActivity = () => {
  return (
    <section className="space-y-6 animate-fade-in-up stagger-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-xl font-bold font-headline text-slate-900">Giao dịch mới nhất</h4>
          <p className="text-xs text-slate-400 font-medium">Cập nhật theo thời gian thực</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-lg shadow-sm text-primary">Tất cả</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Đơn vé</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Hoàn tiền</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-5 hover:border-primary/30 transition-all group hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer`}
          >
            {item.avatar ? (
              <div className="relative">
                <img src={item.avatar} alt="User" className="w-14 h-14 rounded-2xl object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[14px]">check</span>
                </div>
              </div>
            ) : (
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                item.type === 'new_event' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'
              }`}>
                <span className="material-symbols-outlined text-[28px]">
                  {item.type === 'new_event' ? 'add_circle' : 'report'}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-slate-900 truncate">
                {item.user ? (
                  <>
                    {item.user} <span className="text-slate-400 font-medium ml-1">{item.action}</span>
                  </>
                ) : item.title}
              </h5>
              <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">{item.details}</p>
              <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${
                item.type === 'new_event' ? 'text-tertiary' : item.type === 'refund' ? 'text-error' : 'text-primary'
              }`}>
                {item.time}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              {item.amount && (
                <p className={`text-sm font-black ${item.type === 'refund' ? 'text-error' : 'text-slate-900'}`}>
                  {item.amount}
                </p>
              )}
              {item.unit && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.unit}</p>
              )}
              {item.status && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.statusColor}`}>
                  {item.status}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Skeleton Loaders */}
        {[1, 2].map((i) => (
          <div key={`skeleton-${i}`} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-5 opacity-60 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 rounded-full w-3/4"></div>
              <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
            </div>
            <div className="w-12 h-4 bg-slate-100 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors active:scale-95">
          Tải thêm hoạt động <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>
      </div>
    </section>
  );
};

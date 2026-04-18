'use client';

import { EventBookingDetails } from '@/lib/types/booking';

interface EventBannerProps {
  event: EventBookingDetails;
}

export const EventBanner = ({ event }: EventBannerProps) => {
  return (
    <section className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt={event.title}
        src={event.image}
      />
      <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full md:w-2/3">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-tertiary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            {event.category}
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            {event.location.split(',')[0]}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-white leading-tight mb-4">
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed-dim">
              calendar_today
            </span>
            <span className="text-sm font-medium">
              {new Date(event.date).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed-dim">
              location_on
            </span>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

interface EventDetailsProps {
  event: EventBookingDetails;
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
      <h3 className="text-xl font-headline font-bold mb-4">Mô tả sự kiện</h3>
      <p className="text-on-surface-variant leading-relaxed mb-4">{event.description}</p>
      <div className="flex gap-4">
        <span className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-medium">
          Bình luận Tiếng Việt
        </span>
        <span className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-medium">
          Quà tặng Exclusive
        </span>
      </div>
    </div>
  );
};

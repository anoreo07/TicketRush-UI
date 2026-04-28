"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  badge?: {
    label: string;
    color: string;
    icon: string;
  };
  category: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
  soldOut?: boolean;
  eventId?: string;
}

export default function EventCard({
  badge,
  category,
  title,
  date,
  location,
  price,
  image,
  soldOut,
  eventId,
}: EventCardProps) {
  if (soldOut) {
    return (
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 opacity-70">
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            className="w-full h-full object-cover grayscale"
            alt={title}
            src={image}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-6 py-2 bg-red-500 text-white font-black text-sm rounded-lg transform -rotate-12 border-2 border-white shadow-lg">
              HẾT VÉ
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            {category}
          </div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="space-y-1.5 mb-3 opacity-60">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Đã kết thúc
            </div>
          </div>
          <Button disabled className="w-full py-2 bg-gray-100 text-gray-400 rounded-lg font-semibold text-sm cursor-not-allowed">
            Đã bán hết
          </Button>
        </div>
      </article>
    );
  }

  return (
    <Link href={eventId ? `/events/${eventId}` : "#"}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer">
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={title}
            src={image}
          />
          {badge && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span
                className={`px-2.5 py-1 ${badge.color} text-white text-[9px] font-black rounded-md shadow-md flex items-center gap-1.5 uppercase tracking-wide`}
              >
                {badge.label === "HOT" && "🔥"}
                {badge.label === "LIMITED" && "⚠️"}
                {badge.label}
              </span>
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#301ec9]/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
            <Button className="bg-white text-[#301ec9] px-5 py-2 rounded-full font-bold text-sm shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300 h-auto">
              Xem chi tiết
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="text-[10px] font-bold text-[#5700bf] uppercase tracking-widest mb-1.5">
            {category}
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
            {title}
          </h3>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#301ec9]" />
              {date}
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#301ec9]" />
              {location}
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm font-bold text-[#301ec9]">{price}</div>
            <Heart className="h-4 w-4 text-gray-300 hover:text-[#301ec9] cursor-pointer transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  );
}

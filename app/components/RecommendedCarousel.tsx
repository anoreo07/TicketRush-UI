"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { eventsApi, Event } from "@/lib/api/events";
import { getCategoryLabel } from "@/lib/utils";

export default function RecommendedCarousel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await eventsApi.getAll({
          page: 1,
          limit: 6,
          status: 'published',
        });
        const eventsList = Array.isArray(response) ? response : (response?.data || []);
        setEvents(eventsList);
      } catch (err: any) {
        console.error('Failed to fetch recommended events:', err);
        setError(err?.message || 'Không thể tải gợi ý sự kiện');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fallbackRecommendations = [
    {
      title: "Đêm nhạc: Chuyện Nhỏ",
      category: "ÂM NHẠC INDIE",
      location: "Mây Lang Thang, Đà Lạt",
      image:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    },
    {
      title: "Lễ hội Taste of Vietnam",
      category: "ẨM THỰC",
      location: "Công viên Lê Văn Tám",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    },
  ];

  const recommendations = events.length > 0 ? events.map((event) => ({
    title: event.title,
    category: getCategoryLabel(event.category).toUpperCase(),
    location: event.venue || event.location || "Chưa cập nhật địa điểm",
    image: event.banner_url || event.image_url || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop",
  })) : fallbackRecommendations;

  return (
    <section className="max-w-7xl mx-auto px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-gray-900">
          Dành cho bạn
        </h2>
        <p className="text-gray-600 text-sm font-medium mt-1">
          Gợi ý dựa trên sở thích của bạn
        </p>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-6 hide-scrollbar snap-x">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="min-w-[300px] md:min-w-[360px] snap-start"
          >
            <div className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md">
              <img
                className="w-full h-full object-cover"
                alt={item.title}
                src={item.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end">
                <div className="text-white">
                  <div className="text-[11px] font-bold text-blue-200 mb-2">
                    {item.category}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <div className="text-sm opacity-90 mb-4">{item.location}</div>
                  <Button className="bg-white text-[#301ec9] px-4 py-2 rounded-full text-sm font-bold shadow-lg h-auto">
                    Đặt vé
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

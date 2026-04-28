"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { eventsApi, Event } from "@/lib/api";

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
          limit: 3,
          status: 'published',
        });
        setEvents(response.data || []);
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
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAL_4q5F6H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5",
    },
    {
      title: "Lễ hội Taste of Vietnam",
      category: "ẨM THỰC",
      location: "Công viên Lê Văn Tám",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1",
    },
    {
      title: "V-League Round 12",
      category: "THỂ THAO",
      location: "SVĐ Hàng Đẫy",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuW1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0",
    },
  ];

  const recommendations = events.length > 0 ? events.map((event) => ({
    title: event.title,
    category: "SỰ KIỆN NỔI BẬT",
    location: event.venue || event.location || "Chưa cập nhật địa điểm",
    image: event.image_url || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop",
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

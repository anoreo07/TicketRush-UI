"use client";

import EventCard from "./EventCard";
import { ChevronRight } from "lucide-react";

export default function EventSection() {
  return (
    <section className="max-w-7xl mx-auto px-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Sự kiện nổi bật
          </h2>
          <div className="h-1 w-10 bg-[#5700bf] mt-2 rounded-full"></div>
        </div>
        <a
          className="flex items-center gap-1 text-[#301ec9] font-bold text-sm hover:underline"
          href="#"
        >
          Xem tất cả <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <EventCard
          badge={{
            label: "HOT",
            color: "bg-red-500",
            icon: "fire",
          }}
          category="Âm nhạc • Concert"
          title="Vietnamese Concert: Hoàng Thùy Linh"
          date="20:00, 20/12/2024"
          location="Nhà thi đấu Phú Thọ, HCM"
          price="Từ 850.000đ"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuC9s81KkSXNeKsAHWrnV5aIFqzDVw3cP2HyNFSmh5KGJTkNcja9cDPA74r9A9QWJ5chfC3nzfSPxNyxtUM02WWVms1jxcQ7fbUC9cndEE4JrECv6Ao2BJimUtCTzQail6nn9mCep8PyffwejmUn9_Jcsy4qR1uLuKvzzFLO6KNSqncNf3u36VgdXe1y1ypRaMJrT0MxOnt_-NgEkIL_ejXI_V6S1KJpTeIZJ7XMSwFFZe0orjbmjFEob6NlvQc4yaZgAalJwJKrkBg"
        />
        <EventCard
          badge={{
            label: "LIMITED",
            color: "bg-amber-500",
            icon: "warning",
          }}
          category="Công nghệ • Workshop"
          title="Mastering AI: Workshop cùng Chuyên Gia"
          date="09:00, 25/12/2024"
          location="Dreamplex, Hà Nội"
          price="Miễn phí"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAyMOvrzMXI3QE6nCLQ9djkkc6CagM3rpLJQ2JZhRvy4291gk9ndJkIS3fZnCdLxajvQOxerTGtb8jDnCSRW4y484xTTL_FovKcBUI7_stIabejEcNGybVRYYhpZub2NDm9C3hUJxTqg3X8LuZ6A508A0BLfqDBcBrViRWNJ9QE6vYBiCTo3r9Cop8oJ9nj-m68F-uQeVxmsfrQyJz1Ns3TRwN2NHCU-UGvZ1KevDr6UxrFGmPUK_v-F0if5YgzC9Ycruk0rst5AnU"
        />
        <EventCard
          category="Cổ điển • Gala"
          title="The Symphony of Seasons"
          date="Đã kết thúc"
          location="Hội trường"
          price="N/A"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDQXnavu4EcYE2piyqG5Llh4K3xsQnFeB5wRzhm9pTEFBkk_aMAJoojLP0WckmAs8s2k-LCNDraujXCMviV7wmgKEBcgV7yh5xUc8OQdUoyAAEacS2XFrmCQuNeaMod21P8_0l7kE51_TjIut2ddDoXU_3435dYzNVqxmzcXd27zmPZsJwCpyvgYZpKyAkWMY_H-CzxxabvexFLqBSMtgjmkLM_Y5hkbhBQnZGUOTfksRBTRveY9_iXjDfYILit6do7IeJ-Sv2-eMY"
          soldOut
        />
        <EventCard
          category="Nghệ thuật • Triển lãm"
          title="Vũ trụ Hội họa: Triển lãm 2024"
          date="Hằng ngày (9:00 - 21:00)"
          location="Bảo tàng Mỹ thuật TP.HCM"
          price="Từ 120.000đ"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAsCj9u_6B5E8uG0A0H0n5H6j-o8L8q9s1v5G4R3X9v-l8q9s1v5G4R3X9v_l8q9s1v5G4R3X9v_l8q9s1v5G4R3X9v"
        />
      </div>
    </section>
  );
}

"use client";

export default function EventSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-gray-900">
          Sự kiện sắp diễn ra
        </h2>
        <div className="h-1 w-10 bg-[#301ec9] mt-2 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`animate-pulse bg-gray-100 rounded-xl overflow-hidden border border-gray-200 ${
              item > 1 && item <= 2 ? "hidden sm:block" : ""
            } ${item > 2 ? "hidden lg:block" : ""}`}
          >
            <div className="aspect-[3/4] bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-2 w-1/3 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-4/5 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-2.5 w-1/2 bg-gray-200 rounded-full"></div>
                <div className="h-2.5 w-2/3 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 w-full bg-gray-200 rounded-lg mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

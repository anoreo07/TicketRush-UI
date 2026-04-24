'use client';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 w-full border-t border-slate-100 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-7xl mx-auto">
        <div className="mb-6 md:mb-0">
          <span className="font-bold text-slate-900 dark:text-white text-lg">
            TicketRush
          </span>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-slate-500 mt-2">
            © 2024 TicketRush. Trải nghiệm đẳng cấp.
          </p>
        </div>
        <div className="flex gap-8 font-['Be_Vietnam_Pro'] text-xs text-slate-500">
          <a
            className="text-slate-400 hover:text-indigo-500 underline transition-colors"
            href="#"
          >
            Về chúng tôi
          </a>
          <a
            className="text-slate-400 hover:text-indigo-500 underline transition-colors"
            href="#"
          >
            Điều khoản
          </a>
          <a
            className="text-slate-400 hover:text-indigo-500 underline transition-colors"
            href="#"
          >
            Bảo mật
          </a>
          <a
            className="text-slate-400 hover:text-indigo-500 underline transition-colors"
            href="#"
          >
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
}

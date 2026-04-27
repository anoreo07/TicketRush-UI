'use client';

interface TopNavBarProps {
  hiddenLinks?: boolean;
}

export default function TopNavBar({ hiddenLinks = false }: TopNavBarProps) {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_20px_40px_rgba(48,30,201,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 tracking-tighter brand-font">
            TicketRush
          </span>
          {!hiddenLinks && (
            <div className="hidden md:flex items-center gap-6 font-['Manrope'] font-semibold tracking-tight">
              <a
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                href="/"
              >
                Trang chủ
              </a>
              <a
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                href="/"
              >
                Sự kiện
              </a>
              <a
                className="text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-700 pb-1"
                href="/tickets"
              >
                Vé của tôi
              </a>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-600 hover:scale-95 duration-200">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

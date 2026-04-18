'use client';

import React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

export const SignupFooter = () => {
  const links: FooterLink[] = [
    { label: 'Điều khoản', href: '#' },
    { label: 'Bảo mật', href: '#' },
    { label: 'Liên hệ', href: '#' },
  ];

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="mb-6 md:mb-0">
          <span className="text-lg font-bold text-slate-900 dark:text-white">TicketRush</span>
          <p className="mt-2 font-body text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            © 2024 TicketRush. Trải nghiệm đẳng cấp bởi Digital Concierge.
          </p>
        </div>
        <div className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-500 dark:text-slate-400 font-body text-sm hover:underline decoration-[#5700bf] opacity-80 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

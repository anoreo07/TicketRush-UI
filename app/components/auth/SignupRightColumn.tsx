'use client';

import React from 'react';

export const SignupRightColumn = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full lg:w-1/2 bg-surface-container-lowest flex flex-col justify-center items-center p-6 md:p-12 lg:p-20">
      <div className="w-full max-w-lg">
        {/* Form Header */}
        <header className="mb-10 text-center md:text-left">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-3">Tạo tài khoản mới</h2>
          <p className="text-on-surface-variant font-medium">Tham gia cộng đồng TicketRush để không bỏ lỡ những sự kiện tuyệt vời.</p>
        </header>

        {/* Social Auth & Divider */}
        {children}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-on-surface-variant font-medium">
            Đã có tài khoản?
            <a href="#" className="text-primary font-extrabold ml-1 hover:underline decoration-primary/30">
              Đăng nhập ngay
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
};

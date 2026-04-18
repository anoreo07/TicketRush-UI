import React from 'react';
import { SignupLeftColumn } from '@/app/components/auth/SignupLeftColumn';
import { SignupRightColumn } from '@/app/components/auth/SignupRightColumn';
import { SocialAuthButtons } from '@/app/components/auth/SocialAuthButtons';
import { FormDivider } from '@/app/components/auth/FormDivider';
import { SignupForm } from '@/app/components/auth/SignupForm';
import { SignupFooter } from '@/app/components/auth/SignupFooter';

export const metadata = {
  title: 'Đăng ký - TicketRush',
  description: 'Tạo tài khoản TicketRush để bắt đầu đặt vé sự kiện yêu thích của bạn',
};

export default function SignupPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col lg:flex-row">
        <SignupLeftColumn />
        <SignupRightColumn>
          <SocialAuthButtons />
          <FormDivider />
          <SignupForm />
        </SignupRightColumn>
      </main>
      <SignupFooter />
    </>
  );
}

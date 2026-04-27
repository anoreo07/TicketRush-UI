import type { Metadata, Viewport } from "next";
import { Manrope, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { EventBookingClientWrapper } from "@/app/components/providers/EventBookingClientWrapper";

const manrope = Manrope({
  variable: "--font-headline",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TicketRush - Đặt vé sự kiện online",
  description: "Nền tảng đặt vé sự kiện hàng đầu Việt Nam",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("light", "font-sans", manrope.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} ${beVietnamPro.variable} bg-surface text-on-surface min-h-screen flex flex-col`}
      >
        <EventBookingClientWrapper>
          {children}
        </EventBookingClientWrapper>
      </body>
    </html>
  );
}

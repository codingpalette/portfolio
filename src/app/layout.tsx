import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@shared/ui/theme-provider";
import { AuthProvider } from "@features/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이성재 | Full-Stack Developer Portfolio",
  description:
    "React, TypeScript, Next.js, Python, FastAPI, NestJS를 활용하는 풀스택 개발자 이성재의 포트폴리오입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

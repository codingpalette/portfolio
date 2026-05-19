import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@shared/ui/theme-provider";
import { AuthProvider } from "@features/auth";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";

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
        className={`${geistMono.variable} font-sans overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

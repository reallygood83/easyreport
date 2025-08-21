import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://easyreport-steel.vercel.app"),
  title: {
    default: "Easy Report",
    template: "%s | Easy Report",
  },
  description: "AI가 도와주는 스마트 보고서 생성기",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Easy Report",
    description: "AI가 도와주는 스마트 보고서 생성기",
    url: "https://easyreport-steel.vercel.app",
    siteName: "Easy Report",
    images: [
      {
        url: "/social-card.svg",
        width: 1200,
        height: 630,
        alt: "Easy Report – AI가 도와주는 스마트 보고서 생성기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy Report",
    description: "AI가 도와주는 스마트 보고서 생성기",
    images: ["/social-card.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-blue-100 bg-white/80 backdrop-blur-sm text-sm text-gray-600">
            <div className="container mx-auto px-6 py-4 text-center">
              © 2025 김문정 | <a href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">배움의 달인 유튜브</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

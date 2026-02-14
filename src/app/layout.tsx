import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex - Lightning Fast URL Shortener",
  description:
    "Geographically distributed URL shortener with sub-50ms redirection and real-time analytics. Built with Next.js, Edge Functions, and Redis.",
  keywords: [
    "url shortener",
    "edge computing",
    "fast redirect",
    "link management",
  ],
  authors: [{ name: "Rohan Mishra" }],
  openGraph: {
    title: "Vortex - Lightning Fast URL Shortener",
    description: "Sub-50ms URL redirection powered by edge computing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}

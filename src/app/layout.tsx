import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex - Lightning Fast URL Shortener",
  description:
    "Geographically distributed URL shortener with real-time analytics",
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

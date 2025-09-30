import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuthGuard from "@/components/AuthGuard";
// ClientOnly wird nicht mehr benötigt

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praktikum App",
  description: "Beobachtungsbögen und Journal für das Praktikum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <Navigation />
          <AuthGuard>
            {children}
          </AuthGuard>
        </div>
      </body>
    </html>
  );
}

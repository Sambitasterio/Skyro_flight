import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Skyro — Book Flights",
    template: "%s | Skyro",
  },
  description:
    "Search and book flights across India. Compare fares, pick your seat, and manage trips with Skyro.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Skyro",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <PwaRegister />
          <Navbar />
          <div id="main-content" className="flex flex-1 flex-col">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

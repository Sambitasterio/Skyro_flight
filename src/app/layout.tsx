import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeScript } from "@/components/layout/ThemeScript";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

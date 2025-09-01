import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'FestiWise: Find Your Perfect Music Festival',
  description: 'Discover your ideal music festival worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}

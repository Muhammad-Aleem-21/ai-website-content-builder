import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SiteCopy AI | AI Website Content Builder",
  description:
    "Generate complete website content with AI: hero, about, services, features, testimonials and FAQs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div className="h-16 border-b border-slate-200/70 bg-white/80" />}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
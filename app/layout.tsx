import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodHub - Your Food Companion",
  description: "Track your food intake and improve your health",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <div className="flex flex-col min-h-screen pb-20 md:justify-center md:items-center md:min-h-screen md:bg-muted/30 md:p-4">
          <div
            className="w-full md:w-[390px] md:border md:border-border md:rounded-[2.5rem] md:overflow-hidden md:bg-background md:shadow-2xl md:relative md:flex md:flex-col md:max-h-[90vh]"
            style={{
              aspectRatio: "390 / 844",
            }}
          >
            <div className="flex flex-col min-h-screen pb-20 md:min-h-0 md:flex-1 md:flex md:flex-col md:overflow-y-auto md:scrollbar-hide md:pb-0">
              {children}
            </div>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}

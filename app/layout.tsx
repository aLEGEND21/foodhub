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
        <div className="flex flex-col h-screen md:justify-center md:items-center md:h-auto md:bg-muted/30 md:p-4">
          <div
            className="w-full h-full flex flex-col md:h-auto md:w-[390px] md:border md:border-border md:rounded-[2.5rem] md:overflow-hidden md:bg-background md:shadow-2xl md:relative md:max-h-[90vh]"
            style={{
              aspectRatio: "390 / 844",
            }}
          >
            <div className="flex flex-col min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0 md:scrollbar-hide">
              {children}
            </div>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}

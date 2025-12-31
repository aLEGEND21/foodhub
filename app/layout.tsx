import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeProvider } from "next-themes";
import { MobileMockupWrapper } from "@/components/mobile-mockup-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodHub",
  description: "Track your food intake and habits to improve your health",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          enableSystem
          disableTransitionOnChange={false}
        >
          <MobileMockupWrapper>
            <div
              className="flex w-full flex-col md:h-full md:overflow-hidden"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="md:scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto pb-17 md:pb-0"
                style={{
                  backgroundColor: "var(--background)",
                  flex: "1 1 0%",
                  minHeight: 0,
                  overflowY: "auto",
                }}
              >
                {children}
              </div>
              <BottomNav />
            </div>
          </MobileMockupWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

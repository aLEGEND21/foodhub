"use client";

import { useState, useEffect } from "react";
import { IPhoneMockup } from "react-device-mockup";

interface MobileMockupWrapperProps {
  children: React.ReactNode;
}

export function MobileMockupWrapper({ children }: MobileMockupWrapperProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Match Tailwind's md breakpoint (768px)
      setIsDesktop(window.innerWidth >= 768);
    };

    if (typeof window !== "undefined") {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, []);

  if (isDesktop) {
    // Renders the content inside a modern iPhone mockup on desktop
    return (
      <div className="bg-muted/30 dark:bg-background flex h-screen flex-col items-center justify-center p-4">
        <IPhoneMockup
          screenType="island" // Modern iPhone with Dynamic Island
          screenWidth={360} // Match the current layout width
          isLandscape={false} // Portrait mode
          hideNavBar={true} // Hide bottom nav bar on iPhone
          statusbarColor="transparent" // Make top area around island transparent
        >
          <div
            className="flex w-full flex-col"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </IPhoneMockup>
      </div>
    );
  }

  // Renders the app content normally on mobile/small screens
  return <div className="flex h-screen flex-col">{children}</div>;
}

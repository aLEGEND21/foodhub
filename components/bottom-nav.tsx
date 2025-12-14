"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Flame, TrendingUp } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/add-meal", label: "Add", icon: Plus },
    { href: "/history", label: "History", icon: Flame },
    { href: "/summary", label: "Trends", icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:mt-auto bg-card border-t border-border flex justify-around items-center max-w-md mx-auto w-full md:max-w-full md:mx-0 md:shrink-0 py-3">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

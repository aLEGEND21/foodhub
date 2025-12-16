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
    <nav className="bg-card border-border fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-md items-center justify-around border-t py-3 md:relative md:mx-0 md:mt-auto md:max-w-full md:shrink-0">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

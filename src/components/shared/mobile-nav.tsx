"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Timer, ListTodo, BarChart3, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Timer", icon: Timer },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t bg-background md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors duration-200",
              isActive
                ? "text-[hsl(var(--accent-h),var(--accent-s),var(--accent-l))]"
                : "text-muted-foreground",
            )}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

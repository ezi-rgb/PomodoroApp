"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  Timer,
  ListTodo,
  BarChart3,
  Settings,
  Github,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Timer", icon: Timer },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r bg-sidebar transition-all duration-300 md:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-14 items-center justify-center border-b">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--accent-h),var(--accent-s),var(--accent-l))] text-white"
          aria-label="Pomodoro Home"
        >
          <Timer className="h-5 w-5" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2 p-3 border-t">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:text-sidebar-accent-foreground"
          aria-label="View source on GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </aside>
  );
}

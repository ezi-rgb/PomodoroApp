import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { AccentInitializer } from "@/components/shared/accent-initializer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pomodoro - Focus Timer",
    template: "%s | Pomodoro",
  },
  description:
    "A modern, beautiful Pomodoro timer for focused productivity. Track your sessions, manage tasks, and boost your productivity.",
  keywords: [
    "pomodoro",
    "timer",
    "productivity",
    "focus",
    "time management",
    "task management",
  ],
  authors: [{ name: "Pomodoro App" }],
  creator: "Pomodoro App",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pomodoro",
    title: "Pomodoro - Focus Timer",
    description: "A modern, beautiful Pomodoro timer for focused productivity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro - Focus Timer",
    description: "A modern, beautiful Pomodoro timer for focused productivity.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>
            <AccentInitializer />
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 pb-16 md:pb-0 md:pl-16">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <MobileNav />
            </div>
            <Toaster
              position="bottom-right"
              richColors
              closeButton
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

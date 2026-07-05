import { StatisticsPanel } from "@/features/statistics/components/statistics-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track your productivity and focus time statistics.",
};

export default function AnalyticsPage() {
  return <StatisticsPanel />;
}

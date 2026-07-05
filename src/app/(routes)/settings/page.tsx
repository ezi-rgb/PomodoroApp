import { SettingsPanel } from "@/features/settings/components/settings-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize your Pomodoro experience.",
};

export default function SettingsPage() {
  return <SettingsPanel />;
}

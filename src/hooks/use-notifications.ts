"use client";

import { useCallback, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";

export function useNotifications() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;
    Notification.requestPermission();
  }, [settings.notificationsEnabled]);

  const notify = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!settings.notificationsEnabled) return false;
      if (!("Notification" in window)) return false;

      if (Notification.permission !== "granted") return false;

      const notification = new Notification(title, {
        icon: "/icons/icon-192x192.png",
        ...options,
      });

      setTimeout(() => notification.close(), 5000);
      return true;
    },
    [settings.notificationsEnabled],
  );

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!settings.vibrationEnabled) return;
      if (!navigator.vibrate) return;
      navigator.vibrate(pattern);
    },
    [settings.vibrationEnabled],
  );

  return { requestPermission, notify, vibrate };
}

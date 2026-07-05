import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const todaySessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: "default",
        startedAt: { gte: todayStart, lte: todayEnd },
        completed: true,
      },
    });

    const weekSessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: "default",
        startedAt: { gte: weekStart, lte: weekEnd },
        completed: true,
      },
    });

    const totalSessions = await prisma.pomodoroSession.count({
      where: { userId: "default", completed: true },
    });

    const todayFocusTime = todaySessions.reduce(
      (sum, s) => sum + (s.type === "focus" ? s.duration : 0),
      0,
    );

    const weekFocusTime = weekSessions.reduce(
      (sum, s) => sum + (s.type === "focus" ? s.duration : 0),
      0,
    );

    const lastWeekStart = startOfDay(subDays(weekStart, 7));
    const lastWeekSessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: "default",
        startedAt: { gte: lastWeekStart, lte: weekStart },
        completed: true,
      },
    });
    const lastWeekFocusTime = lastWeekSessions.reduce(
      (sum, s) => sum + (s.type === "focus" ? s.duration : 0),
      0,
    );

    const percentageChange =
      lastWeekFocusTime > 0
        ? Math.round(
            ((weekFocusTime - lastWeekFocusTime) / lastWeekFocusTime) * 100,
          )
        : 0;

    return NextResponse.json({
      today: {
        focusTime: todayFocusTime,
        completedSessions: todaySessions.length,
      },
      week: {
        focusTime: weekFocusTime,
        completedSessions: weekSessions.length,
      },
      totalSessions,
      trend: {
        percentageChange,
        direction: percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "stable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}

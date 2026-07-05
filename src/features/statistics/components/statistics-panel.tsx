"use client";

import { useStatisticsStore } from "@/stores/statistics-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/utils/format";
import { cn } from "@/lib/cn";
import {
  Clock,
  Brain,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { subDays, format, startOfWeek, eachDayOfInterval } from "date-fns";

export function StatisticsPanel() {
  const { dailyStats, streak, getWeeklyStats, getMonthlyStats } = useStatisticsStore();
  const weekly = getWeeklyStats();
  const monthly = getMonthlyStats();

  const today = format(new Date(), "yyyy-MM-dd");
  const todayStats = dailyStats[today] ?? {
    date: today,
    totalFocusTime: 0,
    completedSessions: 0,
    tasksCompleted: 0,
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: new Date(),
  });

  const maxDailyTime = Math.max(
    1,
    ...Object.values(dailyStats).map((d) => d.totalFocusTime),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-sm text-muted-foreground">
          Track your productivity and focus time
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Brain className="h-4 w-4" />}
          label="Today Focus"
          value={formatDuration(todayStats.totalFocusTime)}
          sub="minutes"
        />
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={`${streak.current}`}
          sub={`${streak.longest} longest`}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Sessions"
          value={`${todayStats.completedSessions}`}
          sub="completed today"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Weekly"
          value={formatDuration(weekly.totalFocusTime)}
          sub="this week"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1">
            {weekDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const stats = dailyStats[dateStr];
              const value = stats?.totalFocusTime ?? 0;
              const height = (value / maxDailyTime) * 100;

              return (
                <div key={dateStr} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDuration(value)}
                  </span>
                  <div className="flex w-full items-end justify-center" style={{ height: 64 }}>
                    <div
                      className={cn(
                        "w-full max-w-[24px] rounded-t-sm transition-all duration-500",
                        value > 0
                          ? "bg-[hsl(var(--accent-h),var(--accent-s),var(--accent-l))]"
                          : "bg-muted",
                      )}
                      style={{ height: `${Math.max(4, height)}%` }}
                      role="img"
                      aria-label={`${format(day, "EEEE")}: ${formatDuration(value)}`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {format(day, "EEE")}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Monthly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SummaryRow label="Total Focus Time" value={formatDuration(monthly.totalFocusTime)} />
          <SummaryRow label="Completed Sessions" value={`${monthly.completedSessions}`} />
          <SummaryRow label="Tasks Completed" value={`${monthly.tasksCompleted}`} />
          {(() => {
            const now = new Date();
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const monthPrefix = now.toISOString().slice(0, 7);
            const activeDays = [...new Set(
              Object.entries(dailyStats)
                .filter(([date, s]) => date.startsWith(monthPrefix) && s.completedSessions > 0)
                .map(([date]) => date),
            )].length;
            const rate = daysInMonth > 0 ? (activeDays / daysInMonth) * 100 : 0;
            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days Active</span>
                  <span className="font-medium">{Math.round(rate)}%</span>
                </div>
                <Progress value={rate} className="h-2" />
              </div>
            );
          })()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyStats &&
              Object.entries(dailyStats)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 14)
                .map(([date, stats]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
                  >
                    <span className="text-muted-foreground">
                      {format(new Date(date), "MMM d, yyyy")}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {stats.completedSessions} sessions
                      </span>
                      <span className="w-16 text-right font-mono text-xs tabular-nums">
                        {formatDuration(stats.totalFocusTime)}
                      </span>
                    </div>
                  </div>
                ))}
            {Object.keys(dailyStats).length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No sessions recorded yet. Start a timer to see your statistics.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {icon}
            <span>{label}</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          <span className="text-[10px] text-muted-foreground">{sub}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

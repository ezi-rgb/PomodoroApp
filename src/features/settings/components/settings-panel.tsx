"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCENT_COLORS, SOUND_TYPES } from "@/constants";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Vibrate,
  Music,
  Timer,
  RotateCcw,
  Pause,
  Sparkles,
  Eye,
  Languages,
  Palette,
} from "lucide-react";
import type { AccentColor, Language, Theme, TimeFormat } from "@/types";

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your Pomodoro experience
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-4 w-4" />
            Timer Duration
          </CardTitle>
          <CardDescription>Set the duration for each session type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DurationSlider
            label="Focus Duration"
            value={settings.focusDuration}
            min={1}
            max={180}
            step={5}
            unit="min"
            onChange={(v) => updateSettings({ focusDuration: v })}
          />
            <DurationSlider
              label="Short Break"
              value={settings.shortBreak}
              min={1}
              max={30}
              step={1}
              unit="min"
              onChange={(v) => updateSettings({ shortBreak: v })}
            />
            <DurationSlider
              label="Long Break"
              value={settings.longBreak}
              min={1}
              max={60}
              step={5}
              unit="min"
              onChange={(v) => updateSettings({ longBreak: v })}
            />
          <DurationSlider
            label="Long Break Interval"
            value={settings.longBreakInterval}
            min={2}
            max={8}
            step={1}
            unit="sessions"
            onChange={(v) => updateSettings({ longBreakInterval: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Pause className="h-4 w-4" />
            Auto Start
          </CardTitle>
          <CardDescription>Automatically start the next session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            label="Auto-start breaks"
            description="Automatically start break after a focus session"
            checked={settings.autoStartBreaks}
            onCheckedChange={(v) => updateSettings({ autoStartBreaks: v })}
          />
          <ToggleRow
            icon={<Timer className="h-4 w-4" />}
            label="Auto-start pomodoros"
            description="Automatically start next focus session after a break"
            checked={settings.autoStartPomodoros}
            onCheckedChange={(v) => updateSettings({ autoStartPomodoros: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Music className="h-4 w-4" />
            Sound
          </CardTitle>
          <CardDescription>Configure audio feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={<Music className="h-4 w-4" />}
            label="Sound enabled"
            description="Play sound when session completes"
            checked={settings.soundEnabled}
            onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
          />
          {settings.soundEnabled && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-type">Sound type</Label>
                <Select
                  value={settings.soundType}
                  onValueChange={(v) => updateSettings({ soundType: v })}
                >
                  <SelectTrigger id="sound-type" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOUND_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume">Volume</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <Slider
                  id="volume"
                  value={[settings.soundVolume]}
                  onValueChange={([v]) => updateSettings({ soundVolume: v })}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>Browser and device notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            label="Browser notifications"
            description="Show notification when session completes"
            checked={settings.notificationsEnabled}
            onCheckedChange={(v) => updateSettings({ notificationsEnabled: v })}
          />
          <ToggleRow
            icon={<Vibrate className="h-4 w-4" />}
            label="Vibration"
            description="Vibrate device when session completes"
            checked={settings.vibrationEnabled}
            onCheckedChange={(v) => updateSettings({ vibrationEnabled: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription>Theme, accent color, and display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {[
                { value: "system", icon: <Monitor className="h-4 w-4" />, label: "System" },
                { value: "light", icon: <Sun className="h-4 w-4" />, label: "Light" },
                { value: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark" },
              ].map(({ value, icon, label }) => (
                <Button
                  key={value}
                  variant={settings.theme === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ theme: value as Theme })}
                  className="gap-2"
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Accent Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map(({ name, value }) => (
                <button
                  key={name}
                  onClick={() => updateSettings({ accentColor: name as AccentColor })}
                  className={`h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    settings.accentColor === name
                      ? "scale-110 border-foreground"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: value }}
                  aria-label={`Set accent color to ${name}`}
                  title={name}
                />
              ))}
            </div>
          </div>

          <Separator />

          <ToggleRow
            icon={<Sparkles className="h-4 w-4" />}
            label="Animations"
            description="Enable smooth transitions and effects"
            checked={settings.animationsEnabled}
            onCheckedChange={(v) => updateSettings({ animationsEnabled: v })}
          />
          <ToggleRow
            icon={<Eye className="h-4 w-4" />}
            label="Reduced motion"
            description="Minimize animations for accessibility"
            checked={settings.reducedMotion}
            onCheckedChange={(v) => updateSettings({ reducedMotion: v })}
          />
          <ToggleRow
            icon={<Eye className="h-4 w-4" />}
            label="Compact mode"
            description="Reduce spacing and padding"
            checked={settings.compactMode}
            onCheckedChange={(v) => updateSettings({ compactMode: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Languages className="h-4 w-4" />
            Regional
          </CardTitle>
          <CardDescription>Language and time preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(v) => updateSettings({ language: v as Language })}
            >
              <SelectTrigger id="language" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="time-format">Time Format</Label>
            <div className="flex gap-1">
              {[
                { value: "24h", label: "24h" },
                { value: "12h", label: "12h" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={settings.timeFormat === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ timeFormat: value as TimeFormat })}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DurationSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-mono tabular-nums text-muted-foreground">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

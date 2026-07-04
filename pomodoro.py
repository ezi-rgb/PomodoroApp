import tkinter as tk

class PomodoroApp:

    THEME = {
        "bg": "#e0e5ec",
        "text_main": "#4a5568",
        "accent_start": "#ff7f50",
        "accent_reset": "#2d3748",
        "shadow_light": "#ffffff",
        "shadow_dark": "#a3b1c6",
        "font_timer": ("Helvetica", 56, "bold"),
        "font_ui": ("Helvetica", 12, "bold"),
        "pixel_font": ("Courier New", 10)
    }

    WORK_SECONDS = 25 * 60
    BREAK_SECONDS = 5 * 60

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Pomodoro Timer")
        self.root.geometry("360x520")
        self.root.configure(bg=self.THEME["bg"])
        self.root.resizable(False, False)

        self.is_working = True
        self.is_running = False
        self.time_left = self.WORK_SECONDS

        self._build_display_panel()
        self._build_controls()

        self._update_ui()
        self.root.after(1000, self._tick)

    def _get_shadow_config(self, raised=True):
        """Helper to create the 3D effect"""
        if raised:
            return {
                "bg": self.THEME["bg"],
                "highlightbackground": self.THEME["shadow_light"],
                "highlightcolor": self.THEME["shadow_dark"],
                "highlightthickness": 8,
                "bd": 0
            }
        return {"bg": self.THEME["bg"]}

    def _build_display_panel(self):
        """The top 'screen' area with rounded corners effect"""
        # Main Panel Container
        panel = tk.Frame(
            self.root,
            bg=self.THEME["bg"],
            highlightbackground=self.THEME["shadow_dark"],
            highlightcolor=self.THEME["shadow_light"],
            highlightthickness=8,
            bd=0
        )
        panel.pack(pady=30, padx=20, fill="x")

        tk.Label(
            panel, text="SESSION 1",
            font=self.THEME["font_ui"],
            fg="#8892b0", bg=self.THEME["bg"]
        ).pack(pady=(20, 5))

        self.timer_label = tk.Label(
            panel, text=self._format_time(self.time_left),
            font=self.THEME["font_timer"],
            fg=self.THEME["text_main"],
            bg=self.THEME["bg"]
        )
        self.timer_label.pack()

        cat_art = """
      /\\_/\\
     ( o.o )
      > ^ <
        """
        self.cat_label = tk.Label(
            panel, text=cat_art,
            font=self.THEME["pixel_font"],
            fg=self.THEME["text_main"],
            bg=self.THEME["bg"],
            justify="center"
        )
        self.cat_label.pack(pady=10)

    def _create_tactile_button(self, parent, text, command, color_key, icon=""):
        """Creates a button that looks like a physical key"""
        btn_frame = tk.Frame(
            parent,
            bg=color_key,
            highlightbackground=self.THEME["shadow_light"],
            highlightcolor=self.THEME["shadow_dark"],
            highlightthickness=6,
            bd=0,
            cursor="hand2"
        )

        inner = tk.Frame(btn_frame, bg=color_key)
        inner.pack(expand=True, fill="both", padx=10, pady=15)

        label = tk.Label(
            inner, text=text,
            font=self.THEME["font_ui"],
            fg="white", bg=color_key
        )
        label.pack(side="left")

        if icon:
            tk.Label(inner, text=icon, font=("Arial", 14), fg="white", bg=color_key).pack(side="right")

        btn_frame.label = label

        btn_frame.bind("<ButtonPress-1>", lambda e: self._press_effect(btn_frame, color_key))
        btn_frame.bind("<ButtonRelease-1>", lambda e: self._release_effect(btn_frame, color_key, command))

        return btn_frame

    def _press_effect(self, frame, color):
        """Visual feedback: flatten the shadow"""
        frame.config(highlightthickness=2)

    def _release_effect(self, frame, color, command):
        """Visual feedback: restore shadow + run logic"""
        frame.config(highlightthickness=6)
        command()

    def _build_controls(self):
        """The bottom control area"""
        control_frame = tk.Frame(self.root, bg=self.THEME["bg"])
        control_frame.pack(fill="x", padx=20)

        left_col = tk.Frame(control_frame, bg=self.THEME["bg"])
        left_col.pack(side="left", expand=True, fill="x")

        right_col = tk.Frame(control_frame, bg=self.THEME["bg"])
        right_col.pack(side="right", expand=True, fill="x")

        self.start_btn = self._create_tactile_button(
            left_col, "START", self.toggle_timer,
            self.THEME["accent_start"], icon="▶"
        )
        self.start_btn.pack(pady=10, padx=(0, 10), fill="x", expand=True)

        self.reset_btn = self._create_tactile_button(
            right_col, "RESET", self.reset_timer,
            self.THEME["accent_reset"], icon="↺"
        )
        self.reset_btn.pack(pady=10, padx=(10, 0), fill="x", expand=True)

    def _tick(self):
        """The heartbeat of the app"""
        if self.is_running:
            if self.time_left > 0:
                self.time_left -= 1
            else:
                self.is_working = not self.is_working
                self.is_running = False
                self.time_left = self.WORK_SECONDS if self.is_working else self.BREAK_SECONDS
                self._update_ui()

        self.timer_label.config(text=self._format_time(self.time_left))
        self.root.after(1000, self._tick)

    def _format_time(self, seconds):
        m, s = divmod(seconds, 60)
        return f"{m:02d}:{s:02d}"

    def _update_ui(self):
        """Updates text based on state"""
        # Update button text
        if hasattr(self.start_btn, 'label'):
            self.start_btn.label.config(
                text="PAUSE" if self.is_running else "START"
            )

        status = "Focusing" if self.is_working else "Break Time"
        # (In a real app, we'd update the cat art here too)

    def toggle_timer(self):
        self.is_running = not self.is_running
        self._update_ui()

    def reset_timer(self):
        self.is_working = True
        self.is_running = False
        self.time_left = self.WORK_SECONDS
        self._update_ui()

if __name__ == "__main__":
    app = PomodoroApp()
    app.root.mainloop()

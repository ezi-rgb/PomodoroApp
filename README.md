# 🍅 Pomodoro

A modern, production-grade Pomodoro timer application built with Next.js, TypeScript, and TailwindCSS. Features a beautiful neumorphic UI, task management, detailed analytics, and full offline support.

[![CI](https://github.com/yourusername/pomodoro/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/pomodoro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Features

- **Pomodoro Timer** — Customizable focus/break durations with timestamp-based accuracy
- **Task Management** — Full CRUD with priorities, labels, and pomodoro tracking
- **Analytics** — Daily, weekly, monthly statistics with heatmap visualization
- **Settings** — Theme (light/dark/system), accent colors, sounds, notifications
- **Keyboard Shortcuts** — Space (start/pause), S (skip), R (reset)
- **Offline Support** — PWA with service worker caching
- **Responsive** — 320px to 4K with mobile-first design
- **Accessible** — WCAG AA compliant, ARIA labels, keyboard navigation
- **Animations** — Smooth Framer Motion transitions (respects reduced motion)

## Tech Stack

| Category          | Technologies                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| Framework         | [Next.js 15](https://nextjs.org/) (App Router)                               |
| Language          | [TypeScript](https://www.typescriptlang.org/) (strict mode)                  |
| Styling           | [TailwindCSS](https://tailwindcss.com/) + shadcn/ui                          |
| State             | [Zustand](https://github.com/pmndrs/zustand)                                 |
| Forms             | React Hook Form + Zod                                                        |
| Database          | PostgreSQL + [Prisma](https://www.prisma.io/)                                |
| Animations        | [Framer Motion](https://www.framer.com/motion/)                              |
| Icons             | [Lucide](https://lucide.dev/)                                                |
| Charts            | Recharts                                                                     |
| Testing           | Vitest + React Testing Library + Playwright                                  |
| CI/CD             | GitHub Actions                                                               |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### Installation

```bash
git clone https://github.com/yourusername/pomodoro.git
cd pomodoro
npm install
```

### Environment Variables

```bash
cp .env.example .env
# Edit .env with your database URL
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Unit tests
npm run test:run

# Watch mode
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # REST API routes (tasks, sessions, settings, statistics)
│   └── (routes)/           # App pages (tasks, analytics, settings)
├── components/
│   ├── ui/                 # shadcn/ui components (Button, Card, Dialog, etc.)
│   └── shared/             # Shared components (Sidebar, ThemeProvider, etc.)
├── features/
│   ├── pomodoro/           # Timer display, controls, session logic
│   ├── tasks/              # Task CRUD, list, filtering
│   ├── analytics/          # Statistics panel, charts
│   ├── settings/           # Settings panel with all config options
│   └── statistics/         # Statistics store and calculations
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (cn, prisma, timer-engine, validations)
├── services/               # Sound service with Web Audio API
├── stores/                 # Zustand stores (timer, tasks, settings, statistics)
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions (format)
├── constants/              # App constants
└── config/                 # App configuration
```

## Architecture

### Timer Engine

The timer uses a **timestamp-based reducer** pattern rather than relying solely on `setInterval`. This ensures accuracy across browser events (sleep, tab switching, refresh):

- State machine: `idle → running → paused → running → completed`
- Time calculated as `totalDuration - elapsed`
- Elapsed time computed from `Date.now()` deltas, not tick counts
- Persisted to localStorage via Zustand middleware

### State Management

All state is managed through Zustand stores with localStorage persistence:

- `timer-store` — Timer state machine + config
- `tasks-store` — Task CRUD + filters
- `settings-store` — App preferences
- `statistics-store` — Session logging + analytics

## Keyboard Shortcuts

| Key     | Action                              |
| ------- | ----------------------------------- |
| `Space` | Start / Pause / Resume              |
| `S`     | Skip to next session                |
| `R`     | Reset timer                         |

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

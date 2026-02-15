# Contributing to Claude Session Dashboard

Thanks for your interest in contributing! This project is open to contributions of all kinds.

## Getting Started

```bash
git clone https://github.com/dlupiak/claude-session-dashboard.git
cd claude-session-dashboard/apps/web
npm install
npm run dev
```

The dev server runs on http://localhost:3000. It reads session data from `~/.claude` (read-only).

## Project Structure

The project uses **Vertical Slice Architecture** — code is organized by feature, not by layer:

```
apps/web/src/
  routes/          # File-based routes (TanStack Router)
  features/        # Feature slices (sessions, stats, settings, etc.)
  lib/             # Scanner, parsers, cache, utilities
  components/      # Shared UI components
```

Each feature slice contains its own server functions, queries, and UI components.

## Development Commands

```bash
npm run dev          # Dev server
npm run typecheck    # TypeScript checking
npm run lint         # ESLint
npm run test         # Unit tests (Vitest)
npm run build        # Production build
```

## Making Changes

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run quality checks: `npm run typecheck && npm run lint && npm run build`
4. Commit with a descriptive message
5. Open a Pull Request

## Conventions

- **TypeScript** — no `any` types, use Zod for runtime validation
- **Tailwind CSS v4** — utility-first, CSS-first configuration
- **TanStack Query** — all data fetching through React Query hooks
- **Named exports** — prefer named exports over default exports
- **Dark theme** — `bg-gray-950` body, `border-gray-800` borders

## Good First Issues

Check the [good first issue](https://github.com/dlupiak/claude-session-dashboard/labels/good%20first%20issue) label for beginner-friendly tasks.

## Questions?

Open a [Discussion](https://github.com/dlupiak/claude-session-dashboard/discussions) or comment on the issue you're working on.

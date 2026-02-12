---
name: uiux
description: Dashboard design system — colors, typography, spacing, components, and visual patterns for the session dashboard UI.
user_invocable: false
---

# Dashboard Design System

## Theme

Dark theme dashboard optimized for developer tooling and data visualization.

## Tailwind Theme

Uses Tailwind CSS v4 with CSS-first config (`@import 'tailwindcss'` in `app.css`).

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `gray-950` | Body background | Page background |
| `gray-900/50` | Card/panel background | `bg-gray-900/50` |
| `gray-800` | Borders, dividers | `border-gray-800` |
| `gray-700` | Subtle fills | Inactive bars, muted elements |
| `gray-600` | Disabled states | |
| `gray-500` | Muted text | Timestamps, labels |
| `gray-400` | Secondary text | Descriptions |
| `gray-300` | Headings, labels | Panel titles |
| `gray-100` | Primary text | Body text |
| `white` | Emphasis text | Hero numbers, key values |
| `blue-400` / `blue-500` | Primary accent | Links, input tokens, messages |
| `emerald-400` | Success / output | Output tokens |
| `amber-400` / `amber-500` | Warning / cache | Cache tokens, autocompact |
| `purple-400` / `purple-500` | Accent | Cache creation, system overhead |
| `red-400` | Error | Error messages, limits |

### Data Visualization Colors

| Category | Color |
|----------|-------|
| Input tokens | `blue-400` |
| Output tokens | `emerald-400` |
| Cache read | `amber-400` |
| Cache creation | `purple-400` |
| System overhead | `purple-500` |
| Messages | `blue-500` |
| Free space | `gray-700` |

## Component Patterns

| Component | Classes |
|-----------|---------|
| Panel/Card | `rounded-xl border border-gray-800 bg-gray-900/50 p-4` |
| Panel title | `text-sm font-semibold text-gray-300` |
| Hero number | `text-2xl font-bold text-white` |
| Subtitle | `text-[10px] text-gray-500` |
| Label | `text-xs text-gray-400` |
| Mono value | `text-xs font-mono text-gray-300` |
| Badge | `rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400` |
| Bar track | `h-2 rounded-full bg-gray-800 overflow-hidden` |
| Link | `text-sm text-blue-400 hover:underline` |
| Muted link | `text-xs text-gray-500 hover:text-gray-300` |

## Layout

- 2-column grid at `md:` breakpoint for stat panels
- Full-width panels for timeline, agents, tasks
- Consistent `gap-4` between grid items
- `mt-6` between major page sections
- `space-y-2` for list items within panels

## Typography

- Font: system monospace for values, default sans for labels
- Never use font weights heavier than `font-bold`
- Use `font-mono` for numeric values, IDs, model names
- Token counts formatted with K/M suffixes (e.g., `29.5K`, `8.3M`)

## Visual Rules

1. **Dark-first** — all backgrounds are dark gray, text is light
2. **Subtle borders** — `border-gray-800` only, no shadows
3. **Rounded panels** — `rounded-xl` for cards, `rounded-full` for bars/badges
4. **Opacity for bars** — colored bar segments use `opacity-60`
5. **Compact density** — small text sizes (`text-xs`, `text-[10px]`), tight spacing
6. **Recharts styling** — dark tooltips (`bg-gray-800`), no grid lines, subtle reference lines

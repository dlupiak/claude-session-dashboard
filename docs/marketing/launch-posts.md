# Claude Session Dashboard — Launch Posts

> Marketing kit for sharing the project across communities.
> GitHub: https://github.com/dlupiak/claude-session-dashboard

---

## Available Screenshots

All screenshots are in `screenshots/` at the repo root. Enable **privacy mode** before taking new screenshots so real project names are anonymized.

| File | Shows | Best for |
|------|-------|----------|
| `sessions-page.png` | Session list with search, filters, pagination (107 sessions) | First impression, browsing UX |
| `session-detail.png` | Top of detail: context window + tool usage + cost estimation | Core value prop — context & cost visibility |
| `session-detail-full.png` | Full detail page zoomed out: context, tools, costs, agents, timeline | Showing everything in one shot |
| `stats-overview.png` | Stats: summary cards, heatmap, daily activity with tooltip | Best stats screenshot — interactive feel |
| `stats-overview-full.png` | Full stats page: all charts including model usage + hourly | Complete analytics overview |
| `stats-projects.png` | Projects tab: sortable table with per-project metrics | Per-project analytics feature |
| `settings-page.png` | Settings: privacy toggle, subscription tiers, API pricing table | Configurability, privacy mode |

---

## GitHub Stars Growth Strategy

### Phase 1: Pre-launch prep (before posting anywhere)

- [ ] **README polish** — already solid. Consider adding a short GIF/video demo at the top (30s walkthrough). Projects with video get 2-3x more stars.
- [ ] **GitHub Topics** — add relevant topics to the repo: `claude`, `claude-code`, `anthropic`, `developer-tools`, `observability`, `dashboard`, `ai-tools`, `typescript`, `tanstack`, `session-analytics`
- [ ] **Social preview image** — set a custom Open Graph image in repo Settings > Social preview. Use `session-detail.png` or create a branded banner. This is what shows when people share the GitHub link.
- [ ] **"Good first issue" labels** — create 3-5 easy issues labeled `good first issue` to attract contributors
- [ ] **CONTRIBUTING.md** — add basic contributing guide (even a short one helps)
- [ ] **Star call-to-action** — add a tasteful "If you find this useful, consider starring the repo" line at the bottom of the README

### Phase 2: Launch week (Days 1-7)

Follow the posting strategy below. Each post drives traffic to GitHub where the polished README converts visitors to stargazers.

**Key insight:** Stars come in waves. Each platform post creates a spike. Stack them across days (don't post everywhere at once) for sustained momentum. GitHub's trending algorithm rewards consistent daily growth over single-day spikes.

### Phase 3: Awesome lists & directories (Week 1-2)

Submit PRs to these curated lists (each accepted PR = ongoing discovery traffic):

| List | URL | Category |
|------|-----|----------|
| awesome-claude | https://github.com/tonysurfly/awesome-claude | Claude ecosystem tools |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | Claude Code tools & resources |
| awesome-claude-code (jqueryscript) | https://github.com/jqueryscript/awesome-claude-code | Claude Code integrations |
| awesome-claude-skills | https://github.com/travisvn/awesome-claude-skills | Claude skills & workflows |
| awesome-claude-skills (Composio) | https://github.com/ComposioHQ/awesome-claude-skills | Claude skills |
| awesomeclaude.ai | https://awesomeclaude.ai/ | Claude AI directory (submit via site) |

**PR entry format:**
```markdown
- [Claude Session Dashboard](https://github.com/dlupiak/claude-session-dashboard) — Free, local-only observability dashboard for Claude Code sessions. Visualizes token usage, tool calls, costs, and activity trends.
```

### Phase 4: Newsletter submissions (Week 2-3)

Reach out to these newsletters — a single mention can drive 100-500+ stars:

| Newsletter | How to submit | Audience |
|------------|---------------|----------|
| Hacker Newsletter | https://hackernewsletter.com/ — curated from HN (get on HN first) | General dev |
| TLDR | https://tldr.tech/ — submit via their link submission | Broad tech |
| JavaScript Weekly | https://javascriptweekly.com/ — submit link | JS/TS devs |
| Node Weekly | https://nodeweekly.com/ — submit link | Node.js devs |
| React Status | https://react.statuscode.com/ — submit link | React devs |
| Console.dev | https://console.dev/ — submit for review | Dev tools |
| Changelog | https://changelog.com/news/submit — submit link | OSS community |
| Dev Resources | via social media mentions + Dev.to presence | General dev |

### Phase 5: Ongoing growth (Month 1+)

- [ ] **Respond to every issue and PR** — active maintainers attract more stars
- [ ] **Regular releases** — even small updates show the project is alive. GitHub activity feed shows releases.
- [ ] **Blog posts** — write 1-2 follow-up posts (e.g., "What I learned from 100 Claude Code sessions" using dashboard data)
- [ ] **Conference lightning talks** — local meetups or online events about Claude Code / AI dev tools
- [ ] **Cross-promote** — when people post Claude Code tips on Reddit/X, comment with relevant dashboard insights (not spammy — add genuine value)
- [ ] **GitHub Discussions** — enable Discussions tab for feature requests and community engagement
- [ ] **Sponsor/feature in Claude Code communities** — Anthropic Discord, Claude Code tips repos

### Anti-patterns to avoid

- Don't buy stars or use star-exchange services — GitHub detects and removes them
- Don't post the same message to 10 subreddits on the same day — looks spammy, gets flagged
- Don't ask for stars directly in community posts — let the README do that
- Don't neglect issues after launch — abandoned repos lose stars over time

---

## Posting Strategy

| Day | Platform | Post type |
|-----|----------|-----------|
| Day 1 | r/ClaudeAI + r/ClaudeCode | Reddit (core audience) |
| Day 2 | r/ChatGPTCoding + LinkedIn | Reddit + professional network |
| Day 3 | Hacker News + X/Twitter | Show HN + thread |
| Day 4-5 | r/webdev, r/opensource, r/selfhosted, Dev.to | Broader dev communities + blog |
| Week 2 | Product Hunt, Indie Hackers, Discord | Launch + community shares |
| Week 2-3 | Newsletter submissions, awesome list PRs | Long-tail discoverability |
| Ongoing | Comment engagement, follow-up blog posts, releases | Sustained growth |

---

## Reddit: r/ClaudeAI

> **Screenshots to include (in order):**
> 1. `session-detail.png` — lead with this, it's the money shot (context window + tool usage + costs)
> 2. `stats-overview.png` — heatmap + daily activity chart with tooltip
> 3. `sessions-page.png` — session list browsing
> 4. `stats-projects.png` — per-project breakdown
>
> Reddit allows up to 20 images. Use 3-4 for best engagement. Put the most impressive one first.

**Title:** I built a free dashboard to visualize all your Claude Code sessions — tools, costs, context usage, and activity trends

**Body:**

I've been experimenting with different Claude Code workflows — agents, skills, custom CLAUDE.md rules, delegation patterns — and realized I had no way to actually measure what's happening under the hood.

Are my agents actually being invoked? What tools are they calling? How much context does each session consume? What does a session actually cost me? And most importantly — which approach gives me the best results at the lowest cost?

All this data exists locally in `~/.claude`, but there's no built-in way to analyze it. So I built **Claude Session Dashboard**.

It's a local, read-only web app that scans your `~/.claude` directory and shows you:

- **Session list** — search, filter by status/project/model/date, sortable with pagination
- **Session detail** — context window breakdown, tool usage stats, agent dispatches with per-agent token counts
- **Gantt-style timeline** — see exactly when tools, agents, and skills fired during a session
- **Cost estimation** — per-session and per-agent costs based on Anthropic pricing, with model-level breakdowns
- **Stats page** — GitHub-style contribution heatmap, daily activity, model usage distribution, token trends over time
- **Per-project analytics** — sessions, messages, tokens, and duration aggregated per project
- **Data export** — CSV/JSON export for session summaries, model usage, daily activity, and project analytics
- **Privacy mode** — anonymize paths and project names for safe screenshot sharing
- **Live updates** — active sessions auto-refresh with adaptive polling

Runs 100% on localhost. Never modifies your Claude data. Never sends anything externally.

**Quick start:**

```
npx claude-session-dashboard
```

Or with Docker:
```
docker run -v ~/.claude:/home/node/.claude:ro -p 3000:3000 ghcr.io/dlupiak/claude-session-dashboard
```

GitHub: https://github.com/dlupiak/claude-session-dashboard

What metrics would help you the most when analyzing your Claude Code usage? I'd love to hear what you'd want to see next.

---

## Reddit: r/ClaudeCode

> **Screenshots to include (in order):**
> 1. `session-detail-full.png` — full detail page showing agents, tools, timeline (this audience cares about depth)
> 2. `session-detail.png` — zoomed-in context window + tool usage + cost breakdown
> 3. `stats-overview.png` — heatmap + activity charts
> 4. `settings-page.png` — pricing config + privacy mode (shows configurability)
>
> This is a technical audience — show more screenshots, especially the agent dispatch section and timeline.

**Title:** Built an observability dashboard for Claude Code — see your sessions, tool calls, agent dispatches, and costs

**Body:**

If you're like me and have been customizing Claude Code with agents, skills, and CLAUDE.md rules, you've probably wondered: what's actually happening inside my sessions?

I built **Claude Session Dashboard** to answer that. It reads your local `~/.claude` data (read-only, never modifies anything) and gives you a full picture:

- Browse and search all sessions across projects
- See context window utilization per session (input, output, cache read, cache creation)
- Gantt-style timeline of every tool call, agent dispatch, and skill invocation
- Cost estimation per session, per agent, per model — configurable pricing for Free/Pro/Max tiers
- GitHub-style contribution heatmap for token usage over the past year
- Per-project analytics with drill-down links
- CSV/JSON data export
- Privacy mode for safe screenshots

It helped me discover that some of my custom agents were being dispatched way less than I expected, and that certain tool patterns were eating context faster than others.

**One command:**

```
npx claude-session-dashboard
```

Docker:
```
docker run -v ~/.claude:/home/node/.claude:ro -p 3000:3000 ghcr.io/dlupiak/claude-session-dashboard
```

GitHub: https://github.com/dlupiak/claude-session-dashboard

Built with TanStack Start, React Query, Tailwind CSS v4, and Recharts.

What would you want to see in a tool like this? Open to feature requests.

---

## Reddit: r/ChatGPTCoding

> **Screenshots to include (in order):**
> 1. `session-detail.png` — context window + tool usage + cost (universal appeal)
> 2. `stats-overview.png` — heatmap + daily activity
> 3. `sessions-page.png` — session browsing
>
> Keep it to 3 screenshots. This is a multi-tool audience — make the value obvious at a glance.

**Title:** Built a free local dashboard to analyze Claude Code sessions — token usage, tool calls, costs, and timelines

**Body:**

For those of you using Claude Code (or considering it), I built an open-source dashboard that helps you understand what's happening inside your sessions.

Claude Code stores everything locally in `~/.claude` as JSONL files, but there's no built-in way to browse or analyze that data. This dashboard reads those files and shows you:

- **All your sessions** — searchable, filterable by project/model/date/status
- **Session detail** — context window breakdown, tool call frequency, agent dispatches with token counts
- **Timeline** — Gantt chart showing when every tool, agent, and skill fired
- **Cost estimation** — per-session costs by model, configurable for Free/Pro/Max tiers
- **Stats** — contribution heatmap, daily activity, model usage distribution, token trends
- **Per-project breakdown** — aggregate metrics across projects
- **Export** — CSV/JSON for your own analysis

100% local, read-only, never phones home.

I've been using it to compare different Claude Code approaches (agents vs direct prompting, Opus vs Sonnet costs, etc.) and it's been really eye-opening for optimizing my workflows.

```
npx claude-session-dashboard
```

GitHub: https://github.com/dlupiak/claude-session-dashboard

Anyone else tracking their AI coding tool usage? Would love to hear what metrics matter to you.

---

## Reddit: r/webdev

> **Screenshots to include (in order):**
> 1. `stats-overview.png` — the most visually impressive shot (heatmap, charts, summary cards)
> 2. `session-detail.png` — context window + tool usage (shows data visualization skills)
> 3. `stats-projects.png` — clean sortable table
> 4. `settings-page.png` — shows form design, tier selector
>
> This audience cares about UI/UX quality and tech stack. Show the most polished views. Mention TanStack and Tailwind in image captions.

**Title:** Built a localhost observability dashboard with TanStack Start, React Query, and Recharts — scans local files and visualizes session data

**Body:**

I wanted to share a project I built to solve my own problem: analyzing my Claude Code session data.

Claude Code (Anthropic's CLI coding tool) stores session logs as JSONL files locally. I had hundreds of sessions across dozens of projects with no way to make sense of them. So I built a dashboard.

**Tech stack:**
- TanStack Start (SSR on Vite) with file-based routing
- TanStack React Query for data fetching with background refetch
- Tailwind CSS v4 (CSS-first config)
- Recharts for charts — area charts, heatmaps, Gantt timelines
- Zod for runtime validation
- Vertical Slice Architecture (organized by feature, not by layer)

**What it does:**
- Scans `~/.claude` to discover and parse JSONL session files
- mtime-based caching to avoid re-parsing unchanged files
- Persistent disk cache for heatmap data
- Session list with search, filters, pagination
- Session detail with context window utilization, tool usage, timeline
- Cost estimation with configurable model pricing
- GitHub-style contribution heatmap
- CSV/JSON export (client-side, no server round-trip)
- Privacy mode for anonymizing paths in screenshots
- Active session detection with adaptive polling intervals

**Architecture:**
```
features/           # Vertical slices
  sessions/         # List, filters, active badge
  session-detail/   # Detail view, timeline, context window
  stats/            # Charts, heatmap, token trends
  project-analytics/# Per-project aggregated metrics
  cost-estimation/  # Cost calculator
  privacy/          # Anonymization
lib/
  scanner/          # Filesystem scanner
  parsers/          # JSONL parsers
  cache/            # Disk cache
```

Everything runs on localhost, read-only, no database — just filesystem reads with in-memory caches.

```
npx claude-session-dashboard
```

GitHub: https://github.com/dlupiak/claude-session-dashboard

Happy to discuss the architecture choices. The Vertical Slice approach worked really well for this — each feature is self-contained with its own server functions, queries, and UI components.

---

## Reddit: r/opensource

> **Screenshots to include (in order):**
> 1. `sessions-page.png` — clean session list (shows the product is real and polished)
> 2. `stats-overview.png` — analytics overview
> 3. `session-detail.png` — detail view
>
> 3 screenshots max. This audience cares more about the project's principles (MIT, local-only, no telemetry) than flashy visuals.

**Title:** Claude Session Dashboard — free, local-only observability for Claude Code sessions (MIT license)

**Body:**

I'm sharing an open-source project I built: **Claude Session Dashboard**.

Claude Code (Anthropic's AI coding CLI) stores all session data locally as JSONL files in `~/.claude`. There's no built-in analytics. This dashboard fills that gap.

**What it does:**
- Scans your local `~/.claude` directory (read-only, never modifies anything)
- Parses session logs to extract tool calls, token usage, model info, agent dispatches
- Presents everything in a searchable, filterable web UI
- Estimates costs per session/project/model
- GitHub-style contribution heatmap, timelines, charts
- CSV/JSON export
- Privacy mode for safe sharing

**Key principles:**
- Runs 100% on localhost
- Never sends data externally
- Never modifies Claude Code files
- No account, no telemetry, no tracking

**Install:**
```
npx claude-session-dashboard
```

Docker:
```
docker run -v ~/.claude:/home/node/.claude:ro -p 3000:3000 ghcr.io/dlupiak/claude-session-dashboard
```

Also available as a global npm package: `npm i -g claude-session-dashboard`

GitHub: https://github.com/dlupiak/claude-session-dashboard
npm: https://www.npmjs.com/package/claude-session-dashboard
License: MIT

Built with TanStack Start, React Query, Tailwind CSS v4, Recharts, Zod. Contributions welcome!

---

## Reddit: r/selfhosted

> **Screenshots to include (in order):**
> 1. `stats-overview-full.png` — full dashboard overview (self-hosted crowd loves seeing the whole thing)
> 2. `session-detail.png` — detail view with context + costs
> 3. `settings-page.png` — shows privacy toggle and config options (self-hosters love config)
>
> This audience loves Docker screenshots too. Consider adding a terminal screenshot of `docker compose up` output if possible.

**Title:** Claude Session Dashboard — self-hosted, local-only analytics for your Claude Code AI coding sessions (Docker + npm)

**Body:**

If you use Claude Code (Anthropic's AI coding CLI), all your session data is stored locally in `~/.claude` as JSONL files. But there's no way to browse or analyze it.

I built a self-hosted dashboard that reads those files and gives you:

- Session browsing with search and filters
- Token usage breakdown per session (input, output, cache)
- Tool call frequency and Gantt-style timeline
- Cost estimation per session/model (configurable pricing tiers)
- GitHub-style activity heatmap
- Per-project analytics
- CSV/JSON data export
- Privacy mode for screenshots

**Docker (recommended for this crowd):**

```bash
docker run -v ~/.claude:/home/node/.claude:ro -p 3000:3000 ghcr.io/dlupiak/claude-session-dashboard
```

Docker Compose:
```bash
git clone https://github.com/dlupiak/claude-session-dashboard.git
cd claude-session-dashboard
docker compose up
```

Note the `:ro` mount — the container only gets read access to your Claude data. It never writes to `~/.claude`, never phones home, no telemetry.

Settings are persisted to `~/.claude-dashboard/settings.json` on the host.

GitHub: https://github.com/dlupiak/claude-session-dashboard
Docker: https://github.com/dlupiak/claude-session-dashboard/pkgs/container/claude-session-dashboard

MIT license. Runs on Node.js 18+.

---

## Hacker News (Show HN)

> **Screenshots:** HN links directly to GitHub, so your README screenshots do the work.
> Make sure the README has these images visible in order:
> 1. `sessions-page.png` — first thing people see (already in README)
> 2. `session-detail-full.png` — full detail page (already in README)
> 3. `stats-overview.png` — stats overview (already in README)
> 4. `stats-projects.png` — project analytics (already in README)
>
> No inline images in HN comments. The README IS your visual pitch. Consider adding a short GIF/video showing the dashboard in action for extra impact.

**Title:** Show HN: Claude Session Dashboard – Local observability for Claude Code sessions

**URL:** https://github.com/dlupiak/claude-session-dashboard

**Comment (post as first comment):**

I built this to understand what's actually happening inside my Claude Code sessions.

Claude Code stores all session data locally as JSONL files in ~/.claude, but there's no built-in way to analyze it. After accumulating hundreds of sessions across dozens of projects, I had no visibility into token consumption, tool call patterns, or costs.

The dashboard scans your local directory and shows:

- Session list with search/filters/pagination
- Context window utilization per session
- Tool usage stats and Gantt-style timeline
- Cost estimation per session/agent/model (configurable for Free/Pro/Max tiers)
- GitHub-style contribution heatmap
- Per-project analytics
- CSV/JSON export
- Privacy mode for safe sharing

Runs entirely on localhost, read-only, no external calls. Built with TanStack Start (SSR on Vite), React Query, Tailwind CSS v4, Recharts, Zod. Vertical Slice Architecture.

Install: `npx claude-session-dashboard` or Docker with read-only mount.

Interesting finding: I discovered my custom agents were being invoked far less than expected, and certain tool patterns filled the context window much faster than others. Having this visibility changed how I structure my CLAUDE.md rules.

---

## LinkedIn

> **Screenshots to include:**
> 1. `session-detail.png` — lead image (shows context window, tool usage, cost — the "wow" factor)
> 2. `stats-overview.png` — heatmap + charts (visually striking)
> 3. `sessions-page.png` — session list
>
> LinkedIn supports up to 9 images in a post. Use 2-3 for best engagement. The first image shows as the preview — make it `session-detail.png`. Add brief captions to each image.

I've been going deep with Claude Code — building custom agents, delegation pipelines, CLAUDE.md orchestration rules — and hit a wall: there's no way to see what's actually happening inside your sessions.

How many tokens did that refactoring burn? Which tools does Claude call the most? Is the context window filling up mid-session? How much am I really spending?

All this data exists locally in ~/.claude, but there's no dashboard for it.

So I built one.

Claude Session Dashboard is a free, open-source, localhost-only web app that scans your local Claude Code data and gives you:

- Session browsing with search and filters
- Gantt-style timeline of tool calls and agent dispatches
- Cost estimation per session, per agent, per model
- GitHub-style contribution heatmap
- Per-project analytics
- CSV/JSON data export
- Privacy mode for safe screenshot sharing

No data leaves your machine. No account required. One command to start:

npx claude-session-dashboard

Built with TanStack Start, React Query, Tailwind CSS v4, and Recharts.

GitHub: https://github.com/dlupiak/claude-session-dashboard

If you're a Claude Code user, I'd love your feedback — what metrics matter most to you?

#ClaudeCode #Anthropic #DeveloperTools #OpenSource #AI #Observability

---

## X / Twitter Thread

> **Screenshot per tweet — this is key for engagement:**
> - Tweet 1: No image (or `session-detail.png` as hero image)
> - Tweet 2: `sessions-page.png` — session list
> - Tweet 3: `session-detail.png` — context window + tool usage + cost
> - Tweet 4: `session-detail-full.png` — zoomed out showing timeline section at bottom
> - Tweet 5: `stats-overview.png` — heatmap + charts
> - Tweet 6: No image needed (CTA tweet)
>
> Every tweet with an image gets significantly more engagement. Crop screenshots to focus on the relevant section if the full page is too much.

**Tweet 1:**
I built a free dashboard to see what's actually happening inside my Claude Code sessions.

Token usage, tool calls, agent dispatches, costs, timelines — all from your local ~/.claude data.

100% localhost. Read-only. Open source.

npx claude-session-dashboard

GitHub: https://github.com/dlupiak/claude-session-dashboard

🧵 Here's what it shows:

**Tweet 2:**
Session list — search and filter across all your projects, models, dates, and status. Sortable columns with pagination.

Active sessions are auto-detected with real-time polling.

[screenshot: sessions page]

**Tweet 3:**
Session detail — context window breakdown showing input, output, cache read, and cache creation tokens.

Tool usage frequency, agent dispatch history, and per-session cost estimates with model-level breakdowns.

[screenshot: session detail]

**Tweet 4:**
Gantt-style timeline — see exactly when every tool call, agent dispatch, and skill invocation happened during a session. Zoom in on any section.

This is where you spot context-eating patterns.

[screenshot: timeline]

**Tweet 5:**
Stats page — GitHub-style contribution heatmap, token trends over time, model usage distribution, and hourly activity patterns.

Plus per-project analytics with drill-down links.

[screenshot: stats page]

**Tweet 6:**
Other features:
- Cost estimation (configurable for Free/Pro/Max tiers)
- CSV/JSON export
- Privacy mode (anonymize paths for safe screenshots)
- Docker support with read-only mount

One command: npx claude-session-dashboard

MIT license. Contributions welcome.

https://github.com/dlupiak/claude-session-dashboard

---

## Dev.to Blog Post

> **Screenshots — embed inline throughout the article:**
> - After "Session browsing" paragraph: `sessions-page.png`
> - After "Session detail" paragraph: `session-detail.png`
> - After "Timeline" paragraph: crop from `session-detail-full.png` (bottom timeline section)
> - After "Stats" paragraph: `stats-overview.png`
> - After "Per-project analytics" paragraph: `stats-projects.png`
> - After "Privacy mode" mention: `settings-page.png`
>
> Dev.to supports markdown images. Use `![Alt text](URL)` with GitHub raw URLs:
> `![Session Detail](https://raw.githubusercontent.com/dlupiak/claude-session-dashboard/main/screenshots/session-detail.png)`
>
> This is a blog post — more screenshots is better. Show one for each section. Consider also adding a cover image (use `session-detail.png` or `stats-overview.png`).

**Title:** I built a free dashboard to visualize my Claude Code sessions — here's what I learned

**Tags:** claude, ai, opensource, webdev, typescript

**Body:**

## The problem

I've been using Claude Code heavily — custom agents, CLAUDE.md orchestration rules, skill pipelines, delegation patterns. But I had zero visibility into what was actually happening.

- Are my agents being invoked?
- What tools are they calling?
- How much context does each session consume?
- What does a session actually cost me?
- Which approach gives me the best results at the lowest cost?

Claude Code stores everything locally in `~/.claude` as JSONL files. Rich data, but no way to analyze it.

## The solution

I built **Claude Session Dashboard** — a free, open-source, localhost-only web app that scans your `~/.claude` directory and visualizes everything.

### What it shows

**Session browsing:** Search across all sessions, filter by project, model, date, status. Sortable with pagination. Active sessions are auto-detected.

**Session detail:** Context window utilization breakdown (input, output, cache read, cache creation). Tool usage frequency and duration. Agent dispatch history with per-agent token counts.

**Timeline:** Gantt-style chart showing exactly when every tool call, agent dispatch, and skill invocation fired. Zoom controls to drill into specific sections.

**Cost estimation:** Per-session and per-agent costs based on Anthropic pricing. Configurable for Free, Pro, and Max (5x/20x) subscription tiers. Model-level breakdowns.

**Stats:** GitHub-style contribution heatmap showing token usage intensity over the past year. Stacked area chart for token trends with daily/weekly toggle. Model usage distribution. Hourly activity patterns.

**Per-project analytics:** Dedicated tab with sortable table. Sessions, messages, tokens, and duration aggregated per project. Drill-down links to filtered session lists.

**Export:** CSV/JSON in four formats — session summaries, model usage, daily activity, project analytics.

**Privacy mode:** Anonymize project names, file paths, branch names. Safe for screenshots and presentations.

## Tech stack

- **TanStack Start** — SSR framework on Vite with file-based routing
- **TanStack React Query** — data fetching with caching and background refetch
- **Tailwind CSS v4** — CSS-first configuration
- **Recharts** — composable charting (area charts, heatmaps, Gantt timelines)
- **Zod** — runtime validation for server functions and URL params

Architecture is Vertical Slice — each feature (sessions, stats, cost-estimation, privacy, etc.) is a self-contained slice with its own server functions, queries, and UI components.

## What I learned

Having this dashboard changed how I structure my Claude Code workflows:

1. Some of my custom agents were being dispatched far less than expected
2. Certain tool call patterns filled the context window much faster than others
3. The cost difference between Opus and Sonnet sessions was larger than I assumed
4. My most productive sessions weren't the longest ones

## Get started

```bash
npx claude-session-dashboard
```

Or with Docker:
```bash
docker run -v ~/.claude:/home/node/.claude:ro -p 3000:3000 ghcr.io/dlupiak/claude-session-dashboard
```

GitHub: https://github.com/dlupiak/claude-session-dashboard
npm: https://www.npmjs.com/package/claude-session-dashboard

MIT license. No data leaves your machine. Contributions welcome.

---

What metrics do you track for your AI coding workflows? I'd love to hear what features would be most useful.

---

## Indie Hackers

> **Screenshots to include:**
> 1. `session-detail.png` — hero image (value prop at a glance)
> 2. `stats-overview.png` — analytics view
>
> Indie Hackers supports image uploads. Use 2 screenshots — keep it focused. This audience cares about the story and the insight, not exhaustive feature lists.

**Title:** Claude Session Dashboard — free observability for AI coding sessions

**Body:**

**What I built:** A localhost dashboard that analyzes your Claude Code (Anthropic's AI coding CLI) sessions. It reads local JSONL logs and shows you token usage, tool calls, costs, timelines, and activity trends.

**Why:** Claude Code stores rich session data locally, but there's no way to analyze it. After hundreds of sessions across dozens of projects, I needed visibility into what was working and what was wasting tokens.

**How it works:** Scans `~/.claude`, parses JSONL files, displays everything in a web UI. Read-only, never modifies data, never phones home. One command: `npx claude-session-dashboard`

**Tech:** TanStack Start, React Query, Tailwind CSS v4, Recharts, Zod. Vertical Slice Architecture.

**Key insight:** Building this revealed that my custom agent delegation patterns were firing ~40% less than expected, and certain tool combinations were burning through context 3x faster.

**What's next:** Looking for feedback from other Claude Code users. What would you want to see?

GitHub: https://github.com/dlupiak/claude-session-dashboard

---

## Discord (Anthropic / TanStack / Web Dev servers)

> **Screenshots:** Attach 1-2 images directly in Discord message.
> 1. `session-detail.png` — best single screenshot to show value
> 2. `stats-overview.png` — optional second image
>
> Discord previews the GitHub link with the README's first image, but uploading screenshots directly gets more attention.

**Short message for #showcase channels:**

Hey! I built an open-source dashboard for analyzing Claude Code sessions. It reads your local `~/.claude` data and shows you session history, tool usage, token consumption, cost estimates, Gantt timelines, and activity trends. Runs 100% on localhost, never modifies your data.

One command: `npx claude-session-dashboard`

GitHub: https://github.com/dlupiak/claude-session-dashboard

Would love feedback from other Claude Code users!

---

## Product Hunt

> **Screenshots — Product Hunt gallery (up to 8 images, first one is the hero):**
> 1. `session-detail.png` — HERO image (this shows in the feed)
> 2. `sessions-page.png` — session browsing
> 3. `stats-overview.png` — analytics with heatmap
> 4. `stats-projects.png` — per-project analytics
> 5. `session-detail-full.png` — full detail page
> 6. `settings-page.png` — settings + privacy mode
>
> Product Hunt is visual-first. Use all 6 screenshots. Consider also recording a short GIF or video walkthrough (30-60 seconds) — Product Hunt launches with video perform significantly better.

**Tagline:** Free, local observability dashboard for Claude Code sessions

**Description:**

Claude Code stores all session data locally — but gives you no way to analyze it. Claude Session Dashboard reads your local `~/.claude` directory and shows you:

- Session browsing with search and filters
- Context window utilization breakdown
- Tool usage stats and Gantt-style timeline
- Cost estimation per session, agent, and model
- GitHub-style contribution heatmap
- Per-project analytics
- CSV/JSON export
- Privacy mode for safe screenshots

100% localhost. Read-only. No account. No telemetry. MIT license.

One command: `npx claude-session-dashboard`

**Topics:** Developer Tools, Open Source, Artificial Intelligence, Productivity

**Makers comment:**

I built this because I was experimenting with different Claude Code workflows (agents, skills, CLAUDE.md rules) and had no way to measure what was actually happening. After building the dashboard, I discovered my custom agents were being dispatched less than expected and certain tool patterns consumed context much faster than others. That visibility changed how I structure my AI coding workflows.

---

## Awesome Lists — PR targets

Submit PRs to add the project to these curated lists:

- https://github.com/alvinunreal/awesome-claude — Claude ecosystem tools
- https://github.com/iCHAIT/awesome-subreddits — if applicable as a resource
- Search for any "awesome-developer-tools" or "awesome-ai-tools" lists on GitHub

**Entry format:**
```
- [Claude Session Dashboard](https://github.com/dlupiak/claude-session-dashboard) — Free, local-only observability dashboard for Claude Code sessions. Visualizes token usage, tool calls, costs, and activity trends.
```

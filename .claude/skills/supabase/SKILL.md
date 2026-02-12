---
name: supabase
description: Supabase Auth, Postgres, and RLS patterns for this project.
user-invocable: true
---

# Supabase Patterns

## Client Setup
- Browser client: `@/lib/supabase/client.ts` using `createBrowserClient` from `@supabase/ssr`
- Server client: `@/lib/supabase/server.ts` using `createServerClient` from `@supabase/ssr`
- Server client requires 3 args: url, key, `{ cookies: { getAll } }`
- For service-role clients: `getAll: () => []` is sufficient

## Environment Variables
- `VITE_SUPABASE_URL` — browser-safe, public
- `VITE_SUPABASE_ANON_KEY` — browser-safe, public
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never expose to client

## Database Rules
- Write explicit SQL migrations in `apps/web/supabase/migrations/`
- Enable RLS on ALL new tables
- Use `gen_random_uuid()` for default UUIDs
- Use `now()` for default timestamps
- No ORMs — use typed query helpers with Supabase client

## Auth
- Use Supabase Auth for user management
- Check auth in route `loader` or `beforeLoad`, not in components
- Server functions access auth via server Supabase client

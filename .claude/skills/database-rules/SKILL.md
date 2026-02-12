---
name: database-rules
description: Database migration, RLS, and query patterns
user_invocable: false
---

# Database Rules

## Migrations
- All schema changes via SQL migrations in `apps/web/supabase/migrations/`
- File naming: `YYYYMMDDHHMMSS_description.sql`
- Each migration is a single transaction — use `BEGIN; ... COMMIT;` for multi-statement
- Never modify existing migrations — create new ones for changes
- Test migrations locally with `supabase db reset`

## Row Level Security (RLS)
- RLS must be enabled on ALL tables: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- Every table needs at least one policy, even if it's permissive for authenticated users
- Common patterns:
  ```sql
  -- Authenticated users can read
  CREATE POLICY "read_own" ON agents FOR SELECT
    USING (auth.uid() = user_id);

  -- Service role bypasses RLS (for server functions)
  CREATE POLICY "service_all" ON agents FOR ALL
    USING (auth.role() = 'service_role');
  ```

## Queries
- No ORMs — use Supabase client directly
- Use typed query helpers from `@/lib/supabase/`
- Always handle query errors: `const { data, error } = await supabase.from(...)`
- Use `.select()` with explicit columns, not `*`

## Schema Design
- Use `uuid` primary keys: `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`
- Include audit columns: `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`
- Foreign keys with `ON DELETE CASCADE` where appropriate
- Use enums for fixed value sets: `CREATE TYPE task_status AS ENUM (...)`

## Supabase Client
- Server: `createServerClient(url, serviceRoleKey, { cookies: { getAll: () => [] } })`
- Client: `createBrowserClient(url, anonKey)`
- Never use service role key on the client

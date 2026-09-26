create table if not exists public.portfolio_config (id text primary key, value jsonb not null);
alter table public.portfolio_config enable row level security;
-- Reads and writes use the existing server-side service role, like other CMS tables.

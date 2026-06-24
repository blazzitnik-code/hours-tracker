-- Hours & Earnings Tracker — Supabase schema
-- Run this in the Supabase SQL editor.

-- =========================================================
-- ENTRIES: one work block. Overnight shifts belong to start date.
-- =========================================================
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  work_date   date not null,                 -- date of the START time
  start_time  time not null,                 -- local clock start
  end_time    time,                          -- null while a session is "running"
  crosses_midnight boolean not null default false, -- true if end_time < start_time
  label       text,                          -- free text: "Morning", "Popoldne", etc.
  status      text not null default 'worked' -- 'worked' | 'planned'
              check (status in ('worked','planned')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists entries_user_date_idx
  on public.entries (user_id, work_date);

-- =========================================================
-- SETTINGS: one row per user. Holds rate, rounding, tax config, locale.
-- All tax numbers pre-filled with 2026 Slovenian student-work defaults,
-- editable so the app survives annual legal changes.
-- =========================================================
create table if not exists public.settings (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  gross_rate       numeric(8,2) not null default 8.98,   -- EUR per hour, gross
  rounding         text not null default 'none'          -- 'none' | '15' | '30'
                   check (rounding in ('none','15','30')),
  piz_pct          numeric(5,2) not null default 13.95,  -- pension/disability %
  pdo_pct          numeric(5,2) not null default 0.90,   -- long-term care %
  akontacija_pct   numeric(5,2) not null default 22.50,  -- income tax advance %
  akontacija_threshold numeric(8,2) not null default 400.00, -- monthly gross trigger
  annual_allowance numeric(10,2) not null default 3886.35,   -- yearly tax relief cap
  locale           text not null default 'en'            -- 'en' | 'sl'
                   check (locale in ('en','sl')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY: each user sees only their own data.
-- =========================================================
alter table public.entries  enable row level security;
alter table public.settings enable row level security;

create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own settings" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- updated_at trigger
-- =========================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists entries_touch on public.entries;
create trigger entries_touch before update on public.entries
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- =========================================================
-- Auto-create a settings row when a user signs up.
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

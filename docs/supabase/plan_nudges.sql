-- The daily nudge (api/nudge.js saves it, api/nudge-send.js sends it).
-- One row per phone or browser that turned nudges on. Keyed by the push endpoint and linked to the plan id,
-- so it works before sign-in exists. Run this once in the Supabase SQL editor.
create table if not exists public.plan_nudges (
  endpoint    text primary key,
  plan_id     text not null,
  p256dh      text not null,
  auth        text not null,
  time        text not null check (time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),  -- their time, like 19:00
  tz          text not null,                                                 -- their time zone, like America/Chicago
  start_date  date,                                                          -- day 1 of their plan
  tier        text not null default 'free' check (tier in ('free', 'paid')),
  active      boolean not null default true,
  last_done   date,   -- the last day they did a step: no nudge that day
  last_sent   date,   -- the last day a nudge went out: one a day at most
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists plan_nudges_plan_idx on public.plan_nudges (plan_id);

-- Only the server (with the secret key) reads or writes this table. No public policies on purpose.
alter table public.plan_nudges enable row level security;
-- New tables start locked in this project, even to the server, so let the server's secret key in.
grant select, insert, update, delete on table public.plan_nudges to service_role;

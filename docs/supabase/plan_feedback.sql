-- What people tell the app, in their own words, while they work through a plan. It's the input for their next
-- week, month and plan, and it's how we learn what to make better.
-- Paste this into Supabase → SQL Editor → New query, then click Run. Run it once.
-- Only the server (with the secret key) can read or write it: row level security is on, with no public policies.
--
-- kind (ref) → data:
--   step     (day.ask, e.g. "3.1") → { feel: easy | okay | hard, note }
--   skip     (day.ask)             → { action: skip | change, note }   their gut call, and why
--   checkin  (day)                 → { day: full | half | rough, note }
--   receipt  (day)                 → { text }                          one line on what they did
--   note     (day)                 → { text }                          day 4 question, written down
--   lookback (week number)         → { did, changed, keep }
--   next     (week number)         → { asks: [{ choice: keep | change | done | pause, note }], pace: light | right | much, want }
--   app      (moment, e.g. "day3" or a timestamp) → { ease: yes | kind_of | not_really, text }
--   ask      (a timestamp)       → { text, status: next | removed }  an Ask added in the app (full app), for next week
create table if not exists public.plan_feedback (
  id bigint generated always as identity primary key,
  plan_id text not null,
  kind text not null,
  ref text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, kind, ref)
);
alter table public.plan_feedback enable row level security;
grant select, insert, update, delete on table public.plan_feedback to service_role;
grant usage, select on sequence public.plan_feedback_id_seq to service_role;
create index if not exists plan_feedback_plan_idx on public.plan_feedback (plan_id);

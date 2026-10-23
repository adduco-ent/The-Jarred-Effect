-- The plan engine's data: the data foundation (2026-10-22).
-- Paste all of this into Supabase → SQL Editor → New query, then click Run. Safe to run again: it only adds what's missing.
--
-- One log of everything people do (events), plus small tables built from it. A new kind of signal is a new `kind`
-- in events, never a new table, so the engine can keep learning without new SQL. Other Half is a self-discovery app:
-- what's learned here goes back to people as questions they can confirm or correct (memories), never a hidden profile.
-- Only the server (with the secret key) can read or write any of it: row level security is on, with no public
-- policies. delete_person() removes a person from every table. The journal never comes here; it stays on their phone.

-- Keeps updated_at current on the tables people edit.
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- 1. People: one row each. `link` is the id in their app's web address (/app/plan.html?id=…), the same id the app
--    already uses, so everything sent before sign-in existed still belongs to them.
create table if not exists public.people (
  id           uuid primary key default gen_random_uuid(),
  link         text not null unique check (link ~ '^[A-Za-z0-9_-]{8,64}$'),
  email        text,
  auth_user_id uuid unique references auth.users (id) on delete set null,  -- their sign-in, once sign-in exists
  tier         text not null default 'free' check (tier in ('free', 'paid')),
  type         text,                                                       -- their quiz type, e.g. achiever
  other_half   text,                                                       -- the side they use least
  life         jsonb,                                                      -- the quiz's life answers
  pace         int check (pace in (10, 20, 30, 45)),                       -- minutes they have most days
  tz           text,                                                       -- their time zone, like America/Chicago
  settings     jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index if not exists people_email_idx on public.people (lower(email)) where email is not null;
drop trigger if exists people_touch on public.people;
create trigger people_touch before update on public.people for each row execute function public.touch_updated_at();

-- 2. Goals: what they're going after, sorted into an area (lib/knowledge.js areas).
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references public.people (id) on delete cascade,
  text        text not null,
  area        text,                -- money, body, work, relationships, stop, creative, mindset
  also        text,                -- a second area, e.g. a habit to stop that's about the body
  kind        text,                -- the kind of goal within the area, e.g. save, debt, move, sleep
  status      text not null default 'active' check (status in ('active', 'paused', 'done', 'dropped')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists goals_person_idx on public.goals (person_id, status);
drop trigger if exists goals_touch on public.goals;
create trigger goals_touch before update on public.goals for each row execute function public.touch_updated_at();

-- 3. Plans: one row per person per week, saved exactly as the app shows it, with what wrote it.
create table if not exists public.plans (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references public.people (id) on delete cascade,
  week        int not null default 1 check (week >= 1),
  starts_on   date,
  status      text not null default 'live' check (status in ('draft', 'review', 'live', 'done')),
  knowledge   int,                 -- lib/knowledge.js version
  playbook    int,                 -- lib/playbook.js version
  model       text,                -- the model that wrote it, e.g. claude-opus-5-5
  plan        jsonb not null,      -- the plan as the app shows it
  created_at  timestamptz not null default now(),
  unique (person_id, week)
);

-- 4. Steps: one row per step, so we can see which plays work for whom. `ref` matches the app's "3.1" (day.position).
--    Their own steps ("+ Add your own step") live here too, as source 'own'.
create table if not exists public.plan_steps (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.plans (id) on delete cascade,
  person_id   uuid not null references public.people (id) on delete cascade,
  goal_id     uuid references public.goals (id) on delete set null,
  day         int not null check (day between 1 and 7),
  pos         int not null default 1 check (pos >= 1),
  ref         text generated always as (day::text || '.' || pos::text) stored,
  source      text not null default 'plan' check (source in ('plan', 'own')),
  area        text, path text, stage text,
  play        text,                -- the play it came from, e.g. tru-1
  side        text,                -- the side that play builds
  choice      text check (choice in ('fasting', 'calories', 'scale')),
  level       int not null default 1 check (level >= 1),
  minutes     int check (minutes between 0 and 120),
  title       text, what text, small text, why text, notice text,
  created_at  timestamptz not null default now(),
  unique (plan_id, day, pos)
);
create index if not exists plan_steps_person_idx on public.plan_steps (person_id, created_at desc);
create index if not exists plan_steps_play_idx on public.plan_steps (play);

-- 5. Events: everything they do, in order, never overwritten. Check-ins, steps done, how a step felt, skips and
--    changes with their reasons, notes, their own steps, look backs, nudges. `link` keeps an event that arrives before
--    a person row exists; it's matched to the person automatically.
create table if not exists public.events (
  id           bigint generated always as identity primary key,
  person_id    uuid references public.people (id) on delete cascade,
  link         text,
  step_id      uuid references public.plan_steps (id) on delete set null,
  kind         text not null check (kind ~ '^[a-z][a-z0-9_]{1,39}$'),
  ref          text,
  data         jsonb not null default '{}' check (pg_column_size(data) < 16384),
  at           timestamptz not null default now(),   -- when it happened
  received_at  timestamptz not null default now()
);
create index if not exists events_person_at_idx on public.events (person_id, at desc);
create index if not exists events_link_at_idx on public.events (link, at desc);
create index if not exists events_kind_at_idx on public.events (kind, at desc);

create or replace function public.events_find_person() returns trigger language plpgsql as $$
begin
  if new.person_id is null and new.link is not null then
    select id into new.person_id from public.people where link = new.link;
  end if;
  return new;
end $$;
drop trigger if exists events_person on public.events;
create trigger events_person before insert on public.events for each row execute function public.events_find_person();

-- When a person row is created for a link that already has events, those events become theirs.
create or replace function public.people_claim_events() returns trigger language plpgsql as $$
begin
  update public.events set person_id = new.id where link = new.link and person_id is null;
  return new;
end $$;
drop trigger if exists people_claim on public.people;
create trigger people_claim after insert on public.people for each row execute function public.people_claim_events();

-- 6. Daily summaries, built each night from events, so plans never have to read the whole log.
create table if not exists public.day_summaries (
  person_id      uuid not null references public.people (id) on delete cascade,
  day            date not null,
  checkin        text,             -- good, okay or hard
  steps_planned  int not null default 0,
  steps_done     int not null default 0,
  steps_skipped  int not null default 0,
  own_added      int not null default 0,
  own_done       int not null default 0,
  minutes_done   int not null default 0,
  data           jsonb not null default '{}',
  primary key (person_id, day)
);

-- 7. Memories: short things the app has noticed about them, always shown back in You as a question
--    (“You finished 4 of your 5 steps before noon this week. Mornings seem to suit you. Right?”). Their answer is kept.
create table if not exists public.memories (
  id           uuid primary key default gen_random_uuid(),
  person_id    uuid not null references public.people (id) on delete cascade,
  fact         text not null,      -- “Mornings seem to suit you better.”
  evidence     text,               -- what they did, with the real numbers
  area         text,
  status       text not null default 'new' check (status in ('new', 'asked', 'confirmed', 'corrected', 'dismissed')),
  their_words  text,               -- what they said back
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  answered_at  timestamptz
);
create index if not exists memories_person_idx on public.memories (person_id, status);
drop trigger if exists memories_touch on public.memories;
create trigger memories_touch before update on public.memories for each row execute function public.touch_updated_at();

-- 8. Insights: what the app learns across everyone, with no names attached and never from fewer than 20 people.
--    Drafted weekly; nothing shapes anyone's plan until Jarred approves it.
create table if not exists public.insights (
  id          uuid primary key default gen_random_uuid(),
  week        date not null,       -- the Monday of the week it was drafted
  about       jsonb not null,      -- e.g. {"area":"money","type":"achiever","play":"tru-1"}
  finding     text not null,
  people      int not null check (people >= 20),
  numbers     jsonb not null default '{}',
  status      text not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'retired')),
  note        text,                -- Jarred's note when he decides
  decided_at  timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists insights_status_idx on public.insights (status, week desc);

-- 9. The AI cost log: every call, its tokens and what it cost, so cost per person stays visible.
create table if not exists public.ai_runs (
  id                  bigint generated always as identity primary key,
  person_id           uuid references public.people (id) on delete set null,
  job                 text not null,       -- plan, check, day_line, memory, insights
  model               text not null,
  batch               boolean not null default false,
  input_tokens        int not null default 0,
  cache_read_tokens   int not null default 0,
  cache_write_tokens  int not null default 0,
  output_tokens       int not null default 0,
  cost_usd            numeric(10, 5) not null default 0,
  knowledge           int,
  ok                  boolean not null default true,
  error               text,
  created_at          timestamptz not null default now()
);
create index if not exists ai_runs_created_idx on public.ai_runs (created_at desc);
create index if not exists ai_runs_person_idx on public.ai_runs (person_id, created_at desc);

-- 10. Everything they've sent so far moves into the log (the feedback table keeps only each latest answer).
insert into public.events (link, kind, ref, data, at, received_at)
select f.plan_id, f.kind, f.ref, f.data, f.updated_at, f.updated_at
from public.plan_feedback f
where not exists (select 1 from public.events e where e.link = f.plan_id and e.kind = f.kind and e.ref = f.ref and e.at = f.updated_at);

-- 11. Delete my data: removes a person from every table, including the quiz, feedback and nudges.
create or replace function public.delete_person(p uuid) returns void
language plpgsql security definer set search_path = public as $$
declare l text; e text;
begin
  select link, email into l, e from public.people where id = p;
  if l is not null then
    delete from public.events where link = l;
    delete from public.plan_feedback where plan_id = l;
    delete from public.plan_nudges where plan_id = l;
  end if;
  if e is not null then delete from public.quiz_results where lower(email) = lower(e); end if;
  delete from public.people where id = p;  -- goals, plans, steps, events, summaries and memories go with it
end $$;

-- The same for someone who never got a person row: by their app link, their email, or both.
create or replace function public.delete_contact(p_link text, p_email text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_link is not null then
    delete from public.events where link = p_link;
    delete from public.plan_feedback where plan_id = p_link;
    delete from public.plan_nudges where plan_id = p_link;
  end if;
  if p_email is not null then delete from public.quiz_results where lower(email) = lower(p_email); end if;
end $$;

-- 12. Locked to the server. Events only ever grow: the server can add and delete them (for delete my data), and can
--     only fill in who an event belongs to, never change what happened.
alter table public.people enable row level security;
alter table public.goals enable row level security;
alter table public.plans enable row level security;
alter table public.plan_steps enable row level security;
alter table public.events enable row level security;
alter table public.day_summaries enable row level security;
alter table public.memories enable row level security;
alter table public.insights enable row level security;
alter table public.ai_runs enable row level security;

revoke all on public.people, public.goals, public.plans, public.plan_steps, public.events, public.day_summaries,
  public.memories, public.insights, public.ai_runs from anon, authenticated;
grant select, insert, update, delete on public.people, public.goals, public.plans, public.plan_steps,
  public.day_summaries, public.memories, public.insights to service_role;
grant select, insert, delete on public.events, public.ai_runs to service_role;
grant update (person_id) on public.events to service_role;
grant usage, select on sequence public.events_id_seq, public.ai_runs_id_seq to service_role;

revoke all on function public.delete_person(uuid), public.delete_contact(text, text) from public, anon, authenticated;
grant execute on function public.delete_person(uuid), public.delete_contact(text, text) to service_role;

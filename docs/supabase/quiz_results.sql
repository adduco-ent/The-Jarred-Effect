-- The quiz results table. Paste this into Supabase → SQL Editor → New query, then click Run. Run it once.
-- Only the server (with the secret key) can read or write it: row level security is on and there are no
-- public policies, so nobody can read anyone's results from the browser.
create table if not exists public.quiz_results (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null,
  type text not null,
  answers text not null,            -- 12 letters: a (A), o (or both), b (B)
  pairs jsonb not null,             -- where they lean on each pole pair, -2 to +2
  swing real,
  insight real,
  ask text,                         -- the one thing they want, if they named it
  source text
);
alter table public.quiz_results enable row level security;
grant select, insert, update, delete on table public.quiz_results to service_role;
grant usage, select on sequence public.quiz_results_id_seq to service_role;
create index if not exists quiz_results_email_idx on public.quiz_results (email);

-- 2026-10-22: about your life (optional answers: relationship, kids, work, caretaking). Run this once, any time.
-- Until it runs, results still save, just without these answers.
alter table public.quiz_results add column if not exists life jsonb;   -- e.g. {"rel":"married","kids":"home","work":["corporate","side"],"care":"no"}
alter table public.quiz_results add column if not exists words text;   -- their three words, if they gave them

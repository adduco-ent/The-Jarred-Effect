# Design archive, October 24, 2026

A snapshot of the design work from before the move to the Sky + Mirror direction.
The site and app code at this point is tagged in git as `restore/before-sky-mirror`.

This folder sits under `docs/`, which `.vercelignore` keeps off the live site.

## What's here

| Folder | What it is |
|---|---|
| `research/` | The research report and the three directions (Sky, Companion, Mirror) |
| `sky/` | The sky renderer (`render.html`), Day and Night pages, and the final sky photos |
| `directions/`, `fresh/`, `freshpick/`, `stylepick/`, `styles/`, `concepts/` | Homepage and hero direction mock-ups |
| `home-review/`, `guide-review/` | Review pages for the homepage and the guide page |
| `emails/` | The Supabase email templates copy page |
| `knowledge/`, `playbook/`, `playbook-v2/`, `plan-engine/`, `friend-voice/`, `wording/` | AI brain, playbook and voice review pages |
| `journal/`, `journal-prompts/`, `today-plan/` | App screen experiments |
| `checklist/`, `launch-checklist/` | The launch checklist |

Screenshots, test databases and browser profiles were left out.

## Published pages (claude.ai)

| Page | Link |
|---|---|
| Other Half Directions (research) | https://claude.ai/artifact/X2xpB2HKxbuHfLpHHtdSLD |
| Checklist | https://claude.ai/artifact/Qzpd6pnSx8aPNQkMBEAXNX |
| Knowledge review | https://claude.ai/artifact/6dih6hdBqhPUKgG75yafUF |
| Email templates | https://claude.ai/artifact/1saDeoo34m46KxGYSqGfHp |
| Homepage review | https://claude.ai/artifact/Kb369KmiTGgenALs53XtPK |
| Guide page review | https://claude.ai/artifact/XQPUH2wwKiRAzuN5unaWCy |
| Hero directions | https://claude.ai/artifact/MUXWvWJpSRn6SYDqFnC1AS |
| Style pick | https://claude.ai/artifact/8MKSke9sor7hcWwYwh83VY |
| Fresh directions | https://claude.ai/artifact/XJfU8RNp3bZvHTybZDGiKV |
| Day and Night | https://claude.ai/artifact/3YkPxB9D6gzuxQSaCeexJD |

## Going back

To see the site exactly as it was: `git checkout restore/before-sky-mirror`.
To bring back one file: `git checkout restore/before-sky-mirror -- path/to/file`.

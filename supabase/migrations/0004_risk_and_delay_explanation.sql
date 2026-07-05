-- Computed risk & delay explanations (change to phase 3 PM admin tool)

alter table public.deliverables
  add column due_date date,
  add column delay_explanation text;

alter table public.meetings
  alter column scheduled_at type timestamptz using scheduled_at::timestamptz;

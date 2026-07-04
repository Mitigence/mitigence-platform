-- Customer Workspace: row level security (phase 1)

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid()
$$;

-- clients
alter table public.clients enable row level security;

create policy "pm full access clients" on public.clients
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own clients row" on public.clients
  for select
  using (id = public.current_client_id());

-- profiles
alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select
  using (id = auth.uid());

create policy "pm reads all profiles" on public.profiles
  for select
  using (public.current_role() = 'pm');

-- projects
alter table public.projects enable row level security;

create policy "pm full access projects" on public.projects
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own projects" on public.projects
  for select
  using (client_id = public.current_client_id());

-- reports
alter table public.reports enable row level security;

create policy "pm full access reports" on public.reports
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own reports" on public.reports
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = reports.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- deliverables
alter table public.deliverables enable row level security;

create policy "pm full access deliverables" on public.deliverables
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own deliverables" on public.deliverables
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = deliverables.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- meetings
alter table public.meetings enable row level security;

create policy "pm full access meetings" on public.meetings
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own meetings" on public.meetings
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = meetings.project_id
      and p.client_id = public.current_client_id()
    )
  );

-- recommendations
alter table public.recommendations enable row level security;

create policy "pm full access recommendations" on public.recommendations
  for all
  using (public.current_role() = 'pm')
  with check (public.current_role() = 'pm');

create policy "client reads own recommendations" on public.recommendations
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = recommendations.project_id
      and p.client_id = public.current_client_id()
    )
  );

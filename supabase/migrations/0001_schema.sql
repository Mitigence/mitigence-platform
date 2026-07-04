-- Customer Workspace: core schema (phase 1)

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('pm', 'client')),
  client_id uuid references public.clients(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  constraint client_role_requires_client_id check (
    (role = 'client' and client_id is not null) or
    (role = 'pm' and client_id is null)
  )
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  phase text not null default '',
  progress int not null default 0 check (progress between 0 and 100),
  status text not null default 'On track',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  report_type text not null default '',
  report_date text not null default '',
  status text not null default 'Available',
  file_path text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item text not null,
  status text not null default 'pending' check (status in ('pending', 'in-progress', 'complete')),
  week_label text not null default '',
  file_path text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  meeting_type text not null default '',
  scheduled_at timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed')),
  mom_file_path text,
  created_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  finding text not null,
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  effort text not null check (effort in ('Low', 'Medium', 'High')),
  created_at timestamptz not null default now()
);

create index projects_client_id_idx on public.projects(client_id);
create index reports_project_id_idx on public.reports(project_id);
create index deliverables_project_id_idx on public.deliverables(project_id);
create index meetings_project_id_idx on public.meetings(project_id);
create index recommendations_project_id_idx on public.recommendations(project_id);

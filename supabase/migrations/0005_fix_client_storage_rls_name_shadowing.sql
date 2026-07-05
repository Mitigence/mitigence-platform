-- Fix client storage RLS: inside the correlated EXISTS subquery, the bare
-- `name` in storage.foldername(name) was being captured by
-- public.projects.name (projects also has a "name" column) instead of
-- referring to storage.objects.name (the file path). This meant the
-- policy compared folder segments of the *project's name string* against
-- the project id, which could never match -- clients could never
-- generate a signed URL for their own files.

drop policy "client reads own workspace files" on storage.objects;

create policy "client reads own workspace files" on storage.objects
  for select
  using (
    bucket_id = 'workspace-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(storage.objects.name))[1]
      and p.client_id = public.current_client_id()
    )
  );

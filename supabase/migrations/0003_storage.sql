-- Customer Workspace: storage policies (phase 1)
-- Path convention: {project_id}/{reports|deliverables|meetings}/{filename}

create policy "pm full access workspace files" on storage.objects
  for all
  using (bucket_id = 'workspace-files' and public.current_role() = 'pm')
  with check (bucket_id = 'workspace-files' and public.current_role() = 'pm');

create policy "client reads own workspace files" on storage.objects
  for select
  using (
    bucket_id = 'workspace-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
      and p.client_id = public.current_client_id()
    )
  );

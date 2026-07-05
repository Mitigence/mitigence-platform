import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { computeRecentActivity } from '@/lib/recent-activity'
import { getSignedFileUrls } from '@/lib/supabase/signed-urls'
import { signOutAction } from '@/app/actions/auth'
import { ClientWorkspace } from './client-workspace'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function WorkspaceProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, phase, progress')
    .eq('id', projectId)
    .single<{ id: string; name: string; phase: string; progress: number }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, title, report_type, report_date, status, file_path, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('deliverables')
        .select('id, item, status, week_label, due_date, delay_explanation, file_path, updated_at')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('updated_at'),
      supabase
        .from('meetings')
        .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
        .eq('project_id', projectId)
        .order('scheduled_at'),
      supabase
        .from('recommendations')
        .select('id, finding, priority, effort')
        .eq('project_id', projectId)
        .order('created_at'),
    ])

  const risk = computeProjectRisk(deliverables ?? [], meetings ?? [])
  const recentActivity = computeRecentActivity(deliverables ?? [], meetings ?? [], reports ?? [])

  const filePaths = [
    ...(reports ?? []).map((r) => r.file_path),
    ...(deliverables ?? []).map((d) => d.file_path),
    ...(meetings ?? []).map((m) => m.mom_file_path),
  ].filter((path): path is string => Boolean(path))

  const fileUrls = await getSignedFileUrls(supabase, filePaths)

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/workspace" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
            &larr; Your projects
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <ClientWorkspace
          project={project}
          risk={risk}
          recentActivity={recentActivity}
          reports={reports ?? []}
          deliverables={deliverables ?? []}
          meetings={meetings ?? []}
          recommendations={recommendations ?? []}
          fileUrls={fileUrls}
        />
      </div>
    </main>
  )
}

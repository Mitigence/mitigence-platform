import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { ProjectStatusForm } from './project-status-form'
import { RiskBadge } from './risk-badge'
import { ReportsSection } from './reports-section'
import { DeliverablesSection } from './deliverables-section'
import { MeetingsSection } from './meetings-section'
import { RecommendationsSection } from './recommendations-section'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_id, name, phase, progress')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
    }>()

  if (!project) notFound()

  const [{ data: reports }, { data: deliverables }, { data: meetings }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from('reports')
        .select('id, title, report_type, report_date, status, file_path')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('deliverables')
        .select('id, item, status, week_label, due_date, delay_explanation, file_path')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('updated_at'),
      supabase
        .from('meetings')
        .select('id, title, meeting_type, scheduled_at, status, mom_file_path')
        .eq('project_id', projectId)
        .order('created_at'),
      supabase
        .from('recommendations')
        .select('id, finding, priority, effort')
        .eq('project_id', projectId)
        .order('created_at'),
    ])

  const risk = computeProjectRisk(deliverables ?? [], meetings ?? [])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/clients/${project.client_id}`}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-8">{project.name}</h1>

        <ProjectStatusForm project={project} />
        <RiskBadge risk={risk} />
        <ReportsSection projectId={project.id} reports={reports ?? []} />
        <DeliverablesSection projectId={project.id} deliverables={deliverables ?? []} />
        <MeetingsSection projectId={project.id} meetings={meetings ?? []} />
        <RecommendationsSection projectId={project.id} recommendations={recommendations ?? []} />
      </div>
    </main>
  )
}

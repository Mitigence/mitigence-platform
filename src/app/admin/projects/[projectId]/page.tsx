import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ProjectStatusForm } from './project-status-form'
import { ReportsSection } from './reports-section'

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
    .select('id, client_id, name, phase, progress, status')
    .eq('id', projectId)
    .single<{
      id: string
      client_id: string
      name: string
      phase: string
      progress: number
      status: string
    }>()

  if (!project) notFound()

  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, report_type, report_date, status, file_path')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

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
        <ReportsSection projectId={project.id} reports={reports ?? []} />
      </div>
    </main>
  )
}

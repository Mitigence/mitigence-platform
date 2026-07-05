import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { computeProjectRisk } from '@/lib/risk'
import { RISK_STYLES } from '@/lib/risk-styles'
import { signOutAction } from '@/app/actions/auth'

export default async function WorkspacePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, phase')
    .order('created_at')

  const projectsWithRisk = await Promise.all(
    (projects ?? []).map(async (project) => {
      const [{ data: deliverables }, { data: meetings }] = await Promise.all([
        supabase.from('deliverables').select('item, status, due_date').eq('project_id', project.id),
        supabase.from('meetings').select('title, status, scheduled_at').eq('project_id', project.id),
      ])
      return {
        ...project,
        risk: computeProjectRisk(deliverables ?? [], meetings ?? []),
      }
    })
  )

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Your Projects</h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="space-y-2">
          {projectsWithRisk.map((project) => (
            <Link
              key={project.id}
              href={`/workspace/${project.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <div>
                <p className="text-white text-sm font-medium">{project.name}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${RISK_STYLES[project.risk.level]}`}
              >
                {project.risk.level}
              </span>
            </Link>
          ))}
          {projectsWithRisk.length === 0 && (
            <p className="text-zinc-600 text-sm">No projects yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NewProjectForm } from './new-project-form'
import { clientEmailForSlug } from '@/lib/site-config'

interface Props {
  params: Promise<{ clientId: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, slug')
    .eq('id', clientId)
    .single<{ id: string; name: string; slug: string }>()

  if (!client) notFound()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, phase')
    .eq('client_id', clientId)
    .order('created_at')

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
          &larr; All clients
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-1">{client.name}</h1>
        <p className="text-zinc-500 text-xs mb-8">{clientEmailForSlug(client.slug)}</p>

        <NewProjectForm clientId={client.id} />

        <div className="space-y-2">
          {(projects ?? []).map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <p className="text-white text-sm font-medium">{project.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
            </Link>
          ))}
          {(projects ?? []).length === 0 && (
            <p className="text-zinc-600 text-sm">No projects yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

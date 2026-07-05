import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'
import { NewClientForm } from './new-client-form'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, slug')
    .order('name')

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-zinc-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>

        <NewClientForm />

        <div className="space-y-2">
          {(clients ?? []).map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 p-4 transition-colors"
            >
              <p className="text-white text-sm font-medium">{client.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{client.slug}@mitigence.com</p>
            </Link>
          ))}
          {(clients ?? []).length === 0 && (
            <p className="text-zinc-600 text-sm">No clients yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

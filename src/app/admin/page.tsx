import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-1">Signed in as</p>
        <p className="text-white text-lg font-medium mb-6">{user.email}</p>
        <p className="text-zinc-500 text-xs mb-8">Role: pm</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}

'use client'

import { useActionState } from 'react'
import { signInAction, type LoginState } from './actions'

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-zinc-400 text-xs mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-zinc-400 text-xs mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm px-4 py-2.5 outline-none focus:border-red-600 transition-colors"
        />
      </div>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

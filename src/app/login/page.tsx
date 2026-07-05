import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  )
}

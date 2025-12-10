import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <AuthForm mode="login" />
    </main>
  )
}

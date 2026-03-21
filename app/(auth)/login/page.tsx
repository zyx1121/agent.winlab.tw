"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "keycloak",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: "openid",
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // On success, browser is redirected to Keycloak — no need to setLoading(false)
  }

  return (
    <div className="container max-w-sm py-24">
      <Card>
        <CardHeader>
          <CardTitle>WinLab Agent</CardTitle>
          <CardDescription>使用 WinLab Keycloak 帳號登入</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "跳轉中…" : "Sign in with Keycloak"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

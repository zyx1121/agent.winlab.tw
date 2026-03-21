"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBindingCode } from "@/lib/actions/binding"
import { useState } from "react"

const PLATFORMS = ["line", "telegram", "discord"] as const
type Platform = (typeof PLATFORMS)[number]

export default function BindPage() {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState<Platform>("line")
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setCode(null)
    try {
      const c = await generateBindingCode(platform)
      setCode(c)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Bind Bot Account</CardTitle>
          <CardDescription>
            Generate a code and send it to the bot to link your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {PLATFORMS.map((p) => (
              <Button
                key={p}
                variant={platform === p ? "default" : "outline"}
                onClick={() => setPlatform(p)}
                size="sm"
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? "Generating…" : "Generate Binding Code"}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {code && (
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">
                Send this command to the {platform} bot:
              </p>
              <Badge
                variant="secondary"
                className="font-mono text-2xl px-4 py-2 tracking-widest"
              >
                /bind {code}
              </Badge>
              <p className="text-xs text-muted-foreground">Expires in 10 minutes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use server"
import { createClient } from "@/lib/supabase/server"

export async function generateBindingCode(platform: string): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const res = await fetch(`${process.env.AGENT_API_URL}/bind/generate-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.id, platform }),
  })
  if (!res.ok) throw new Error("Failed to generate binding code")
  const json = await res.json()
  return json.code as string
}
